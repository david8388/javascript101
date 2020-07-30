import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {}

/**
 * Search controller
 */
const controlSearch = async() => {
    // Get query from view
    const query = searchView.getInput();

    if (query) {
        // New search object and add to state
        state.search = new Search(query)

        // Prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)
        try {
            // Search for recipes
            await state.search.getResults()

            // Render results on UI
            clearLoader()
            searchView.renderResults(state.search.result)
        } catch (error) {
            alert('Something went wrong with the searchs')
            clearLoader()
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault()
    controlSearch()
})

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10)
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})

/** 
 * Recipe controller 
 */
const controlRecipe = async () => {
    // Get id from url
    const id = window.location.hash.replace('#', '')

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id)

        // Create new recipe object
        state.recipe = new Recipe(id)

        try {
            // Get recipe data
            await state.recipe.getRecipe()
            
            state.recipe.parseIngredients()

            // Calculate servings and time
            state.recipe.calcTime()
            state.recipe.calcServings()
            // Render recipe
            clearLoader()
            recipeView.renderRecipe(state.recipe)
        } catch (error) {
            alert('Error processing recipe')
        }
        
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

/**
 * List controller
 */
const controllerList = () => {
    // Create a new list if there in none yet.
    if (!state.list) state.list = new List()

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient)
        listView.renderItem(item)
    })
}

// Handle delete and update list item event
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state 
        state.list.deleteItem(id)
        // Delete from UI
        listView.deleteItem(id)
        
    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10)
        state.list.updateCount(id, val)
    }   
})

/**
 * Like controller
 */
const controllerLike = () => {
    if (!state.likes) state.likes = new Likes()
    const currentID = state.recipe.id

    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state 
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        )
        // Toggle the like button

        // Add like to UI list
        console.log(state.likes)
    // User has liked current recipe
    } else { 
        // Remove like to the state 
        state.likes.deleteLike(currentID)
        // Toggle the like button

        // Remove like from UI list
        console.log(state.likes)
    }

}

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            recipeView.updateServingsIngredients(state.recipe)
            state.recipe.updateServings('dec')
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe)
    } else if (e.target.matches('.recipe__btn--add, recipe__btn--add *')) {
        // Add ingredients to shopping list
        controllerList()
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controllerLike()
    }
}) 

const l = new List()
window.l = l