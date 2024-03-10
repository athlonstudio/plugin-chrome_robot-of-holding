if (window.history.length <= 1 && window.location.host !== 'new-tab-page') {
    console.log(chrome)
    chrome.action.setPopup({popup: 'index.html'});
  }