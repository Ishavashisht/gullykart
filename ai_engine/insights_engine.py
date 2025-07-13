import os
import google.generativeai as genai
import json
import logging
from dotenv import load_dotenv

# --- Local Imports ---
from trend_researcher import get_live_fashion_trends

# --- Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

# --- Key Verification ---
google_api_key = os.getenv("GOOGLE_API_KEY")
if not google_api_key:
    raise ValueError("FATAL ERROR: GOOGLE_API_KEY missing from .env file.")
genai.configure(api_key=google_api_key)

# --- Constants ---
GEMINI_MODEL = "gemini-1.5-flash-latest"



def get_ai_powered_opportunities(seller_products: list):
    """
    This is the main AI function for finding trends and recommending products.
    It first uses an AI researcher to discover live trends from the web,
    and then uses an LLM to perform semantic matching against the seller's products.

    Args:
        seller_products (list): A list of the seller's products from the database.
                                Each product should be a dictionary with 'product_id', 
                                'product_name', and 'description'.

    Returns:
        list: A list of opportunities, where the AI has matched live trends to products.
    """
    if not seller_products:
        logging.warning("Seller product list is empty. Cannot generate opportunities.")
        return []

    
    logging.info("Calling the AI Trend Researcher to get live data...")
    live_trends_knowledge_base = get_live_fashion_trends()

    if not live_trends_knowledge_base:
        logging.error("The AI Trend Researcher failed to return any trends. Opportunity analysis cannot proceed.")
        return []

    logging.info(f"Live Trend Researcher succeeded. Starting AI matching for {len(seller_products)} products.")
    
   

    # Converting the product list into a simple string format for the prompt
    product_catalogue_str = "\n".join([f"- ID: {p['product_id']}, Name: {p['product_name']}, Description: {p.get('description', '')}" for p in seller_products])

    
    prompt = f"""
    You are an expert AI merchandiser for a hyperlocal e-commerce platform in India.
    Your task is to analyze a list of current trends (discovered via live web research) and a seller's product catalogue, then identify high-potential sales opportunities.

    **Current Trends Knowledge Base (Discovered via Live Web Research):**
    {json.dumps(live_trends_knowledge_base, indent=2)}

    **Seller's Product Catalogue:**
    {product_catalogue_str}

    **Your Task:**
    Analyze both lists. For each trend, find the top 1-2 BEST matching products from the seller's catalogue. A match should be based on style, occasion, fabric, and color mentioned in the trend's context and the product's name/description.

    **Output Format:**
    You MUST respond with ONLY a valid JSON array `[]`. Do not write any explanation before or after the JSON.
    Each object in the array should have these exact keys: "trend_name", "trend_context", and "recommended_product_ids".
    "recommended_product_ids" must be a list of the matching product IDs (e.g., ["p-01", "p-03"]).

    Example of a perfect response:
    [
      {{
        "trend_name": "Pastel Paradise Lehengas",
        "trend_context": "Subtle pastel shades like mint green and lavender are dominating the festive wear scene.",
        "recommended_product_ids": ["p-05"]
      }}
    ]
    """

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(prompt)
        
        
        clean_json_str = response.text.strip().replace("```json", "").replace("```", "")
        
        ai_opportunities = json.loads(clean_json_str)
        logging.info(f"AI successfully identified {len(ai_opportunities)} opportunities from live trends.")

        
        enriched_opportunities = []
        for opp in ai_opportunities:
            
            recommended_products = [p for p in seller_products if p['product_id'] in opp['recommended_product_ids']]
            if recommended_products:
                opp['recommended_products'] = recommended_products
                enriched_opportunities.append(opp)

        return enriched_opportunities

    except Exception as e:
        logging.error(f"Error calling Gemini for opportunity analysis: {e}")
        
        response_text = "No response"
        if 'response' in locals() and hasattr(response, 'text'):
            response_text = response.text
        logging.error(f"Failed prompt response: {response_text}")
        return [] 

# --- Testing ---
if __name__ == '__main__':
    # This is a sample seller's product catalogue.
    MOCK_SELLER_CATALOGUE = [
        {"product_id": "p-01", "product_name": "Royal Red and Gold Banarasi Silk Saree", "description": "A classic saree for festivals and weddings, woven with golden Zari thread.", "image_url": "..."},
        {"product_id": "p-02", "product_name": "Lightweight Lavender Organza Saree", "description": "A sheer and elegant organza saree in a trendy pastel lavender color, perfect for summer events.", "image_url": "..."},
        {"product_id": "p-03", "product_name": "Gujarati Mirror-Work Chaniya Choli", "description": "A vibrant and colorful traditional outfit perfect for Garba nights. Features intricate mirror and thread work.", "image_url": "..."},
        {"product_id": "p-04", "product_name": "Mint Green Pastel Anarkali Suit", "description": "A floor-length Anarkali suit in a soothing pastel green. Ideal for daytime weddings or festive parties.", "image_url": "..."}
    ]
    
    print("--- Testing the FINAL AI-Powered Insight Engine & Opportunity Hub ---")
    seller_opportunities = get_ai_powered_opportunities(seller_products=MOCK_SELLER_CATALOGUE)
    
    if seller_opportunities:
        print(f"\n--- AI Found {len(seller_opportunities)} Live Opportunities: ---")
        print(json.dumps(seller_opportunities, indent=2))
    else:
        print("\n--- AI failed to find any opportunities. Check logs and API keys. ---")
