const blacklistedSites = [
  'zoom.us/j/',
  'chrome-extension://',
  'chrome://',
  'midway-auth.amazon',
];
window.addEventListener("SAVE_TO_STORAGE", ({detail: {data}}) => chrome.storage.sync.set(data));
window.addEventListener("GET_FROM_STORAGE", ({detail: {key}}) => chrome.storage.sync.get(key).then(res => window.dispatchEvent(new CustomEvent("RETURN_FROM_STORAGE", {detail: {key,[key]: res[key]}}))));

if (!blacklistedSites.find((query) => window.location.href.includes(query)) && window.history.length <= 1) {
  fetch(chrome.runtime.getURL('/index.html')).then(r => r.text()).then(html => {
   document.body.insertAdjacentHTML('beforeend', html);
   
   document.querySelector('#plugin_boh').appendChild(Object.assign(document.createElement('script'),{src:chrome.runtime.getURL('/scripts/requests.js')}));
   document.querySelector('#plugin_boh').appendChild(Object.assign(document.createElement('script'),{src:chrome.runtime.getURL('/scripts/keys.js')}));

    setTimeout(() => document.querySelector('#plugin_boh').appendChild(Object.assign(document.createElement('script'),{src:chrome.runtime.getURL('/scripts/plugin-logic.js')})), 40);
  });
}
