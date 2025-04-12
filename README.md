# Cocktail Ingredient Pairing Guide

A simple web application that helps you find cocktail recipes based on the ingredients you input. It leverages [TheCocktailDB API](https://www.thecocktaildb.com/api.php) to fetch cocktail details.

## Features

- **Search by Ingredient(s):** Enter one or more ingredients to find matching cocktail recipes.
- **Responsive Design:** The layout adapts for mobile and desktop.
- **Interactive UI:** Smooth transitions and hover effects on cocktail cards.

## Technologies Used

- HTML
- CSS
- JavaScript

## How It Works

1. **User Input:** Type a comma-separated list of ingredients.
2. **API Requests:** The app fetches cocktail lists based on the input.
3. **Verification:** Retrieves detailed cocktail information and verifies the presence of all specified ingredients.
4. **Display:** Shows a list of cocktail cards with images, ingredients, and instructions.

## Getting Started

1. **Clone the Repository:**

    ````bash
    git clone https://github.com/Oll-iver/cocktail-finder.git
    ````
   
3. **Search for Cocktails:**

    Navigate to `interface.html`, enter your ingredients comma separated: "gin" or "gin, vodka" but not "gin and vodka"; and click **Search** to see the results.

## File Structure

- **interface.html:** The main HTML interface.
- **style.css:** Styles for the project.
- **script.js:** JavaScript for handling API calls and dynamic content rendering.

## License

This project is licensed under the MIT License.
