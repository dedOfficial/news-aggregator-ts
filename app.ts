async function fetchData(url: string, cb: Function) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    cb(null, data);
  } catch (error) {
    cb(error);
  }
}

const newsService = (function () {
  const apiKey = '6627c61192594d699e3eb23247294a28';
  const apiUrl = 'https://newsapi.org/v2';

  return {
    topHeadlines(country = 'ru', category = 'general', cb: Function) {
      fetchData(
        `${apiUrl}/top-headlines?country=${country}&category=${category}&apiKey=${apiKey}`,
        cb
      );
    },

    everything(query: string, cb: Function) {
      fetchData(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`, cb);
    },
  };
})();

// Elements
const form = document.forms['newsControls'];
const countrySelect = form.elements['country'];
const categorySelect = form.elements['category'];
const searchInput = form.elements['search'];

form.addEventListener('submit', (e: Event) => {
  e.preventDefault();
  loadNews();
});

//  init selects
document.addEventListener('DOMContentLoaded', function () {
  M.AutoInit();
  loadNews();
});

// Load news function
function loadNews() {
  showPreloader();

  const country = countrySelect.value;
  const category = categorySelect.value;
  const searchText = searchInput.value;

  if (!searchText) {
    newsService.topHeadlines(country, category, onGetResponse);
  } else {
    newsService.everything(searchText, onGetResponse);
  }

  newsService.topHeadlines('ru', 'general', onGetResponse);
}

// Function on get response from server
function onGetResponse(err: string, res: { [key: string]: any }) {
  removePreloader();

  if (err) {
    showAlert(err, 'error-msg');
    return;
  }

  if (!res.articles.length) {
    // TODO: show empty message
    const newsContainer = document.querySelector('.news-container .row');
    clearContainer(<Element>newsContainer);

    newsContainer?.insertAdjacentHTML('afterbegin', `
      <strong>Не найдено результатов по данному запросу</strong>
    `)

    return;
  }

  renderNews(res.articles);
}

// Function render news
function renderNews(news: { [k: string]: any }[]) {
  const newsContainer = document.querySelector('.news-container .row');

  if (newsContainer?.children.length) {
    clearContainer(newsContainer);
  }

  let fragment = '';

  news.forEach((item) => {
    const el = newsTemplate(item);
    fragment += el;
  });

  newsContainer?.insertAdjacentHTML('afterbegin', fragment);
}

// function clear container
function clearContainer(container: Element) {
  // container.innerHTML = '';
  let child = container.lastElementChild;
  while (child) {
    container.removeChild(child);
    child = container.lastElementChild;
  }
}

// News item template
function newsTemplate({
  urlToImage,
  title,
  url,
  description,
}: {
  [k: string]: any;
}) {
  return `
    <div class="col s12">
      <div class="card">
        <div class="card-image">
          <img src="${urlToImage || './img/no-photo.png'}">
          <span class="card-title">${title || ''}</span>
        </div>
        <div class="card-content">
          <p>${description || ''}</p>
        </div>
        <div class="card-action">
          <a href="${url}">Read more...</a>
        </div>
      </div>
    </div>
  `;
}

// function show messages
function showAlert(msg: string, type = 'success') {
  M.toast({ html: msg, classes: type });
}

// function show preloader
function showPreloader() {
  document.body.insertAdjacentHTML(
    'afterbegin',
    `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  `
  );
}

// remove loader function
function removePreloader() {
  const loader = document.querySelector('.progress');

  if (loader) loader.remove();
}
