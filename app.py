from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///grades.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Student(db.Model):
    name = db.Column(db.String(100), primary_key=True)
    grade = db.Column(db.Float, nullable=False)

with app.app_context():
    db.create_all()

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/grades", methods=["GET"])
def get_all_grades():
    students = Student.query.all()
    return jsonify({s.name: s.grade for s in students})

@app.route("/grades/<name>", methods=["GET"])
def get_one_grade(name):
    student = Student.query.get(name)
    if student:
        return jsonify({student.name: student.grade})
    return jsonify({"error": "Student not found"}), 404

@app.route("/grades", methods=["POST"])
def add_student():
    data = request.get_json()

    if not data or "name" not in data or "grade" not in data:
        return jsonify({"error": "Invalid input"}), 400

    name = data["name"]
    grade = data["grade"]

    student = Student(name=name, grade=grade)
    db.session.add(student)
    db.session.commit()

    return jsonify({name: grade}), 201

@app.route("/grades/<name>", methods=["PUT"])
def update_student(name):
    student = Student.query.get(name)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    data = request.get_json()

    if not data or "grade" not in data:
        return jsonify({"error": "Invalid input"}), 400

    student.grade = data["grade"]
    db.session.commit()

    return jsonify({student.name: student.grade})

@app.route("/grades/<name>", methods=["DELETE"])
def delete_student(name):
    student = Student.query.get(name)

    if not student:
        return jsonify({"error": "Student not found"}), 404

    deleted_grade = student.grade
    db.session.delete(student)
    db.session.commit()

    return jsonify({name: deleted_grade})

if __name__ == "__main__":
    app.run(debug=True)