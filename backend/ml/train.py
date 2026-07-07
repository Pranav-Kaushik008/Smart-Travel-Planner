import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pickle

# Fix current path resolution
current_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(os.path.dirname(current_dir), "data", "destinations.csv")
models_dir = os.path.join(os.path.dirname(current_dir), "models")

if not os.path.exists(models_dir):
    os.makedirs(models_dir)

model_save_path = os.path.join(models_dir, "recommendation_model.pkl")

print(f"Reading dataset from {data_path}...")
df = pd.read_csv(data_path)

le_type = LabelEncoder()
le_season = LabelEncoder()
le_destination = LabelEncoder()

df["type"] = le_type.fit_transform(df["type"])
df["season"] = le_season.fit_transform(df["season"])
df["destination"] = le_destination.fit_transform(df["destination"])

X = df[["budget", "days", "type", "season"]]
y = df["destination"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.15, random_state=42)

print("Training Random Forest model...")
model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42, class_weight="balanced")
model.fit(X_train, y_train)

# Evaluate
train_acc = model.score(X_train, y_train)
test_acc = model.score(X_test, y_test)
print(f"Train Accuracy: {train_acc * 100:.2f}%")
print(f"Test Accuracy: {test_acc * 100:.2f}%")

# Save model and encoders
with open(model_save_path, "wb") as f:
    pickle.dump((model, le_type, le_season, le_destination), f)

print(f"Model and Encoders successfully saved to: {model_save_path}")