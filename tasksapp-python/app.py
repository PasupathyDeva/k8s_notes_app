from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import socket
app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = "mongodb://mongo:27017/dev"
mongo = PyMongo(app)
db = mongo.db
@app.route("/")
def index():
    hostname = socket.gethostname()
    return jsonify(
        message="Welcome to notes app!"
    )
@app.route("/notes")
def get_all_notes():
    notes = db.note.find()
    data = []
    for note in notes:
        item = {
            "id": str(note["_id"]),
            "note_title": note["note"]["note_title"],
            "note_text": note["note"]["note_text"]          
            
        }
        data.append(item)
    return jsonify(
        data=data
    )

@app.route("/get_note/<id>")
def get_one_note(id):    
    notes = db.note.find({"_id": ObjectId(id)})
    data = []
    for note in notes:
        item = {
            "id": str(note["_id"]),
            "note_title": note["note"]["note_title"],
            "note_text": note["note"]["note_text"]          
            
        }
        data.append(item)
    return jsonify(
        data=data
    )
    
@app.route("/note", methods=["POST"])
def create_note():
    data = request.get_json(force=True)
    db.note.insert_one({"note": data["note"]})
    return jsonify(
        message="Note saved successfully!"
    )
@app.route("/note/<id>", methods=["PUT"])
def update_note(id):
    data = request.get_json(force=True)["note"]
    response = db.note.update_one({"_id": ObjectId(id)}, {"$set": {"note": data}})
    if response.matched_count:
        message = "Note updated successfully!"
    else:
        message = "No note found!"
    return jsonify(
        message=message
    )
@app.route("/note/<id>", methods=["DELETE"])
def delete_note(id):
    response = db.note.delete_one({"_id": ObjectId(id)})
    if response.deleted_count:
        message = "Note deleted successfully!"
    else:
        message = "No note found!"
    return jsonify(
        message=message
    )
@app.route("/notes/delete", methods=["POST"])
def delete_all_notes():
    db.note.delete_many({})
    return jsonify(
        message="All notes deleted!"
    )
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
