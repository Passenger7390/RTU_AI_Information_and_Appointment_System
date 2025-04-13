import os
from fastapi import APIRouter
from fastapi.responses import FileResponse

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
    image_files = [f for f in files if f.lower().endswith('.jpg')]

    return {"building_name": folder, "images": image_files}

