from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    x1: float; y1: float; x2: float; y2: float

class Detection(BaseModel):
    letter: str = Field(pattern=r"^[A-Z]$")
    class_id: int = Field(ge=0, le=25)
    confidence: float = Field(ge=0.0, le=1.0)
    box: BoundingBox

class PredictionResponse(BaseModel):
    detections: list[Detection]
    image_width: int
    image_height: int
    inference_ms: float
    model_version: str

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_version: str

class ModelMetadata(BaseModel):
    name: str
    architecture: str
    classes: list[str]