# authenticate.py
import os.path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Must match the scopes in your server application
SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

def main():
    creds = None
    # Check if token.json exists
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    
    # If no credentials or they're invalid, let the user log in
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            # Make sure credentials.json is in the same directory
            flow = InstalledAppFlow.from_client_secrets_file(
                "credentials.json", SCOPES
            )
            creds = flow.run_local_server(port=8080)
        
        # Save the credentials
        with open("token.json", "w") as token:
            token.write(creds.to_json())
    
    print("Authentication successful!")
    print("token.json has been created/updated.")
    print("You can now transfer this file to your server.")

if __name__ == "__main__":
    main()