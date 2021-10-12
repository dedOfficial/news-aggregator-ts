"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function fetchData(url, cb) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    cb(null, data);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    cb(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
var newsService = (function () {
    var apiKey = '6627c61192594d699e3eb23247294a28';
    var apiUrl = 'https://newsapi.org/v2';
    return {
        topHeadlines: function (country, category, cb) {
            if (country === void 0) { country = 'ru'; }
            if (category === void 0) { category = 'general'; }
            fetchData(apiUrl + "/top-headlines?country=" + country + "&category=" + category + "&apiKey=" + apiKey, cb);
        },
        everything: function (query, cb) {
            fetchData(apiUrl + "/everything?q=" + query + "&apiKey=" + apiKey, cb);
        },
    };
})();
// Elements
var form = document.forms['newsControls'];
var countrySelect = form.elements['country'];
var categorySelect = form.elements['category'];
var searchInput = form.elements['search'];
form.addEventListener('submit', function (e) {
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
    var country = countrySelect.value;
    var category = categorySelect.value;
    var searchText = searchInput.value;
    if (!searchText) {
        newsService.topHeadlines(country, category, onGetResponse);
    }
    else {
        newsService.everything(searchText, onGetResponse);
    }
    newsService.topHeadlines('ru', 'general', onGetResponse);
}
// Function on get response from server
function onGetResponse(err, res) {
    removePreloader();
    if (err) {
        showAlert(err, 'error-msg');
        return;
    }
    if (!res.articles.length) {
        // TODO: show empty message
        var newsContainer = document.querySelector('.news-container .row');
        clearContainer(newsContainer);
        newsContainer === null || newsContainer === void 0 ? void 0 : newsContainer.insertAdjacentHTML('afterbegin', "\n      <strong>\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u0432 \u043F\u043E \u0434\u0430\u043D\u043D\u043E\u043C\u0443 \u0437\u0430\u043F\u0440\u043E\u0441\u0443</strong>\n    ");
        return;
    }
    renderNews(res.articles);
}
// Function render news
function renderNews(news) {
    var newsContainer = document.querySelector('.news-container .row');
    if (newsContainer === null || newsContainer === void 0 ? void 0 : newsContainer.children.length) {
        clearContainer(newsContainer);
    }
    var fragment = '';
    news.forEach(function (item) {
        var el = newsTemplate(item);
        fragment += el;
    });
    newsContainer === null || newsContainer === void 0 ? void 0 : newsContainer.insertAdjacentHTML('afterbegin', fragment);
}
// function clear container
function clearContainer(container) {
    // container.innerHTML = '';
    var child = container.lastElementChild;
    while (child) {
        container.removeChild(child);
        child = container.lastElementChild;
    }
}
// News item template
function newsTemplate(_a) {
    var urlToImage = _a.urlToImage, title = _a.title, url = _a.url, description = _a.description;
    return "\n    <div class=\"col s12\">\n      <div class=\"card\">\n        <div class=\"card-image\">\n          <img src=\"" + (urlToImage || './img/no-photo.png') + "\">\n          <span class=\"card-title\">" + (title || '') + "</span>\n        </div>\n        <div class=\"card-content\">\n          <p>" + (description || '') + "</p>\n        </div>\n        <div class=\"card-action\">\n          <a href=\"" + url + "\">Read more...</a>\n        </div>\n      </div>\n    </div>\n  ";
}
// function show messages
function showAlert(msg, type) {
    if (type === void 0) { type = 'success'; }
    M.toast({ html: msg, classes: type });
}
// function show preloader
function showPreloader() {
    document.body.insertAdjacentHTML('afterbegin', "\n    <div class=\"progress\">\n      <div class=\"indeterminate\"></div>\n    </div>\n  ");
}
// remove loader function
function removePreloader() {
    var loader = document.querySelector('.progress');
    if (loader)
        loader.remove();
}
