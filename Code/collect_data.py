import cv2
import numpy as np
import os
from final import get_img_contour_thresh

def create_dataset():
    # Create dataset directory if it doesn't exist
    if not os.path.exists("dataset"):
        os.makedirs("dataset")
    
    # Create directories for each gesture
    gestures = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    for gesture in gestures:
        if not os.path.exists(f"dataset/{gesture}"):
            os.makedirs(f"dataset/{gesture}")
    
    # Initialize camera
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not open camera")
        return
    
    # Set camera resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    # Parameters
    x, y, w, h = 300, 100, 300, 300
    samples_per_gesture = 1000
    current_gesture = 0
    count = 0
    
    print("Press 'c' to capture image, 'n' for next gesture, 'q' to quit")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame")
            break
        
        # Get hand contour and threshold
        img, contours, thresh = get_img_contour_thresh(frame)
        
        # Draw rectangle for hand region
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 2)
        
        # Display instructions
        cv2.putText(img, f"Gesture: {current_gesture}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.putText(img, f"Count: {count}", (10, 70),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Show the frame
        cv2.imshow("Collecting Data", img)
        cv2.imshow("Threshold", thresh)
        
        key = cv2.waitKey(1) & 0xFF
        
        if key == ord('c'):
            # Save the thresholded image
            roi = thresh[y:y+h, x:x+w]
            if roi.size > 0:
                roi = cv2.resize(roi, (50, 50))
                cv2.imwrite(f"dataset/{current_gesture}/{count}.jpg", roi)
                count += 1
                print(f"Saved image {count} for gesture {current_gesture}")
        
        elif key == ord('n'):
            if count >= samples_per_gesture:
                current_gesture += 1
                count = 0
                if current_gesture >= len(gestures):
                    print("Dataset collection complete!")
                    break
                print(f"Moving to gesture {current_gesture}")
            else:
                print(f"Please collect {samples_per_gesture} samples for gesture {current_gesture}")
        
        elif key == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    create_dataset() 