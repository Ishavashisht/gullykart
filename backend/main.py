clearimport os, io, base64, logging, requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware
import sys
import pathlib

current_dir = pathlib.Path(__file__).parent.resolve()
sys.path.append(str(current_dir))

from auth.auth_router import router as auth_router

load_dotenv()

# Setup Keys
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Constants
GOOGLE_TEXT_MODEL = "models/gemini-1.5-flash-latest"
FALLBACK_IMG = "https://i.imgur.com/ExdKOOz.png"
STABILITY_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image"
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")

# App
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/auth")

class CampaignRequest(BaseModel):
    product_image_url: str
    product_name: str
    event_name: str
    location: str

@app.post("/generate-kit")
def generate_kit(payload: CampaignRequest):
    try:
        logging.info("Generating ad copy")
        model = genai.GenerativeModel(GOOGLE_TEXT_MODEL)
        ad_copy_prompt = f"You are a skilled marketing copywriter for Meesho. Write one short, exciting WhatsApp marketing message for a '{payload.product_name}'. The campaign is for {payload.event_name} in {payload.location}. Include an emoji. Output ONLY the message."
        response = model.generate_content(ad_copy_prompt)
        generated_ad_copy = response.text.strip()

        logging.info("Analyzing product image")
        try:
            response = requests.get(payload.product_image_url, headers={'User-Agent': 'Mozilla/5.0'})
            product_image = Image.open(io.BytesIO(response.content))
        except Exception:
            response = requests.get(FALLBACK_IMG, headers={'User-Agent': 'Mozilla/5.0'})
            product_image = Image.open(io.BytesIO(response.content))

        vision_prompt = "Describe the clothing item in this image in a short phrase like 'red silk saree with gold border'."
        response = model.generate_content([vision_prompt, product_image])
        image_description = response.text.strip()

        logging.info("Generating model image with Stability AI")
        headers = {
            "Authorization": f"Bearer {STABILITY_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        payload_json = {
            "text_prompts": [{"text": f"cinematic photo of a happy young indian woman wearing ({image_description}), celebrating {payload.event_name} in {payload.location}, festive background, sharp focus"}],
            "cfg_scale": 7,
            "clip_guidance_preset": "FAST_BLUE",
            "height": 512,
            "width": 512,
            "samples": 1,
            "steps": 30
        }
        response = requests.post(STABILITY_API_URL, headers=headers, json=payload_json)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Stability AI image generation failed.")

        result = response.json()
        image_base64 = result["artifacts"][0]["base64"]
        image_url = f"data:image/png;base64,{image_base64}"

        return {
            "generated_image_url": image_url,
            "generated_ad_copy": generated_ad_copy
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
