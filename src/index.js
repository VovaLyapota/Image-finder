import fetchUsersRequest from './api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.getElementById('search-form');
const formInputEl = document.querySelector('[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const colectionEndMessage = document.querySelector('.colection-end');

const per_page = 40;
let pageCounter = 1;

formEl.addEventListener('submit', onSubmitForm);
loadMoreBtn.addEventListener('click', onLoadMoreClick);

async function onSubmitForm(event) {
  event.preventDefault();

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
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
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
    const response = await fetchUsersRequest(writedRequest, pageCounter);

    drawMarkup(response.finalyFechedInformation);

    if (
      pageCounter * per_page >= response.totalHits ||
      response.totalHits <= per_page
    ) {
      loadMoreBtn.classList.add('is-hidden');
      colectionEndMessage.classList.remove('is-hidden');

      return;
    }
  } catch {
    loadMoreBtn.classList.add('is-hidden');

    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );

    return null;
  }
}
