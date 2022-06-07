//! ********** imports ********** //
import axios from 'axios';

export class GetApiData {
    #BASE_URL = 'https://pixabay.com/api/';
    #API_KEY = '27883856-6f9d7605f42847345bc14c4ab';

    constructor() {
        this.query = null;
        this.page = 1;
        this.perPage = 40;
    }

    fetchPhotos() {
        return axios.get(`${this.#BASE_URL}?`, {
            params: {
                key: this.#API_KEY,
                q: this.query,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: this.page,
                per_page: this.perPage,
            }
        })
    }
    
    incrementPage() {
    this.page += 1;
    }
}

