from fastapi import APIRouter, WebSocket, Depends, status
from jose import jwt, JWTError
from app.core.config import settings
from app.websockets.cart_manager import ConnectionManager

router = APIRouter()

manager = ConnectionManager()

async def get_user_id_from_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        user_id = payload.get("user_id") 
        return email
    except JWTError:
        return None

@router.websocket("/ws/cart")
async def websocket_endpoint(websocket: WebSocket):
    token = websocket.query_params.get("token")
    user = await get_user_id_from_token(token)

    if user is None:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await manager.connect(user, websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        pass
    finally:
        manager.disconnect(user, websocket)
