import axios from 'axios'
import { apiUrl } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id    
    }

    async getRecipe() {
        try {
            const res = await axios(`${apiUrl}/get?rId=${this.id}`)
            console.log(res);
            this.title = res.data.recipe.title
            this.author = res.data.recipe.publisher
            this.img = res.data.recipe.image_url
            this.url = res.data.recipe.source_url
            this.ingredients = res.data.recipe.ingredients
        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length
        const periods = Math.ceil(numIng / 3)
        this.time = periods * 15
    }

    calcServings() {
        this.servings = 4
    }

    parseIngredients() {
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds']
        const unitShort = ['tbsp', 'tbsp' , 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pounds']

        const newIngredients = this.ingredients.map(el => {
            // Uniform units
            let ingredient = el.toLowerCase()
            unitLong.forEach((unit, i) => {
                ingredient =  ingredient.replace(unit, unitShort[i])
            })
            // Remove parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ')
            // Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ')
            const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2))

            if (unitIndex > -1) {
                // There is a unit
            } else if (parseInt(arrIng[0], 10)) {
                // There is no unit, but 1st elements is number
            }
            else if (unitIndex === -1) {
                // There is no unit, and no number in 1st position
            }
            return ingredient
        })

        this.ingredients = newIngredients

    }

}