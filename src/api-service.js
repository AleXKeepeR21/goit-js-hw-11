const axios = require('axios').default;
export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalPages = null;
  }

  async fetchArticles() {
    console.log(this);
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '31213831-079e96808e6f65bd38889e682';
    const FILTERS = '&image_type=photo&orientation=horizontal&safesearch=true';
    const PAGINATION = `&per_page=40&page=${this.page}`;
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}${FILTERS}${PAGINATION}`;

    return await axios.get(url).then(response => {
      // if (!response.ok) {
      //   throw new Error(response.status);
      // }
      this.page += 1;
      return response.data;
    });
    // .then(data => {
    //   console.log(data);
    //   this.page += 1;
    //   return data;
    // });

    // return fetch(
    //   `https://pixabay.com/api/?key=31213831-079e96808e6f65bd38889e682&q=${this.searchQuery}&per_page=40&page=${this.page}&image_type=photo&orientation=horizontal&safesearch=true`
    // )
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error(response.status);
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     console.log(data);
    //     this.page += 1;
    //     return data;
    //   });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
