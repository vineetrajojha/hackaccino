import os
import cv2
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau
from final import create_improved_model, preprocess_image

def load_dataset(data_dir):
    X = []
    y = []
    class_names = sorted(os.listdir(data_dir))
    
    for class_idx, class_name in enumerate(class_names):
        class_dir = os.path.join(data_dir, class_name)
        for img_name in os.listdir(class_dir):
            img_path = os.path.join(class_dir, img_name)
            img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
            if img is not None:
                processed_img = preprocess_image(img)
                X.append(processed_img)
                y.append(class_idx)
    
    return np.array(X), np.array(y), class_names

def train_model():
    # Load dataset
    data_dir = "dataset"  # Path to your dataset directory
    X, y, class_names = load_dataset(data_dir)
    
    # Convert labels to one-hot encoding
    y = np.eye(len(class_names))[y]
    
    # Create data augmentation generator
    datagen = ImageDataGenerator(
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        validation_split=0.2
    )
    
    # Create model
    model = create_improved_model()
    
    # Define callbacks
    checkpoint = ModelCheckpoint(
        'best_model.h5',
        monitor='val_accuracy',
        save_best_only=True,
        mode='max',
        verbose=1
    )
    
    early_stopping = EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True
    )
    
    reduce_lr = ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.2,
        patience=5,
        min_lr=1e-6
    )
    
    # Train model
    history = model.fit(
        datagen.flow(X, y, batch_size=32, subset='training'),
        validation_data=datagen.flow(X, y, batch_size=32, subset='validation'),
        epochs=50,
        callbacks=[checkpoint, early_stopping, reduce_lr]
    )
    
    # Save the model
    model.save('sign_language_model.h5')
    
    # Save class names
    with open('class_names.pkl', 'wb') as f:
        import pickle
        pickle.dump(class_names, f)
    
    return history

if __name__ == '__main__':
    train_model() 