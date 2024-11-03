from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # Allow CORS for all routes

# MySQL database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="receipeblog"
    )

# Add New Recipe
@app.route('/recipes', methods=['POST'])
def add_recipe():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    category_id = data.get('category_id')
    user_id = data.get('user_id')

    if not title or not description or not category_id or not user_id:
        return jsonify({"message": "All fields are required!"}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO recipes (title, description, category_id, user_id, likes) VALUES (%s, %s, %s, %s, %s)", 
            (title, description, category_id, user_id, 0)  # Initialize likes to 0
        )
        db.commit()
        recipe_id = cursor.lastrowid
        return jsonify({"message": "Recipe created successfully!", "recipe_id": recipe_id}), 201
    except Error as err:
        return jsonify({"message": f"Error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

# Get Top Liked Recipes
@app.route('/top-recipes', methods=['GET'])
def get_top_recipes():
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM recipes WHERE likes >= 150 ORDER BY likes DESC LIMIT 10")
        recipes = cursor.fetchall()
        
        recipe_list = []
        for recipe in recipes:
            recipe_list.append({
                "recipe_id": recipe[0],
                "title": recipe[1],
                "description": recipe[2],
                "category_id": recipe[3],
                "user_id": recipe[4],
                "likes": recipe[5],
                "created_at": recipe[6]
            })

        return jsonify(recipe_list), 200
    except Error as err:
        return jsonify({"message": f"Error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

# User Signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')  # Get password directly from the user

    if not username or not email or not password:
        return jsonify({"message": "All fields are required!"}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor()
        # Insert password without hashing
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, password))
        db.commit()
        return jsonify({"message": "User created successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Both username and password are required!"}), 400

    try:
        db = get_db_connection()
        cursor = db.cursor()
        # Select username and password from the database
        cursor.execute("SELECT id, password FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()  # Fetch user data

        if user:  # Check if user exists
            user_id, stored_password = user  # Unpack user ID and stored password
            
            if stored_password == password:  # Compare plaintext password directly
                return jsonify({"message": "Login successful!", "user_id": user_id}), 200
            else:
                return jsonify({"message": "Invalid credentials!"}), 401
        else:
            return jsonify({"message": "User does not exist!"}), 404
            
    except mysql.connector.Error as err:
        return jsonify({"message": f"Error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

# New Endpoint: Get User Recipes
@app.route('/get-recipes/<int:user_id>', methods=['GET'])
def get_user_recipes(user_id):
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM recipes WHERE user_id = %s", (user_id,))
        recipes = cursor.fetchall()
        
        recipe_list = []
        for recipe in recipes:
            recipe_list.append({
                "recipe_id": recipe[0],
                "title": recipe[1],
                "description": recipe[2],
                "category_id": recipe[3],
                "user_id": recipe[4],
                "likes": recipe[5],
                "created_at": recipe[6]
            })

        return jsonify(recipe_list), 200
    except Error as err:
        return jsonify({"message": f"Error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

# New Endpoint: Search Recipes
@app.route('/search-recipes', methods=['GET'])
def search_recipes():
    query = request.args.get('q')
    try:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM recipes WHERE title LIKE %s", ('%' + query + '%',))
        recipes = cursor.fetchall()
        
        recipe_list = []
        for recipe in recipes:
            recipe_list.append({
                "recipe_id": recipe[0],
                "title": recipe[1],
                "description": recipe[2],
                "category_id": recipe[3],
                "user_id": recipe[4],
                "likes": recipe[5],
                "created_at": recipe[6]
            })

        return jsonify(recipe_list), 200
    except Error as err:
        return jsonify({"message": f"Error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

# Main entry point
if __name__ == '__main__':
    app.run(debug=True)
