from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from google import genai
from google.genai import types
from PIL import Image
import io
import os
import uuid
import requests
import shutil
from pydantic import BaseModel
from bs4 import BeautifulSoup

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, # Disable credentials to allow wildcard origin
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "online", "message": "Jewelry AI Backend is running"}

# API Key configuration
# API_KEY = "..." # REMOVED FOR SECURITY

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
DOWNLOAD_DIR = "backend/downloads" # Store downloaded pinterest images here

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Mount downloads directory to serve images to frontend
app.mount("/downloads", StaticFiles(directory=DOWNLOAD_DIR), name="downloads")

class AnalyzeRequest(BaseModel):
    url: str

def download_pinterest_image(url: str) -> str:
    """
    Downloads image from Pinterest URL by scraping og:image.
    Returns the path to the downloaded image.
    """
    try:
        # Create a unique subfolder for this download to avoid collisions
        unique_id = str(uuid.uuid4())
        output_path = os.path.join(DOWNLOAD_DIR, unique_id)
        os.makedirs(output_path, exist_ok=True)

        print(f"Downloading from Pinterest: {url} to {output_path}")
        
        # 1. Fetch the page content
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # 2. Parse HTML to find og:image
        soup = BeautifulSoup(response.text, 'html.parser')
        og_image = soup.find("meta", property="og:image")
        
        image_url = None
        if og_image and og_image.get("content"):
            image_url = og_image["content"]
        else:
            # Fallback: try to find the first large image
            # This is risky but better than nothing
            imgs = soup.find_all("img")
            for img in imgs:
                src = img.get("src")
                if src and "originals" in src:
                    image_url = src
                    break
        
        if not image_url:
             # If direct image link was passed
            if url.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                image_url = url
            else:
                raise Exception("Could not find image in Pinterest page")

        print(f"Found image URL: {image_url}")

        # 3. Download the image
        img_response = requests.get(image_url, stream=True)
        img_response.raise_for_status()
        
        filename = f"image.jpg" # Simple filename
        filepath = os.path.join(output_path, filename)
        
        with open(filepath, 'wb') as f:
            shutil.copyfileobj(img_response.raw, f)
            
        return filepath

    except Exception as e:
        print(f"Pinterest download failed: {e}")
        raise e

@app.post("/analyze-reference")
async def analyze_reference(request: AnalyzeRequest):
    try:
        # Download image using pinterest-dl
        image_path = download_pinterest_image(request.url)
        
        # Construct public URL for the image
        # Assuming backend is at localhost:8000
        rel_path = os.path.relpath(image_path, DOWNLOAD_DIR)
        public_url = f"http://localhost:8000/downloads/{rel_path}"

        # Return ONLY the image URL, no AI analysis
        return {
            "image_url": public_url
        }
    except Exception as e:
        print(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
async def generate_image(
    files: list[UploadFile] = File(...),
    style: str = Form(...),
    reference_url: str = Form(None),
    aspect_ratio: str = Form("4:5"),
    custom_prompt: str = Form(None),
    api_key: str = Form(None)
):
    try:
        # Enforce manual API key
        if not api_key or not api_key.strip():
            raise HTTPException(status_code=401, detail="API Key is required. Please enter it in Settings.")
            
        current_api_key = api_key
        # Create a client with the specific key for this request
        request_client = genai.Client(api_key=current_api_key)

        images = []
        for file in files:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))
            images.append(image)

        base_prompt = """
        You are a professional high-end jewelry retoucher and photographer.
        Your task is to transform the input smartphone photo(s) into a STUNNING, AWARD-WINNING studio photograph.
        
        CRITICAL INSTRUCTIONS:
        1. PRESERVE THE JEWELRY: The metal, stones, and design must remain exactly as they are in the input. Do not hallucinate new details on the jewelry itself.
        2. REMOVE IMPERFECTIONS: Clean up dust, fingerprints, and scratches on the metal.
        3. IGNORE REFERENCE CONTENT: If a reference image is provided, copy ONLY its lighting, background, and mood. IGNORE any text, watermarks, or the specific jewelry in the reference.
        """
        
        style_prompts = {
            "white": "Style: High-end E-commerce. Pure white background (#FFFFFF). Soft, even lighting that highlights the sparkle of stones. Sharp focus throughout.",
            "dark": "Style: Dark Luxury. Deep black or charcoal background. Dramatic rim lighting. Elegant reflections. The jewelry should pop against the dark void.",
            "macro": "Style: Macro Detail. Extremely shallow depth of field. Focus strictly on the main stone or detail. Soft, creamy bokeh background.",
            "creative": "Style: Creative Editorial. Artistic composition with textured background (silk, stone, or glass). Soft shadows. Magazine quality.",
            "custom": "Style: Custom based on reference."
        }
        
        prompt = f"{base_prompt}\n{style_prompts.get(style, '')}"

        if custom_prompt:
            prompt += f"\nADDITIONAL USER INSTRUCTIONS: {custom_prompt}"
        
        contents = [prompt] + images

        if reference_url:
            try:
                # Use the same download logic
                ref_image_path = download_pinterest_image(reference_url)
                ref_image = Image.open(ref_image_path)
                contents.append(ref_image)
                contents.append("REFERENCE IMAGE (Copy this style/lighting/background ONLY):")
            except Exception as e:
                print(f"Failed to load reference: {e}")

        print(f"Generating with style: {style}, AR: {aspect_ratio}")

        response = request_client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=contents,
            config=types.GenerateContentConfig(
                response_modalities=['TEXT', 'IMAGE'],
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio,
                    image_size="2K"
                ),
            )
        )

        generated_image_path = None
        
        for part in response.parts:
            if part.text:
                print(f"Model text response: {part.text}")
            elif image := part.as_image():
                filename = f"{uuid.uuid4()}.png"
                generated_image_path = os.path.join(OUTPUT_DIR, filename)
                image.save(generated_image_path)
                print(f"Image saved to {generated_image_path}")
                break 
        
        # Extract token usage if available
        input_tokens = 0
        output_tokens = 0
        if response.usage_metadata:
            input_tokens = response.usage_metadata.prompt_token_count
            output_tokens = response.usage_metadata.candidates_token_count

        if generated_image_path:
             return FileResponse(
                 generated_image_path,
                 headers={
                     "X-Input-Tokens": str(input_tokens),
                     "X-Output-Tokens": str(output_tokens)
                 }
             )
        else:
             raise HTTPException(status_code=500, detail="Failed to generate image")

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
