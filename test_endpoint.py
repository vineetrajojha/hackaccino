import requests

def test_sign_language_endpoint():
    url = "http://localhost:8000/analyze-sign-language"
    
    # Open the video file
    with open("test.mp4", "rb") as f:
        files = {
            "video": ("test.mp4", f, "video/mp4")
        }
        
        # Make the request
        response = requests.post(url, files=files)
        
        # Print the response
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_sign_language_endpoint() 