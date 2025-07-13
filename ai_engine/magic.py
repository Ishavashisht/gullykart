import os
import google.generativeai as genai
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
import logging
import base64
import io
from PIL import Image
import requests



# --- Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

# --- Key Verification ---
google_api_key = os.getenv("GOOGLE_API_KEY")
hf_token = os.getenv("HUGGINGFACE_API_TOKEN")

if not google_api_key or not hf_token:
    logging.error("FATAL ERROR: GOOGLE_API_KEY or HUGGINGFACE_API_TOKEN missing from .env file.")
    exit()


genai.configure(api_key=google_api_key)
hf_client = InferenceClient(token=hf_token)


# --- Constants ---
GOOGLE_TEXT_MODEL = "models/gemini-1.5-flash-latest"

HF_IMAGE_MODEL = "stabilityai/stable-diffusion-xl-base-1.0"




def run_ai_generation_pipeline(
    product_image_url: str,
    product_name: str,
    event_name: str,
    location: str
) -> dict:
    logging.info(f"Starting AI generation pipeline for '{product_name}'...")
    
    # --- Step 1: Generate Ad Copy with Google Gemini ---
    try:
        logging.info("Generating ad copy with Google Gemini...")
        model = genai.GenerativeModel(GOOGLE_TEXT_MODEL)
        ad_copy_prompt = f"You are a skilled marketing copywriter for Meesho. Write one short, exciting WhatsApp marketing message for a '{product_name}'. The campaign is for {event_name} in {location}. Include an emoji. Output ONLY the marketing message."
        response = model.generate_content(ad_copy_prompt)
        generated_ad_copy = response.text.strip()
        logging.info(f"Successfully generated ad copy: '{generated_ad_copy}'")
    except Exception as e:
        logging.error(f"Error calling Google Gemini API: {e}")
        return {"error": "Failed to generate ad copy.", "details": str(e)}

    # --- Step 2: Generate Image with Hugging Face InferenceClient (Stable Diffusion XL) ---
    try:
        logging.info("Analyzing product image with Gemini Vision...")
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.get(product_image_url, headers=headers)
        response.raise_for_status()
        product_image = Image.open(io.BytesIO(response.content))

        vision_model = genai.GenerativeModel(GOOGLE_TEXT_MODEL)
        
       
        vision_prompt = "You are an AI assistant. Look at this image of a clothing item. Describe it in a short, descriptive phrase suitable for a text-to-image AI prompt. Focus on the style, color, and any visible patterns. For example: 'a blue silk kurta with white floral embroidery'. Just output the phrase."
        
        response = vision_model.generate_content([vision_prompt, product_image])
        image_description = response.text.strip()
        logging.info(f"AI-generated product description: '{image_description}'")

    except Exception as e:
        logging.error(f"Error analyzing image with Gemini Vision: {e}")
        return {"error": "Failed to analyze product image.", "details": str(e)}

    # --- Step 3: Generate New Image with Hugging Face Text-to-Image ---
    try:
        logging.info(f"Generating model image with Hugging Face Text-to-Image...")
        
        
        final_image_prompt = (
            f"cinematic photo of a happy young indian woman wearing ({image_description}). "
            f"She is celebrating the {event_name} festival in {location}. "
            f"festive background, professional photo, hyperdetailed, sharp focus, 8k"
        )
        logging.info(f"Final image prompt: {final_image_prompt}")

        
        image = hf_client.text_to_image(
            prompt=final_image_prompt,
            negative_prompt="blurry, ugly, disfigured, bad anatomy, deformed, watermark, text"
        )
        
        
        buffer = io.BytesIO()
        image.save(buffer, format="JPEG")
        base64_image = base64.b64encode(buffer.getvalue()).decode('utf-8')
        generated_image_url = f"data:image/jpeg;base64,{base64_image}"
        logging.info("Successfully generated and encoded image.")

    except Exception as e:
        logging.error(f"Error calling Hugging Face Text-to-Image: {e}")
        return {"error": "Failed to generate model image.", "details": str(e)}

    
    logging.info("AI generation pipeline completed successfully.")
    return {
        "success": True,
        "generated_image_url": generated_image_url,
        "generated_ad_copy": generated_ad_copy
    }

# Testing
if __name__ == '__main__':
    print("--- Running a direct test of the AI generation pipeline (Gemini + HF Client) ---")
    final_kit = run_ai_generation_pipeline(
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTAsDKKwiUTw_qkASFGUh3bR7WUHAfZ7ZBrKfPYYLfoV5n84-pRjf5BPGYhY1r4FDE1tdPvHWk23IpNkOdkF6EwFFkAg5iTxz9jfRMwIaKtPdx3M62elpLQ&usqp=CAc", 
        "Embroidery White Suit Set", 
        "Diwali", 
        "Delhi"
    )
    print("\n--- TEST FINISHED. FINAL MARKETING KIT: ---")
    import json
    print(json.dumps(final_kit, indent=2))
