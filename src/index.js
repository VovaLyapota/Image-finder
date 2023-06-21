import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fetchUsersRequest from './api';

const formEl = document.getElementById('search-form');
const formInputEl = document.querySelector('[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const colectionEndMessage = document.querySelector('.colection-end');

const perPage = 40;
let pageCounter = 1;
let lightbox;

formEl.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSubmitForm(event) {
  event.preventDefault();
  loadMoreBtn.classList.add('is-hidden');

  gallery.innerHTML = '';
  let renderingResult = await renderMurkup(event);

  if (renderingResult !== null) loadMoreBtn.classList.remove('is-hidden');
}

function onLoadMoreClick(event) {
  pageCounter += 1;

  renderMurkup(event);
}

function drawMarkup(fechedQueryInformation) {
  fechedQueryInformation.map(item =>
    gallery.insertAdjacentHTML(
      'beforeend',
      `<div class="photo-card">
<a class="gallery__link" href="${item.largeImageURL}">
  <img src="${item.webformatURL}" class="gallery__image" alt="${item.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${item.downloads}
    </p>
  </div>
</div>`
    )
  );
}

function renderMurkup(event) {
  let writedRequest = formInputEl.value;

  if (event.currentTarget === formEl) pageCounter = 1;

  return getInformatinAndDrawMurkup(writedRequest, pageCounter);
}

async function getInformatinAndDrawMurkup(writedRequest, pageCounter) {
  try {
    const response = await fetchUsersRequest(
      writedRequest,
      pageCounter,
      perPage
    );

    drawMarkup(response.finalyFechedInformation);

    if (pageCounter === 1) {
      lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionDelay: 250,
        captionSelector: '.gallery__image',
        captionType: 'inner',
        captionsData: 'alt',
      });
    }

    if (pageCounter > 1) {
      lightbox.refresh();

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 3,
        behavior: 'smooth',
      });

      if (
        pageCounter * perPage >= response.totalHits ||
        response.totalHits <= perPage
      ) {
        loadMoreBtn.classList.add('is-hidden');
        colectionEndMessage.classList.remove('is-hidden');

        return;
      }
    }
  } catch {
    loadMoreBtn.classList.add('is-hidden');

    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return null;
  }
}
