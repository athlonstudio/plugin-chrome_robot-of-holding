const queryKeys = [
    {
        key: 0,
        query: 'figma'
    },{
        key: 1,
        query: 'clickup'
    },{
        key: 2,
        query: 'drive.google'
    },{
        key: 3,
        query: 'quip'
    },{
        key: 4,
        query: 'qualtrics'
    }
];
const pageKeys = {
    LANDING: 'landing',
    ONBOARDING: 'onboarding',
    SETTINGS: 'settings',
};
const storageKeys = {
    NAME: 'boh_name',
    LIST: 'boh_list',
}
const localDataKey = {
    TITLE: 'title',
    DESCRIPTION: 'description',
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function getFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}
    
let page = pageKeys.LANDING;
const main = document.querySelector('#plugin_boh .main');
let clickupListData;
let localData = {
    title: window.location.href,
    description: '',
};
let testingStorage = {list: {name: "Default", id: 901701936084}};

function handleClose_BOH() {
    document.getElementById('plugin_boh').remove();
}

function renderPage_BOH(pageKey) {
    main.innerHTML = '';
    main.classList.remove(page)
    main.classList.add(pageKey)
    main.appendChild(document.querySelector(`#page_${pageKey}`).content.cloneNode(true));
    loadIcons_BOH();
    page = pageKey;
    switch (pageKey) {
        case pageKeys['LANDING']:
            document.querySelector('#list_name').innerHTML = getFromStorage(storageKeys['LIST']).name || 'Select a list…';
            document.querySelector('#page-link_title').value = localData.title;
            document.querySelector('#page-link_description').value = localData.description;
            document.querySelector('#page-link_image').src = (document.querySelector('[rel*="icon"]') && document.querySelector('[rel*="icon"]').href) || 'https://placehold.co/60x60'
            handleTaskInput(document.querySelector('#page-link_title'), localDataKey['TITLE'])
            handleTaskInput(document.querySelector('#page-link_description'), localDataKey['DESCRIPTION'])
            break;
            case pageKeys['ONBOARDING']:
            
            break;
            case pageKeys['SETTINGS']:
                handleNameInput_BOH();
            break;
        default:
            break;
    }
}

function loadIcons_BOH() {
    const elementsToLoad = [...main.querySelectorAll('[data-load]')];
    elementsToLoad.forEach(element => element.appendChild(document.querySelector(`#icon_${element.dataset.load}`).content.cloneNode(true)));
}

function renderListRow_BOH(container, {name, id}, index) {
    container.appendChild(document.querySelector('#component_list-row').content.cloneNode(true));
    container.children[index].innerHTML = name;
    container.children[index].setAttribute('value', id);
    
    if (id == getFromStorage(storageKeys['LIST']).id) {
        container.children[index].classList.add('selected-list');
    }
}

async function openList_BOH(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const target = event.currentTarget;
    const listContainer = document.querySelector('#clickup-list');

    if(!clickupListData) {    
        await getLists_BOH().then((data) => clickupListData = data.lists);
    }

    if (listContainer.children.length === 0){
        clickupListData.forEach((list, index) => renderListRow_BOH(listContainer, list, index))
    }

    target.dataset.open = target.dataset.open !== 'true' ? 'true' : 'false';
    listContainer.classList.toggle('hide')
}

function setList_BOH(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const target = event.currentTarget;
    
    saveToStorage(storageKeys['LIST'], {name: target.innerHTML, id: target.getAttribute('value')});
    
    if(document.querySelector('.selected-list')){
        document.querySelector('.selected-list').classList.toggle('selected-list');
    }

    target.classList.add('selected-list');
    document.querySelector('#list_name').innerHTML = getFromStorage(storageKeys['LIST']).name;
}

async function handleCreateTask_BOH(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const target = event.currentTarget;
    const pageLocation = window.location.href;
    const pageCategory = queryKeys.filter((pageQuery) => pageLocation.includes(pageQuery.query))[0];
    const list = getFromStorage(storageKeys['LIST']).id;
    const userName = getFromStorage(storageKeys['NAME']);
    let taskMatching = false;

    const task = {
        name: localData[localDataKey['TITLE']],
        description: localData[localDataKey['DESCRIPTION']],
        url: pageLocation,
    }

    target.classList.add('button-completed');
    target.disabled = true;
    target.innerHTML = 'Saved';

    setTimeout(() => document.querySelector('#plugin_boh').style.display = 'none', 2000);

    await getTasks_BOH(list).then((data) => {
        taskMatching = !!data.tasks.find((taskItem) => taskItem['custom_fields'][2].value === pageLocation);
    });

    if(!taskMatching) {
        await createTask_BOH(userName, list, pageCategory, task);
    } 

    document.querySelector('#plugin_boh').remove();

    
}

function handleSaveDebounce_BOH(saveFunction, saving, disableEl = () => {}, enableEl = () => {}) {
    if (!saving) {
        saving = true;
        disableEl();
        
        setTimeout(() => {
            saveFunction();
            enableEl();
            saving = false;
        }, 600);
    }
}

function handleNameInput_BOH() {
    let saving = false;
    const inputName = document.querySelector('#input_name');
    const disableElements = () => {
        document.querySelector('#text_save').innerHTML = 'Saving…';
        document.querySelector('#button_back').disabled = true;
    }
    const enableElements = () => {
        document.querySelector('#button_back').disabled = false;
        document.querySelector('#text_save').innerHTML = 'Saved.';
    }
    
    inputName.value = getFromStorage(storageKeys['NAME']) || '';
    inputName.addEventListener('keydown', (event) => handleSaveDebounce_BOH(() => saveToStorage(storageKeys['NAME'], event.target.value), saving, disableElements, enableElements));
}

function handleTaskInput(element, dataKey) {
    let saving = false;
    
    element.value = localData[dataKey];
    element.addEventListener('keydown', (event) => handleSaveDebounce_BOH(() => localData[dataKey] = event.target.value, saving));
}


renderPage_BOH(pageKeys.LANDING)