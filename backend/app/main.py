from fastapi import FastAPI

app = FastAPI(
    title="CareerPilot API",
    description="AI-powered career and job matching assistant",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "message": "CareerPilot API is running",
        "status": "ok",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }