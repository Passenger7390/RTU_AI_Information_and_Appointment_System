import os
from fastapi import APIRouter
from fastapi.responses import FileResponse
import re

router = APIRouter(prefix="/map", tags=["maps"]) 
MAP_DIR = "MAP_RTU"

@router.get("/get-image/{folder}/{filename}")
async def getMapImage(folder: str, filename: str):
    """
        Get map image from the server.
    """
    file_path = os.path.join(MAP_DIR, folder, filename)
    print(f"finding image in {file_path}")
    return FileResponse(file_path)

@router.get("/list-images/{folder}")
async def list_map_images(folder: str, ):
    """ 
        This will return a list of all images in the selected folder
    """

    folder_path = os.path.join(MAP_DIR, folder)
    if not os.path.exists(folder_path):
        return {"error": "Folder does not exist"}
    
    files = os.listdir(folder_path)
    image_files = sorted([f for f in files if f.lower().endswith(('.jpg', '.png'))], 
                         key=natural_sort_key)

    return {"building_name": folder, "images": image_files}

def natural_sort_key(s):
    """Sort strings with numbers in a natural way (1, 2, 10 instead of 1, 10, 2)"""
    return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]

