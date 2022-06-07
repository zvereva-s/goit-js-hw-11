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
const getApiData = new GetApiData();
let lightbox = null;

refs.loadMore.classList.add('is-hidden');

const intersectionObserverOptions = {
  root: null,
  rootMargin: '0px 0px 200px 0px',
  threshold: 1.0,
};
const intersectionObserver = new IntersectionObserver((entries, observe) => {
  entries.forEach(async entry => {
    if (!entry.isIntersecting) {
      return;
    }

    getApiData.incrementPage();

    try {
    const { data } = await getApiData.fetchPhotos();
    refs.gallery.insertAdjacentHTML('beforeend', galleryItem(data.hits));

    lightbox.refresh();
    } catch (err) {
      console.log(err);
    }
  });
}, intersectionObserverOptions);

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
      intersectionObserver.observe(refs.targetEl);
    
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionPosition: 'bottom',
      captionDelay: 250,
    });

    Notify.success(`"Hooray! We found ${data.totalHits} images."`);


    if (getApiData.page * getApiData.perPage >= data.totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");
    
        intersectionObserver.unobserve(refs.targetEl);

    }
  } catch (err) {
    console.log(err);
  }
}

refs.form.addEventListener('submit', onSubmit);

/** */