import jwt
import datetime
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv("PYTHON_APP_SECRET_KEY")
CORS(app, supports_credentials=True)

# Set up Supabase client
url = os.getenv("VITE_PROJECT_URL")
key = os.getenv("VITE_API_KEY")
supabase: Client = create_client(url, key)

@app.route('/login', methods=['POST'])
def login():
    print("Flask Secret:", app.config['SECRET_KEY'])
    print("Env Secret:", os.getenv("PYTHON_APP_SECRET_KEY"))
    print("Match?", app.config['SECRET_KEY'] == os.getenv("PYTHON_APP_SECRET_KEY"))
    data = request.get_json()
    name = data.get('name')
    password = data.get('password')

    user = None
    for table in ['Users', 'Instructor', 'Admin']:
        result = supabase.table(table).select("*").eq("name", name).maybe_single().execute()
        if result and result.data and result.data.get('password') == password:
            user = result.data  
            break

    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401

    token = jwt.encode({
        'id': user['id'],
        'name': user['name'],
        'role': user['type'],
        'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(hours=1)
    }, app.config['SECRET_KEY'], algorithm="HS256")

    print(f"Generated Token: {token}")  # Add this line to debug

    response = make_response(jsonify({
        'message': 'Login successful',
        'id': user['id'],
        'name': user['name'],
        'role': user['type']
    }))
    response.set_cookie(
        'token', token,
        httponly=True,
        secure=True,  # ✅ required with SameSite=None
        samesite='None',  # ✅ allows cross-origin cookies
        max_age=604800
    )


    return response 



@app.route('/me', methods=['GET'])
def get_current_user():
    token = request.cookies.get('token')
    print(f"Token: {token}")  # Add this for debugging
    if not token:
        return jsonify({'error': 'Unauthorized'}), 401

    try:
        decoded = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        return jsonify({
            'id': decoded['id'],
            'name': decoded['name'],
            'role': decoded['role']
        })
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401



if __name__ == "__main__":
    app.run(debug=True)
