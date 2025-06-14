from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, products, cart, orders, websocket_cart, admin
import os

app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])
app.include_router(websocket_cart.router)

@app.get("/")
async def root():
    return {"message": "E-commerce API is running"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="E-commerce API",
        version="1.0.0",
        description="Clean Architecture E-commerce Backend",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }
    for path in openapi_schema["paths"].values():
        for method in path.values():
            method["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi