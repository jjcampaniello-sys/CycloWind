from fastapi import FastAPI
from routing import best_route

app = FastAPI()

@app.get("/route")
def get_route(wind_dir: float = 0, wind_speed: float = 10):
    path = best_route(wind_dir, wind_speed)
    return {"route": path}
