import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Home.css';

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate(); // Get navigate function

    useEffect(() => {
        const fetchRecipes = async () => {
            const response = await axios.get('http://localhost:5000/top-recipes');
            setRecipes(response.data);
        };
        fetchRecipes();
    }, []);

    const handleSearch = async () => {
        const response = await axios.get(`http://localhost:5000/search-recipes?q=${searchTerm}`);
        setRecipes(response.data);
    };

    const goToProfile = () => {
        navigate('/profile'); // Use navigate function to go to the profile page
    };

    return (
        <div className="home-container">
            <div className="header">
                <div className="header-content">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="search-bar" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
               
            </div>
            <h1>Top Recipes</h1>
            <div className="recipe-list">
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <div key={recipe.recipe_id} className="recipe-card">
                            <h2>{recipe.title}</h2>
                            <p>{recipe.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No recipes found.</p>
                )}
            </div>
           
        </div>
    );
};

export default Home;
