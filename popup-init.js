fetch(chrome.runtime.getURL('/index.html')).then(r => r.text()).then(html => {
    document.querySelector('main').insertAdjacentHTML('beforeend', html);
    
    const requestScript = document.createElement('script');
    requestScript.src = chrome.runtime.getURL('/scripts/requests.js');
    document.querySelector('#plugin_boh').appendChild(requestScript);

    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('/scripts/plugin-logic.js');
    document.querySelector('#plugin_boh').appendChild(script);
});
//check if host permissions will fix the cors issue
//check if an iframe will resolve the cors issue
//fix the popup in the actual extensions thing
//fix the css