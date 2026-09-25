from fastapi import FastAPI, UploadFile
from fastapi.responses import Response
from .schemas import HealthResponse, ModelMetadata, PredictionResponse, Detection, BoundingBox

app = FastAPI(title="SignLive API")

CLASSES = [chr(i) for i in range(ord("A"), ord("Z") + 1)]

@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", model_loaded=False, model_version="mock")

@app.get("/model/metadata", response_model=ModelMetadata)
def metadata():
    return ModelMetadata(name="signlive-yolo", architecture="YOLO11n", classes=CLASSES)

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile):
    return PredictionResponse(
        detections=[Detection(
            letter="A", class_id=0, confidence=0.95,
            box=BoundingBox(x1=10, y1=10, x2=100, y2=100)
        )],
        image_width=640, image_height=480,
        inference_ms=12.5, model_version="mock"
    )

@app.post("/predict/visualize")
async def predict_visualize(file: UploadFile):
    png_1x1 = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82'
    return Response(content=png_1x1, media_type="image/png")