from fastapi import APIRouter

router = APIRouter()

@router.get("/login")
async def login():
    return {"message": "This is the login endpoint of the auth router."}
