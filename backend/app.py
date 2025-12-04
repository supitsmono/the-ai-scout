import os
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

from config import Config
from models import db, Agency, Model, VALID_STAGES
from auth import generate_token, require_auth

# ======================================================
# APP INITIALIZATION
# ======================================================

app = Flask(__name__)
app.config.from_object(Config)

UPLOAD_FOLDER = "uploads/model_photos"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

db.init_app(app)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
)

# ======================================================
# REGISTER
# ======================================================
@app.post("/api/register")
def register():
    data = request.get_json() or {}

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if Agency.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400

    from werkzeug.security import generate_password_hash
    hashed = generate_password_hash(password)

    agency = Agency(
        name=name,
        email=email,
        password_hash=hashed,
    )

    db.session.add(agency)
    db.session.commit()

    token = generate_token(agency.id)

    return jsonify({
        "token": token,
        "apply_link": f"/apply/{agency.apply_slug}"
    }), 200


# ======================================================
# LOGIN
# ======================================================
@app.post("/api/login")
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    from werkzeug.security import check_password_hash

    agency = Agency.query.filter_by(email=email).first()
    if not agency:
        return jsonify({"error": "Invalid email"}), 401

    if not check_password_hash(agency.password_hash, password):
        return jsonify({"error": "Invalid password"}), 401

    token = generate_token(agency.id)

    return jsonify({
        "token": token,
        "apply_link": f"/apply/{agency.apply_slug}"
    }), 200


# ======================================================
# AGENCY SETTINGS (GET + PATCH)
# ======================================================
@app.get("/api/agency/settings")
@require_auth
def get_settings(agency_id):
    agency = Agency.query.get_or_404(agency_id)
    return jsonify({
        "name": agency.name,
        "email": agency.email,
        "apply_link": f"/apply/{agency.apply_slug}"
    })


@app.patch("/api/agency/settings")
@require_auth
def update_settings(agency_id):
    agency = Agency.query.get_or_404(agency_id)
    data = request.get_json() or {}

    if "name" in data and data["name"]:
        agency.name = data["name"]

    db.session.commit()
    return jsonify({"success": True})


# ======================================================
# APPLY FORM SUBMISSION (TEXT + PHOTOS)
# ======================================================
@app.post("/api/apply/<token>")
def apply_to_agency(token):
    agency = Agency.query.filter_by(apply_slug=token).first()
    if not agency:
        return jsonify({"error": "Invalid apply link"}), 404

    form = request.form

    model = Model(
        agency_id=agency.id,
        name=form.get("name"),
        email=form.get("email"),
        age=form.get("age"),
        city=form.get("city"),
        instagram=form.get("instagram"),
        tiktok=form.get("tiktok"),
        height_cm=form.get("height_cm"),
        chest_cm=form.get("chest_cm"),
        waist_cm=form.get("waist_cm"),
        hips_cm=form.get("hips_cm"),
        notes=form.get("notes"),
        stage="incoming"
    )

    db.session.add(model)
    db.session.commit()

    def save_photo(field_name, index):
        file = request.files.get(field_name)
        if not file:
            return None
        filename = secure_filename(f"{model.id}_photo_{index}.jpg")
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)
        return filename

    model.photo_1 = save_photo("photo_1", 1)
    model.photo_2 = save_photo("photo_2", 2)
    model.photo_3 = save_photo("photo_3", 3)
    model.photo_4 = save_photo("photo_4", 4)

    db.session.commit()

    return jsonify({"success": True, "model_id": model.id}), 200


# ======================================================
# GET MODELS BY STAGE
# ======================================================
@app.get("/api/models")
@require_auth
def get_models(agency_id):
    stage = request.args.get("stage")

    query = Model.query.filter_by(agency_id=agency_id)
    if stage:
        query = query.filter_by(stage=stage)

    models = query.order_by(Model.created_at.desc()).all()
    return jsonify([m.to_dict() for m in models]), 200


# ======================================================
# UPDATE MODEL STAGE
# ======================================================
@app.patch("/api/models/<int:model_id>/stage")
@require_auth
def update_stage(agency_id, model_id):
    data = request.get_json() or {}
    new_stage = data.get("stage")

    if new_stage not in VALID_STAGES:
        return jsonify({"error": "Invalid stage"}), 400

    model = Model.query.filter_by(id=model_id, agency_id=agency_id).first_or_404()
    model.stage = new_stage
    db.session.commit()

    return jsonify({"message": "Stage updated", "stage": new_stage})


# ======================================================
# DASHBOARD STATS
# ======================================================
@app.get("/api/dashboard/stats")
@require_auth
def dashboard_stats(agency_id):
    total = Model.query.filter_by(agency_id=agency_id).count()

    return jsonify({
        "total": total,
        "incoming": Model.query.filter_by(agency_id=agency_id, stage="incoming").count(),
        "shortlisted": Model.query.filter_by(agency_id=agency_id, stage="shortlisted").count(),
        "contacted": Model.query.filter_by(agency_id=agency_id, stage="contacted").count(),
        "scouted": Model.query.filter_by(agency_id=agency_id, stage="scouted").count(),
        "archived": Model.query.filter_by(agency_id=agency_id, stage="archived").count(),
        "topMatches": 0,
        "newThisWeek": 0,
    })


# ======================================================
# START SERVER
# ======================================================
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
