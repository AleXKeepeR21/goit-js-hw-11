import './css/styles.css';
import ApiService from './api-service';
import LoadMoreBtn from './load-more-btn';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiService = new ApiService();

// const loadMoreBtn = new LoadMoreBtn({ selector: '[data-action="load-more"]' });

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
      console.log(data);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      if (data.totalHits > 0) {
        galleryContainer.insertAdjacentHTML(
          'beforeend',
          createGalleryItemMarkup(data.hits)
        );
        galleryLightbox.refresh();
        // appendHitsMarkup();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    });
  }
}

function onLoadMore() {
  apiService.fetchArticles().then(appendHitsMarkup);
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