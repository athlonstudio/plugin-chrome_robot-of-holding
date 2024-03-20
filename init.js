const blacklistedSites = [
  'zoom.us/j/'
];

if (!blacklistedSites.find((query) => window.location.href.includes(query)) && window.history.length <= 1 && !document.referrer) {
  fetch(chrome.runtime.getURL('/index.html')).then(r => r.text()).then(html => {
    document.body.insertAdjacentHTML('beforeend', html.replace('/styles/popup.css', chrome.runtime.getURL('/styles/popup.css')));
    
    const requestScript = document.createElement('script');
    requestScript.src = chrome.runtime.getURL('/scripts/requests.js');
    document.querySelector('#plugin_boh').appendChild(requestScript);

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('/scripts/plugin-logic.js');
    document.querySelector('#plugin_boh').appendChild(script);
  });
}