import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import crossIcon from '/img/cross.svg';

const form = document.querySelector('.form');
const searchInput = document.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15;

form.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleLoadMore);

async function handleSubmit(event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    iziToast.error({
      title: 'Error',
      titleColor: '#ffffff',
      message: 'Please enter a search term',
      iconUrl: crossIcon,
      messageColor: '#ffffff',
      backgroundColor: '#ef4040',
      position: 'topRight',
      timeout: 4000,
      animateInside: true,
      progressBar: false,
      close: false,
      closeOnClick: true,
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(
      currentQuery,
      currentPage
    );

    if (!hits.length) {
      iziToast.info({
        message:
          'Sorry, there are no images matching <br>your search query. Please try again!',
        iconUrl: crossIcon,
        messageColor: '#ffffff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        timeout: 4000,
        animateInside: true,
        progressBar: false,
        close: false,
        closeOnClick: true,
      });
      return;
    }

    createGallery(hits);

    const totalPages = Math.ceil(totalHits / PER_PAGE);
    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        iconUrl: crossIcon,
        messageColor: '#ffffff',
        backgroundColor: '#ef4040',
        position: 'topRight',
        timeout: 4000,
        animateInside: true,
        progressBar: false,
        close: false,
        closeOnClick: true,
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      titleColor: '#ffffff',
      message: `Failed to fetch images. <u>${error.message}</u>. Please try again.`,
      iconUrl: crossIcon,
      messageColor: '#ffffff',
      backgroundColor: '#ef4040',
      position: 'topRight',
      timeout: 4000,
      animateInside: true,
      progressBar: false,
      close: false,
      closeOnClick: true,
    });
  } finally {
    hideLoader();
  }

  event.target.reset();
}

async function handleLoadMore() {
  currentPage += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(
      currentQuery,
      currentPage
    );

    createGallery(hits);

    setTimeout(() => {
      const firstCard = document.querySelector('.gallery .gallery-item');
      if (firstCard) {
        const cardHeight = firstCard.getBoundingClientRect().height;
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
    }, 300);

    const totalPages = Math.ceil(totalHits / PER_PAGE);
    if (currentPage < totalPages) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        message:
          "😔 We're sorry, but you've reached the end of search results.",
        iconUrl: crossIcon,
        messageColor: '#ffffff',
        backgroundColor: '#40e3efff',
        position: 'topRight',
        timeout: 4000,
        animateInside: true,
        progressBar: false,
        close: false,
        closeOnClick: true,
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      titleColor: '#ffffff',
      message: `Failed to fetch images. <u>${error.message}</u>. Please try again.`,
      iconUrl: crossIcon,
      messageColor: '#ffffff',
      backgroundColor: '#ef4040',
      position: 'topRight',
      timeout: 4000,
      animateInside: true,
      progressBar: false,
      close: false,
      closeOnClick: true,
    });
  } finally {
    hideLoader();
  }
}
