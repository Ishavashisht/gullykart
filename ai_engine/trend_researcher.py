import os
import google.generativeai as genai
import requests
import json
import logging
from dotenv import load_dotenv

# --- Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
load_dotenv()

# --- Key Verification ---
google_api_key = os.getenv("GOOGLE_API_KEY")
search_api_key = os.getenv("GOOGLE_SEARCH_API_KEY")
search_engine_id = os.getenv("GOOGLE_SEARCH_ENGINE_ID")

if not all([google_api_key, search_api_key, search_engine_id]):
    raise ValueError("FATAL ERROR: A Google API key is missing from the .env file.")
genai.configure(api_key=google_api_key)

# --- Constants ---
GEMINI_MODEL = "gemini-1.5-flash-latest"
GOOGLE_SEARCH_URL = "https://www.googleapis.com/customsearch/v1"

def get_live_fashion_trends():
    """
    This AI function performs web research to discover current fashion trends.
    It returns a structured list of trends ready for use by the Opportunity Hub.
    """
    logging.info("Starting AI-powered web research for live fashion trends...")
    
    # 1. Performing a targeted Google Search
    search_query = "latest ethnic fashion trends India 2024 for festivals"
    params = {
        'key': search_api_key,
        'cx': search_engine_id,
        'q': search_query,
        'num': 5 # Getting the top 5 results
    }
    
    try:
        response = requests.get(GOOGLE_SEARCH_URL, params=params)
        response.raise_for_status()
        search_results = response.json().get('items', [])
        
        if not search_results:
            logging.warning("Google Search returned no results.")
            return []
            
        # Extracting snippets from search results to feed to the LLM
        search_context = "\n".join([f"Source: {res['link']}\nSnippet: {res['snippet']}" for res in search_results])
        logging.info(f"Gathered context from {len(search_results)} web sources.")

    except Exception as e:
        logging.error(f"Error calling Google Search API: {e}")
        return []

    # 2. Using Gemini to Analyze the Research and Create the Trend Base
    prompt = f"""
    You are an expert fashion analyst. I have provided you with snippets from recent articles about ethnic fashion trends in India.
    Your task is to read all of this information and synthesize it into a structured JSON list of distinct trends.

    **Web Research Snippets:**
    {search_context}

    **Your Task:**
    Identify 3-4 major, distinct fashion trends from the snippets. For each trend, create a JSON object containing:
    1.  `trend_id`: A unique ID like "trend_anarkali_suits".
    2.  `trend_name`: A short, catchy name for the trend (e.g., "Regal Anarkali Suits").
    3.  `context`: A one-sentence description explaining the trend, suitable for a seller.
    4.  `suggestion_keyword`: A single, simple keyword for matching (e.g., "anarkali").

    **Output Format:**
    You MUST respond with ONLY a valid JSON array `[]`. Do not write any explanation.
    
    Example of a perfect response:
    [
      {{
        "trend_id": "trend_pastel_lehengas",
        "trend_name": "Pastel Paradise Lehengas",
        "context": "Subtle pastel shades like mint green and lavender are dominating the festive wear scene.",
        "suggestion_keyword": "pastel"
      }},
      {{
        "trend_id": "trend_organza_sarees",
        "trend_name": "Sheer Organza Sarees",
        "context": "Lightweight and elegant, organza sarees with floral prints are a top choice for day events.",
        "suggestion_keyword": "organza"
      }}
    ]
    """

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(prompt)
        clean_json_str = response.text.strip().replace("```json", "").replace("```", "")
        live_trends = json.loads(clean_json_str)
        logging.info(f"AI successfully synthesized {len(live_trends)} live trends from web research.")
        return live_trends

    except Exception as e:
        logging.error(f"Error in Gemini analysis of web research: {e}")
        return []

# --- Testing ---
if __name__ == '__main__':
    print("--- Testing the Live AI Trend Researcher ---")
    trends = get_live_fashion_trends()
    
    if trends:
        print(f"\n--- AI discovered {len(trends)} live trends: ---")
        print(json.dumps(trends, indent=2))
    else:
        print("\n--- AI Trend Researcher failed to discover trends. Check API keys and logs. ---")
