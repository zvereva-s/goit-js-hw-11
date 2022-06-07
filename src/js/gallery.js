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
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

const getApiData = new GetApiData();
let lightbox = null;

refs.loadMore.classList.add('is-hidden');

// const mutationObserver = new MutationObserver(mutationRecord => {
//   mutationRecord.forEach(mutation => {
//     const galleryElements = [...mutation.addedNodes].filter(
//       galleryNodeItem => galleryNodeItem.nodeName !== '#text'
//     );

//     setTimeout(() => {
//       galleryElements.forEach(galleryElement => {
//         galleryElement.classList.add('appear');
//       });
//     }, 1);
//   });
// });

// mutationObserver.observe(refs.gallery, {
//   childList: true,
// });

// getApiData.fetchRandomPhotos().then(({ data}) => {
//     refs.gallery.innerHTML = galleryItem(data);

// });

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

    if ((getApiData.page * getApiData.perPage) >= data.totalHits) {
      Notify.info("We're sorry, but you've reached the end of search results.");

      e.target.classList.add('is-hidden');
    }
    }
    catch (err) {
        console.log(err);
    }
}
