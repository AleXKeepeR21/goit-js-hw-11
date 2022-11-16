// ---------------------------------------------------------------

// // import { galleryItems } from './gallery-items';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';

// const galleryRef = document.querySelector('.gallery');

// const galleryMarkup = createGalleryItemMarkup(galleryItems);
// galleryRef.insertAdjacentHTML('beforeend', galleryMarkup);

// function createGalleryItemMarkup(galleryItems) {
//   return galleryItems
//     .map(({ preview, original, description }) => {
//       return `
//         <div class="gallery__item">
//             <a class="gallery__item" href="${original}">
//                 <img class="gallery__image"
//                 src="${preview}"
//                 alt="${description}" />
//             </a>
//         </div>
//       `;
//     })
//     .join('');
// }

// new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionPosition: 'bottom',
//   captionDelay: 250,
// });

import './css/styles.css';
import ApiService from './api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const searchForm = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const apiService = new ApiService();
// let searchQuery = '';

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(evt) {
  evt.preventDefault();

  clearGalleryContainer();

  apiService.query = evt.currentTarget.elements.searchQuery.value;

  if (apiService.query.trim() === '') {
    Notiflix.Report.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  apiService.resetPage();
  apiService.fetchArticles().then(appendHitsMarkup);
}

function onLoadMore() {
  apiService.fetchArticles().then(appendHitsMarkup);
}

function appendHitsMarkup(hits) {
  galleryContainer.insertAdjacentHTML(
    'beforeend',
    createGalleryItemMarkup(hits)
  );
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
        </div>

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

new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});
