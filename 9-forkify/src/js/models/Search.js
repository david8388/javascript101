import axios from 'axios';
import { apiUrl } from '../config';

export default class Search {
    constructor(query) {
        this.query = query
    }

    // https://forkify-api.herokuapp.com/api/search
    async getResults() {
        try {
            const res = await axios(`${apiUrl}/search?q=${this.query}`)
            this.result = res.data.recipes
            console.log(this.result);
        } catch (error) {
            alert(error)
        }
    }

}