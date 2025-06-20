import os
import shutil
from datetime import datetime, timedelta
from database import create_session, db_connect
from models import Image

def seed_default_ads():
    """Seed the database with default advertisements"""
    engine, connection = db_connect()
    session = create_session(engine)
    
    # Define your default ads with very long expiration (10 years from now)
    default_ads = [
        {
            "filename": "495270669_4037854079782753_7233487156580564601_n.png",
            "title": "Welcome to RTU",
            "duration": 30,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        {
            "filename": "495271678_682267551286616_8683821948330678548_n.jpg", 
            "title": "Campus Information",
            "duration": 45,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        {
            "filename": "503644897_696161763219724_3139995688994114089_n.jpg", 
            "title": "Join the Community",
            "duration": 15,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        {
            "filename": "506909051_2419311938451699_4025034719744751668_n.png", 
            "title": "Join RTU",
            "duration": 30,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        {
            "filename": "506949437_1156370726178963_6079065342307270329_n.jpg", 
            "title": "ASDASDASD",
            "duration": 45,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        {
            "filename": "507135952_1773850003200648_6717218985362230390_n.jpg", 
            "title": "ASDASASDASDDASD",
            "duration": 45,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        {
            "filename": "507137081_1431974141145237_8761883406158834815_n.jpg", 
            "title": "ASDASDASASASDASDDASD",
            "duration": 45,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        {
            "filename": "508351087_720501787374396_8945355479669430513_n.jpg", 
            "title": "ASDASDASASASDASDDASASDASDD",
            "duration": 45,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        {
            "filename": "509806788_1060064626216402_2986879097712467429_n.jpg", 
            "title": "ASDASDASASASDASKJDDASASDASDD",
            "duration": 45,
            "expires_in": datetime.now() + timedelta(days=10957)  # 10 years
        },
        
    ]
    
    UPLOAD_DIR = "uploads"
    SEED_DIR = "seed_images"  # Directory containing your default images
    
    with session as db:
        for ad_data in default_ads:
            # Check if image already exists
            existing = db.query(Image).filter(Image.filename == ad_data["filename"]).first()
            if existing:
                print(f"Image {ad_data['filename']} already exists, skipping...")
                continue
            
            # Copy image file to uploads directory
            seed_path = os.path.join(SEED_DIR, ad_data["filename"])
            upload_path = os.path.join(UPLOAD_DIR, ad_data["filename"])
            
            if os.path.exists(seed_path):
                shutil.copy2(seed_path, upload_path)
                
                # Create database entry
                new_image = Image(
                    filename=ad_data["filename"],
                    title=ad_data["title"], 
                    duration=ad_data["duration"],
                    expires_in=ad_data["expires_in"]
                )
                
                db.add(new_image)
                print(f"Added {ad_data['filename']} to database")
            else:
                print(f"Warning: {seed_path} not found")
        
        db.commit()
        print("Default ads seeded successfully!")

if __name__ == "__main__":
    seed_default_ads()