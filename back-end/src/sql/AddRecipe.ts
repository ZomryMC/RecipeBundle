import { PoolClient } from "pg";
import { Recipe } from "../model/RecipeData";
import { executeQuery } from "../sql-utils/Database";

export async function addRecipe(client: PoolClient, recipeData: Recipe) {
    const insertedRecipe = await executeQuery(client, {
        name: 'create-base-recipe',
        text: 'INSERT INTO Recipes (recipe_name, steps, image) VALUES ($1, $2, $3) RETURNING id;',
        values: [recipeData.title, recipeData.steps, recipeData.image]
    });
    const recipeId = insertedRecipe.rows[0].id;

    for (let ingredient of recipeData.ingredients) {
        let ingredientResult = await executeQuery(client, {
            name: 'add-ingredient',
            text: 'INSERT INTO Ingredients (ingredient_name) VALUES ($1) RETURNING id;',
            values: [ingredient.name]
        });
        const id = ingredientResult.rows[0].id;

        await executeQuery(client, {
            name: 'match-ingredient-and-recipe',
            text: 'INSERT INTO RecipesIngredientsMatch (recipe_id, ingredient_id, quantity) VALUES($1, $2, $3);',
            values: [recipeId, id, ingredient.quantity]
        });
    }
}