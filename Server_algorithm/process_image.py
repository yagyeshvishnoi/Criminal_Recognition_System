import time
import psycopg2
import numpy as np
import face_recognition
import json

# Record the starting time
start_time = time.time()

# Connect to your PostgreSQL database
conn = psycopg2.connect(
    dbname="Images_pro",
    user="postgres",
    password="root",
    host="localhost",
    port="5432"
)

# Open a cursor to perform database operations
cur = conn.cursor()

# Fetch the face encodings from the database
cur.execute("SELECT image_name, encoding FROM final_encodings")

# Construct a dictionary to store the face encodings
database_faces = {}
for row in cur:
    image_name = row[0]
    encoding_bytes = row[1]
    # Convert bytea to numpy array
    encoding_np = np.frombuffer(encoding_bytes, dtype=np.float64)
    # Convert numpy array to face encoding
    face_encoding = np.array(encoding_np)
    database_faces[image_name] = face_encoding

# Load Input Image
input_image_path = "uploads/received_image.jpg"  # Assuming unknown.jpg is the input image
input_image = face_recognition.load_image_file(input_image_path)

# Encode Input Face
input_face_encodings = face_recognition.face_encodings(input_image)

# Calculate Similarity Scores and Store in a List of Tuples
similarity_scores = []
for input_encoding in input_face_encodings:
    for image_name, database_encoding in database_faces.items():
        similarity_score = face_recognition.face_distance([database_encoding], input_encoding)
        if similarity_score < 0.5:  # Only consider similarity scores below 0.5
            similarity_scores.append((image_name.replace('.jpg', ''), similarity_score))

# Sort the List of Tuples by Similarity Score in Ascending Order
similarity_scores.sort(key=lambda x: x[1])

#details from persons db
person_details = []
for image_name, _ in similarity_scores:
    cur.execute("SELECT id, name, date_of_birth, weight, hair, sex, height, race, eyes, admission_date, projected_parole_date, last_paroled_date, projected_discharge_date, parole_date, electronic_detention_date, discharge_date, parent_institution, offender_status, location, sex_offender_registry_required, alias FROM persons WHERE id = %s", (image_name,))
    person_row = cur.fetchone()
    if person_row:
        person_details.append(person_row)

# Record the ending time
end_time = time.time()

# Construct JSON output
output_data = {
    "recognized_faces": [
        {
            "id": person[0],
            "name": person[1],
            "date_of_birth": str(person[2]),
            "weight": person[3],
            "hair": person[4],
            "sex": person[5],
            "height": person[6],
            "race": person[7],
            "eyes": person[8],
            "admission_date": str(person[9]),
            "projected_parole_date": str(person[10]),
            "last_paroled_date": str(person[11]),
            "projected_discharge_date": str(person[12]),
            "parole_date": str(person[13]),
            "electronic_detention_date": str(person[14]),
            "discharge_date": str(person[15]),
            "parent_institution": person[16],
            "offender_status": person[17],
            "location": person[18],
            "sex_offender_registry_required": person[19],
            "alias": person[20]
        }
        for person in person_details
    ],
    "processing_time_seconds": end_time - start_time
}
# Print JSON output
print(json.dumps(output_data, indent=4))

# Close cursor and connection
cur.close()
conn.close()
