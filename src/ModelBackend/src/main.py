from fastapi import FastAPI, File, UploadFile
import tensorflow as tf
from keras.preprocessing import image
import numpy as np
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO

app = FastAPI()

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the pre-trained model
model_path = "models/freshfind.h5"
model = tf.keras.models.load_model(model_path)

# Define the list of labels for classification
labels = ['Broccoli', 'Hourse Mackerel', 'apple', 'Black Sea Sprat', 'Sea Bass', 'Carrot', 'coconut', 'Cabbage', 'Shrimp', 'dragonfruit', 'avocado', 'Cucumber', 'Red Sea Bream', 'banana','Potato']
labels.sort()

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Read the image file contents
        contents = await file.read()
        
        # Open the image from the byte data
        img = image.load_img(BytesIO(contents), target_size=(200, 200))  # Resize to match model's input size
        img_array = image.img_to_array(img)  # Convert image to numpy array
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension

        # Make the prediction
        predictions = model.predict(img_array)

        # Get the class with the highest probability
        predicted_class = labels[np.argmax(predictions)]

        return {"predicted_class": predicted_class, "predictions": predictions.tolist()}

    except Exception as e:
        return {"error": str(e)}
