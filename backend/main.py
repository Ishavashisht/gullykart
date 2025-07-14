# import pathlib, sys, logging
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel

# # ── local import path ───────────────────────────────────────────
# current_dir = pathlib.Path(__file__).parent.resolve()
# sys.path.append(str(current_dir))

# # bring the real function in and alias it as generate_campaign
# from ai_engine.pipeline import run_ai_generation_pipeline as generate_campaign

# # ── FastAPI app ─────────────────────────────────────────────────
# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ── request schema ──────────────────────────────────────────────
# class CampaignRequest(BaseModel):
#     product_image_url: str
#     product_name: str
#     event_name: str
#     location: str

# # ── route ───────────────────────────────────────────────────────
# @app.post("/generate-kit")
# def generate_kit(req: CampaignRequest):
#     try:
#         return generate_campaign(**req.model_dump())
#     except Exception as e:
#         logging.exception("Campaign generation failed")
#         raise HTTPException(status_code=500, detail=str(e))

# # ── optional direct run ─────────────────────────────────────────
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)



import pathlib, sys, logging
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import os

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ── local import path ───────────────────────────────────────────
current_dir = pathlib.Path(__file__).parent.resolve()
sys.path.append(str(current_dir))

# bring the real function in and alias it as generate_campaign
from ai_engine.pipeline import run_ai_generation_pipeline as generate_campaign

# ── FastAPI app ─────────────────────────────────────────────────
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static assets setup ─────────────────────────────────────────
os.makedirs("generated_assets", exist_ok=True)
app.mount("/static", StaticFiles(directory="generated_assets"), name="static")

# ── request schema ──────────────────────────────────────────────
class CampaignRequest(BaseModel):
    product_image_url: str
    product_name: str
    event_name: str
    location: str

# ── route ───────────────────────────────────────────────────────
@app.post("/generate-kit")
def generate_kit(req: CampaignRequest):
    try:
        result = generate_campaign(**req.model_dump())

        # Ensure correct image paths in API response
        image_filename = result.get("image_filename")
        flyer_filename = result.get("flyer_filename")
        ad_copy = result.get("ad_copy")

        return {
            "generated_image_url": f"/static/{image_filename}" if image_filename else None,
            "generated_ad_copy": ad_copy or ""
        }

    except Exception as e:
        logging.exception("Campaign generation failed")
        raise HTTPException(status_code=500, detail=str(e))

# ── optional direct run ─────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
