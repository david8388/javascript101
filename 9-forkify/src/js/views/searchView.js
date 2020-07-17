import { elements } from './base';

export const getInput = () => elements.searchInput.value

export const clearInput = () => {
    elements.searchInput.value = ''
}

export const clearResults = () => {
    elements.searchResList.innerHTML = ''
}

/**
 * 'Pasta with tomato and spinach'
 * acc: 0/ acc + cur.length = 5/ newTitle = ['Pasta']
 * acc: 5/ acc + cur.length = 9/ newTitle = ['Pasta', 'with']
 * acc: 9/ acc + cur.length = 15/ newTitle = ['Pasta', 'with', 'tomato']
 * acc: 15/ acc + cur.length = 18/ newTitle = ['Pasta', 'with', 'tomato']
 * acc: 18/ acc + cur.length = 25/ newTitle = ['Pasta', 'with', 'tomato']
 */
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = []
    if (title.length > 17) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length
        }, 0)
        return `${newTitle.join(' ')}...`
    }
    return title
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `
    elements.searchResList.insertAdjacentHTML('beforeend', markup)
}

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage)

    if (page === 1 && pages > 1) {
        // Only button to go to next page
    }  else if (page < pages) {
        // Both buttons
    }
    else if (page === pages && pages > 1) {
        // Only button to go to prev page

    }
}

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage
    const end = page * resPerPage
    recipes.slice(start, end).forEach(renderRecipe)
}