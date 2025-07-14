import os
import logging
import base64
import io
import requests
from PIL import Image
from dotenv import load_dotenv
import google.generativeai as genai
from huggingface_hub import InferenceClient

# --- Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

# --- Environment Variables ---
google_api_key = os.getenv("GOOGLE_API_KEY")
hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")  # ✅ Using HUGGINGFACEHUB_API_TOKEN for clarity

if not google_api_key or not hf_token:
    logging.error("FATAL ERROR: GOOGLE_API_KEY or HUGGINGFACEHUB_API_TOKEN missing from .env file.")
    exit()

# --- Model Config ---
GOOGLE_TEXT_MODEL = "models/gemini-1.5-flash-latest"
HF_IMAGE_MODEL = "stabilityai/sdxl-turbo"  # ✅ Free-tier model

# --- API Clients ---
genai.configure(api_key=google_api_key)
hf_client = InferenceClient(model=HF_IMAGE_MODEL, token=hf_token)  # ✅ Direct call to model (no routing)

# --- Main Function ---
def run_ai_generation_pipeline(
    product_image_url: str,
    product_name: str,
    event_name: str,
    location: str
) -> dict:
    logging.info(f"🚀 Starting AI generation pipeline for '{product_name}'...")

    # --- Step 1: Generate Ad Copy ---
    try:
        logging.info("✍️ Generating ad copy with Google Gemini...")
        model = genai.GenerativeModel(GOOGLE_TEXT_MODEL)
        ad_prompt = (
            f"You are a skilled marketing copywriter for Meesho. "
            f"Write one short, exciting WhatsApp marketing message for a '{product_name}'. "
            f"The campaign is for {event_name} in {location}. Include an emoji. Output ONLY the message."
        )
        generated_ad_copy = model.generate_content(ad_prompt).text.strip()
        logging.info(f"✅ Generated Ad Copy: {generated_ad_copy}")
    except Exception as e:
        logging.error(f"❌ Error generating ad copy: {e}")
        return {"error": "Failed to generate ad copy.", "details": str(e)}

    # --- Step 2: Describe Image with Gemini Vision ---
    try:
        logging.info("🖼️ Analyzing product image with Gemini Vision...")
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(product_image_url, headers=headers)
        response.raise_for_status()
        product_image = Image.open(io.BytesIO(response.content))

        vision_model = genai.GenerativeModel(GOOGLE_TEXT_MODEL)
        vision_prompt = (
            "You are an AI assistant. Look at this image of a clothing item. "
            "Describe it in a short, descriptive phrase suitable for a text-to-image AI prompt. "
            "Focus on the style, color, and any visible patterns. "
            "Example: 'a blue silk kurta with white floral embroidery'. Just output the phrase."
        )
        response = vision_model.generate_content([vision_prompt, product_image])
        image_description = response.text.strip()
        logging.info(f"✅ Product description: {image_description}")
    except Exception as e:
        logging.error(f"❌ Error analyzing image: {e}")
        return {"error": "Failed to analyze product image.", "details": str(e)}

    # --- Step 3: Generate Image using Hugging Face ---
    try:
        logging.info("🎨 Generating model image using Hugging Face SDXL Turbo...")
        final_prompt = (
            f"cinematic photo of a happy young indian woman wearing ({image_description}). "
            f"She is celebrating the {event_name} festival in {location}. "
            f"festive background, hyperrealistic, detailed, professional photo, 8k"
        )
        logging.info(f"Prompt: {final_prompt}")

        image = hf_client.text_to_image(
            prompt=final_prompt,
            negative_prompt="blurry, watermark, bad anatomy",
            width=512,
            height=512
        )

        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        base64_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
        generated_image_url = f"data:image/jpeg;base64,{base64_image}"
        logging.info("✅ Image generation complete.")
    except Exception as e:
        logging.error(f"❌ Error generating image: {e}")
        return {"error": "Failed to generate model image.", "details": str(e)}

    # --- Final Output ---
    return {
        "success": True,
        "generated_image_url": generated_image_url,
        "generated_ad_copy": generated_ad_copy
    }

# --- Local test ---
if __name__ == '__main__':
    print("--- 🔬 Local Test: Running the pipeline ---")
    final_kit = run_ai_generation_pipeline(
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTAsDKKwiUTw_qkASFGUh3bR7WUHAfZ7ZBrKfPYYLfoV5n84-pRjf5BPGYhY1r4FDE1tdPvHWk23IpNkOdkF6EwFFkAg5iTxz9jfRMwIaKtPdx3M62elpLQ&usqp=CAc", 
        "Embroidery White Suit Set", 
        "Diwali", 
        "Delhi"
    )
    import json
    print(json.dumps(final_kit, indent=2))
