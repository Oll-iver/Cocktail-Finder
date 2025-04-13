// script.js

const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=';

function searchCocktails() {
    const ingredientInput = document.getElementById('ingredient').value;
    const loader = document.getElementById('loader');
    if (!ingredientInput) {
        alert('Please enter at least one ingredient.');
        return;
    }

    // Show loader
    loader.style.display = 'block';


    const ingredients = ingredientInput.split(',')
        .map(ing => ing.trim().toLowerCase());

    // Fetch data for each ingredient
    const fetchPromises = ingredients.map(ingredient =>
        fetch(apiUrl + ingredient)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch data for ingredient: ${ingredient}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Error fetching data for ingredient "${ingredient}":`, error);
                return { drinks: null }; // Fallback object
            })
    );

    Promise.all(fetchPromises)
        .then(results => {
            loader.style.display = 'none';
            if (results.every(result => !result.drinks)) {
                alert('No cocktails found with the specified ingredients.');
                return;
            }

            let filteredCocktails = [];
            if (ingredients.length === 1) {
                // Single ingredient: use logic unchanged.
                filteredCocktails = results[0]?.drinks?.map(drink => drink.idDrink) || [];
            } else {
                // Multi-ingredient: build a union of drink IDs from all valid results.
                let unionCocktails = [];
                results.forEach(result => {
                    if (result.drinks) {
                        unionCocktails.push(...result.drinks.map(drink => drink.idDrink));
                    }
                });
                // Remove duplicates
                filteredCocktails = [...new Set(unionCocktails)];
            }

            console.log('Filtered Cocktails:', filteredCocktails);

            if (filteredCocktails.length > 0) {
                verifyCocktailIngredients(filteredCocktails, ingredients);
            } else {
                alert('No cocktails found with all the specified ingredients.');
            }
        })
        .catch(error => {
            loader.style.display = 'none';
            console.error('Error fetching data:', error);
            alert('An error occurred due to API rate limiting. Please try again in 10 seconds.');
        });
}

function verifyCocktailIngredients(cocktailIds, ingredients) {
    const cocktailList = document.getElementById('cocktail-list');
    cocktailList.innerHTML = ''; // Clear the list

    const fetchDetailsPromises = cocktailIds.map(id =>
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch details for cocktail ID: ${id}`);
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Error fetching details for cocktail ID "${id}":`, error);
                return { drinks: null }; // Fallback object
            })
    );

    Promise.all(fetchDetailsPromises)
        .then(cocktailDetails => {
            const verifiedCocktails = cocktailDetails.filter(data => {
                if (!data.drinks || data.drinks.length === 0) {
                    console.warn('No drink details found for a cocktail ID.');
                    return false;
                }
                const drink = data.drinks[0];
                const drinkIngredients = getIngredients(drink).map(ing => ing.toLowerCase());
                const matches = ingredients.every(ingredient => drinkIngredients.includes(ingredient));
                console.log(`Drink: ${drink.strDrink}, Matches: ${matches}`);
                return matches;
            });

            if (verifiedCocktails.length > 0) {
                verifiedCocktails.forEach(data => {
                    const drink = data.drinks[0];
                    const cocktailElement = document.createElement('div');
                    cocktailElement.classList.add('cocktail');

                    // Adding cocktail details to the HTML
                    cocktailElement.innerHTML = `
                        <h3>${drink.strDrink}</h3>
                        <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
                        <p><strong>Ingredients:</strong> ${getIngredients(drink).join(', ')}</p>
                        <p><strong>Instructions:</strong> ${drink.strInstructions}</p>
                    `;

                    cocktailList.appendChild(cocktailElement);
                });
            } else {
                alert('No cocktails found with all the specified ingredients.');
            }
        })
        .catch(error => {
            console.error('Error verifying cocktail ingredients:', error);
            alert('An error occurred due to API rate limiting. Please try again in 10 seconds.');
        });
}

function getIngredients(drink) {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        if (ingredient) {
            ingredients.push(ingredient);
        }
    }
    return ingredients;
}