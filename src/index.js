import './css/styles.css';
import ApiService from './api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.classList.add('hidden');
const apiService = new ApiService();

let totalHits = null;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  clearGalleryContainer();

  apiService.query = evt.currentTarget.elements.searchQuery.value;

  if (apiService.query.trim() === '') {
    Notiflix.Report.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  } else {
    apiService.resetPage();
    apiService.fetchArticles().then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (data.totalHits > 0) {
        appendHitsMarkup(data.hits);
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
      if (data.hits.length >= 40) {
        loadMoreBtn.classList.remove('hidden');
      }
    });
  }
}

function onLoadMore() {
  apiService.fetchArticles().then(data => {
    totalHits = data.totalHits - 40;

    if (data.totalHits > 0) {
      appendHitsMarkup(data.hits);
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (totalHits < 0) {
      loadMoreBtn.classList.add('hidden');
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
  });
}

function appendHitsMarkup(hits) {
  galleryContainer.insertAdjacentHTML(
    'beforeend',
    createGalleryItemMarkup(hits)
  );
  galleryLightbox.refresh();
}

function createGalleryItemMarkup(hits) {
  return hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="gallery__item">
            <a class="gallery__item" href="${largeImageURL}">
                <img class="gallery__image"
                src="${webformatURL}"
                alt="${tags}" 
                loading="lazy"/>
            </a>
 
        <div class="info">
    <p class="info__item">
        <b>Likes:</b>
        ${likes}
    </p>
    <p class="info__item">
        <b>Views:</b>
        ${views}
    </p>
    <p class="info__item">
        <b>Comments:</b>
        ${comments}
    </p>
    <p class="info__item">
        <b>Downloads:</b>
        ${downloads}
    </p>
</div>

</div>

      `;
      }
    )
    .join('');
}

function clearGalleryContainer() {
  galleryContainer.innerHTML = '';
}

let galleryLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
