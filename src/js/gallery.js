//! ********** imports ********** //
import SimpleLightbox from 'simplelightbox';
import galleryItem from '../templates/galleryItem.hbs';
import { GetApiData } from './getDataApi';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';

//? ********** refs  ********** //
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  targetEl: document.querySelector('.target-element'),
};

refs.loadMore.classList.add('is-hidden');

const getApiData = new GetApiData();
let lightbox = null;



async function onSubmit(e) {
  e.preventDefault();

  getApiData.query = e.target.elements['searchQuery'].value
    .trim()
    .toLowerCase();
  getApiData.page = 1;

  try {
    const { data } = await getApiData.fetchPhotos();
    if (!data.hits.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    refs.gallery.innerHTML = galleryItem(data.hits);  

    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });

    Notify.success(`"Hooray! We found ${data.totalHits} images."`);

    refs.loadMore.classList.remove('is-hidden');

    if (getApiData.page * getApiData.perPage >= data.totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      
      refs.loadMore.classList.add('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
}

async function onLoadMore(e) {
  getApiData.incrementPage();

  try {
    const { data } = await getApiData.fetchPhotos();
    refs.gallery.insertAdjacentHTML('beforeend', galleryItem(data.hits));

    lightbox.refresh();
  } catch (err) {
    console.log(err);
  }
}


refs.form.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', onLoadMore);
