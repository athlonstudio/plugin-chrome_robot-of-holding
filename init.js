const blacklistedSites = [
  'zoom.us/j/',
  'chrome-extension://',
  'chrome://',
  'midway-auth.amazon',
];
window.addEventListener("SAVE_TO_STORAGE", ({detail: {data}}) => chrome.storage.sync.set(data));
window.addEventListener("GET_FROM_STORAGE", ({detail: {key}}) => chrome.storage.sync.get(key).then(res => window.dispatchEvent(new CustomEvent("RETURN_FROM_STORAGE", {detail: {key,[key]: res[key]}}))));

if (!blacklistedSites.find((query) => window.location.href.includes(query)) && window.history.length <= 1 && !document.referrer) {
  fetch(chrome.runtime.getURL('/index.html')).then(r => r.text()).then(html => {
   document.body.insertAdjacentHTML('beforeend', html);
    
    const requestScript = document.createElement('script');
    requestScript.src = chrome.runtime.getURL('/scripts/requests.js');
    document.querySelector('#plugin_boh').appendChild(requestScript);

    const keysScript = document.createElement('script');
    keysScript.src = chrome.runtime.getURL('/scripts/keys.js');
    document.querySelector('#plugin_boh').appendChild(keysScript);

    const logicScript = document.createElement('script');
    logicScript.src = chrome.runtime.getURL('/scripts/plugin-logic.js');
    document.querySelector('#plugin_boh').appendChild(logicScript);
  });
}