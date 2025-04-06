import cv2
import numpy as np

def create_test_video():
    # Create a test video file
    output_file = 'test.mp4'
    fps = 30
    frame_size = (640, 480)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_file, fourcc, fps, frame_size)

    # Create some frames with a moving circle
    for i in range(90):  # 3 seconds of video
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        # Draw a moving circle
        x = int(320 + 200 * np.sin(i * 2 * np.pi / 90))
        y = int(240 + 200 * np.cos(i * 2 * np.pi / 90))
        cv2.circle(frame, (x, y), 30, (0, 255, 0), -1)
        out.write(frame)

    out.release()
    print(f"Created test video: {output_file}")

if __name__ == "__main__":
    create_test_video() 