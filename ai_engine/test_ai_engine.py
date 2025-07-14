import logging
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai_engine.trend_researcher import get_live_fashion_trends
from ai_engine.insights_engine import get_ai_powered_opportunities
from ai_engine.magic import run_ai_generation_pipeline

logging.basicConfig(level=logging.INFO)

def test_trend_researcher():
    print("Testing get_live_fashion_trends()...")
    trends = get_live_fashion_trends()
    if trends:
        print(f"Success: Found {len(trends)} trends.")
        for trend in trends:
            print(trend)
    else:
        print("Failed to find any trends. Check API keys and logs.")

def test_insights_engine():
    print("\nTesting get_ai_powered_opportunities()...")
    mock_products = [
        {"product_id": "p-01", "product_name": "Royal Red and Gold Banarasi Silk Saree", "description": "A classic saree for festivals and weddings."},
        {"product_id": "p-02", "product_name": "Lightweight Lavender Organza Saree", "description": "A sheer and elegant organza saree."},
    ]
    opportunities = get_ai_powered_opportunities(mock_products)
    if opportunities:
        print(f"Success: Found {len(opportunities)} opportunities.")
        for opp in opportunities:
            print(opp)
    else:
        print("Failed to find any opportunities. Check API keys and logs.")

def test_magic_pipeline():
    print("\nTesting run_ai_generation_pipeline()...")
    result = run_ai_generation_pipeline(
        product_image_url="https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTAsDKKwiUTw_qkASFGUh3bR7WUHAfZ7ZBrKfPYYLfoV5n84-pRjf5BPGYhY1r4FDE1tdPvHWk23IpNkOdkF6EwFFkAg5iTxz9jfRMwIaKtPdx3M62elpLQ&usqp=CAc",
        product_name="Embroidery White Suit Set",
        event_name="Diwali",
        location="Delhi"
    )
    if result.get("success"):
        print("Success: AI generation pipeline completed.")
        print("Generated Ad Copy:", result.get("generated_ad_copy"))
        image_url = result.get("generated_image_url")
        if image_url:
            print("Generated Image URL (base64):", image_url[:100] + "...")
        else:
            print("Generated Image URL (base64): None (image generation disabled or failed)")
    else:
        print("Failed to run AI generation pipeline. Details:", result.get("details"))

if __name__ == "__main__":
    test_trend_researcher()
    test_insights_engine()
    test_magic_pipeline()
