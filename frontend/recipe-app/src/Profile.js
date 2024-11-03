import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ userId }) => {
    const [recipes, setRecipes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await axios.get(`http://localhost:5000/get-recipes/${userId}`);
            setRecipes(response.data);
        };
        fetchRecipes();
    }, [userId]);

    const addRecipe = async (e) => {
        e.preventDefault();
        await axios.post('http://localhost:5000/add-recipe', { title, description, user_id: userId });
        setTitle('');
        setDescription('');
        // Re-fetch recipes
        const response = await axios.get(`http://localhost:5000/get-recipes/${userId}`);
        setRecipes(response.data);
    };

    return (
        <div className="profile-container">
            <h1>Your Recipes</h1>
            <form onSubmit={addRecipe}>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Recipe Title" 
                    required 
                />
                <textarea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Recipe Description" 
                    required 
                ></textarea>
                <button type="submit">Add Recipe</button>
            </form>
            <div className="recipe-list">
                {recipes.map(recipe => (
                    <div key={recipe.recipe_id} className="recipe-card">
                        <h2>{recipe.title}</h2>
                        <p>{recipe.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Profile;
