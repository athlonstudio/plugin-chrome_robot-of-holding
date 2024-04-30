let page = pageKeys.LANDING;
const selectElement = (selector) => document.querySelector(`#plugin_boh ${selector}`)
const main = selectElement('.main');
const pageLocation = window.location.href;
const pageCategory = queryKeys.filter((pageQuery) => pageLocation.includes(pageQuery.query))[0];
const passEvent = (eventKey, detail) => new CustomEvent(eventKey, {detail});
let clickupListData;
let localData = {
    title: document.title || window.location.href, 
    description: '',
};
let testingStorage = {list: {name: "Default", id: 901701936084}};
let promiseHolder ={};

window.addEventListener("RETURN_FROM_STORAGE", ({detail}) => {
    promiseHolder[`resolver-${detail.key}`](detail)
});
  
function saveToStorage_BOH(key, value) {
    window.dispatchEvent(passEvent("SAVE_TO_STORAGE", {key, data: {[key]: JSON.stringify(value)}}));
}

async function getFromStorage_BOH(key) {
    let parsedResult;
    promiseHolder[key] = new Promise((resolve) => promiseHolder[`resolver-${key}`] = resolve)
    window.dispatchEvent(passEvent("GET_FROM_STORAGE", {key}));
    await promiseHolder[key].then(({[key]: result}) => {
        try {
            JSON.parse(result)
        } catch (error) {
            return parsedResult = result;
        }
        return parsedResult = JSON.parse(result);
    });

    return parsedResult
}

function handleClose_BOH() {
    document.getElementById('plugin_boh').remove();
}

async function handleDuplicateTask_BOH() {  
    let matchedLists;  
    if (!clickupListData) {    
        await getLists_BOH().then((data) => clickupListData = data.lists);
    }

    matchedLists =  clickupListData.map((list) => getTasks_BOH(list.id).then(({tasks}) => tasks.find((task) => task['custom_fields'].filter(({id}) => id === "82f86939-4bfd-4ad5-98e3-57c089304cb5")[0].value === pageLocation) || null));

    return await matchedLists;
}

async function renderPage_BOH(pageKey, options) {
    main.innerHTML = '';
    main.classList.remove(page)
    main.classList.add(pageKey)
    main.appendChild(selectElement(`#page_${pageKey}`).content.cloneNode(true));
    loadIcons_BOH();
    page = pageKey;
    const list = await getFromStorage_BOH(storageKeys['LIST']);
    const icon = document.querySelector('[rel*="icon"]');

    switch (pageKey) {
        case pageKeys['LANDING']:
           options && options.duplicateList ? selectElement('#matching_list').innerHTML = `This site already saved to the ${options.duplicateList.name} list.` : null;
            selectElement('#list_name').innerHTML = (list && list.name)  || 'Select a list...';
            selectElement('#page-link_title').value = localData[localDataKey['TITLE']];
            selectElement('#page-link_description').value = localData[localDataKey['DESCRIPTION']];
            selectElement('#page-link_image').src = (icon && icon.href) || 'https://placehold.co/60x60';
            handleTaskInput_BOH(selectElement('#page-link_title'), localDataKey['TITLE']);
            handleTaskInput_BOH(selectElement('#page-link_description'), localDataKey['DESCRIPTION']);
            selectElement('.list_selector').addEventListener('click', (event) => openList_BOH(event));
            selectElement('.button_close').addEventListener('click', handleClose_BOH);
            selectElement('#button_save').addEventListener('click', (event) => handleCreateTask_BOH(event));
            selectElement('#button_settings').addEventListener('click', () => renderPage_BOH(pageKeys['SETTINGS']));
            break;
        case pageKeys['SETTINGS']:
                selectElement('#button_back').addEventListener('click', () => renderPage_BOH(pageKeys["LANDING"]));
                selectElement('.button_close').addEventListener('click', handleClose_BOH);
                handleNameInput_BOH();
            break;
        case pageKeys['ONBOARDING']:
        case pageKeys['ERROR']:
        case pageKeys['ALREADY_SAVED']:
            selectElement('#already-saved_list').innerHTML = (list && list.name);
        default:
            break;
    }
}

function loadIcons_BOH() {
    const elementsToLoad = [...main.querySelectorAll('[data-load]')];
    elementsToLoad.forEach(element => element.appendChild(selectElement(`#icon_${element.dataset.load}`).content.cloneNode(true)));
}

function renderListRow_BOH(container, {name, id}, index, selectedList) {
    container.appendChild(selectElement('#component_list-row').content.cloneNode(true));
    container.children[index].innerHTML = name;
    container.children[index].addEventListener('click', (event) => setList_BOH(event));
    container.children[index].setAttribute('value', id);
    
    if (selectedList && id === selectedList.id) {
        container.children[index].classList.add('selected-list');
    }
}

async function openList_BOH(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const target = event.currentTarget;
    const listContainer = selectElement('#clickup-list');
    const selectedList = await getFromStorage_BOH(storageKeys['LIST']);

    if(!clickupListData) {    
        await getLists_BOH().then((data) => clickupListData = data.lists);
    }

    if (listContainer.children.length === 0){
        clickupListData.forEach((list, index) => renderListRow_BOH(listContainer, list, index, selectedList))
    }

    target.dataset.open = target.dataset.open !== 'true' ? 'true' : 'false';
    listContainer.classList.toggle('hide')
}

async function setList_BOH(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const target = event.currentTarget;
    saveToStorage_BOH(storageKeys['LIST'], {name: target.innerHTML, id: target.getAttribute('value')});

    const selectedList = await getFromStorage_BOH(storageKeys['LIST']);

    if(selectElement('.selected-list')){
        selectElement('.selected-list').classList.toggle('selected-list');
    }

    target.classList.add('selected-list');
    selectElement('#list_name').innerHTML = selectedList.name;
}

async function handleCreateTask_BOH(event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    const target = event.currentTarget;
    const list = await getFromStorage_BOH(storageKeys['LIST']);
    const userName = await getFromStorage_BOH(storageKeys['NAME']);
    if (list.id) {
        const task = {
            name: localData[localDataKey['TITLE']],
            description: localData[localDataKey['DESCRIPTION']],
            url: pageLocation,
        }
    
        target.classList.add('button-completed');
        target.disabled = true;
        target.innerHTML = 'Saved';
    
        setTimeout(() => document.querySelector('#plugin_boh').style.display = 'none', 2000);
        await createTask_BOH(userName, list.id, pageCategory, task);
        handleClose_BOH();
    }
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

async function handleNameInput_BOH() {
    let saving = false;
    const inputName = selectElement('#input_name');
    const disableElements = () => {
        selectElement('#text_save').innerHTML = 'Saving…';
        selectElement('#button_back').disabled = true;
    }
    const enableElements = () => {
        selectElement('#button_back').disabled = false;
        selectElement('#text_save').innerHTML = 'Saved.';
    }
    
    inputName.value = await getFromStorage_BOH(storageKeys['NAME']) || '';
    inputName.addEventListener('keydown', (event) => handleSaveDebounce_BOH(() => saveToStorage_BOH(storageKeys['NAME'], event.target.value), saving, disableElements, enableElements));
}

function handleTaskInput_BOH(element, dataKey) {
    let saving = false;
    
    element.value = localData[dataKey];
    element.addEventListener('keydown', (event) => handleSaveDebounce_BOH(() => localData[dataKey] = event.target.value, saving));
}

if(window.trustedTypes && window.trustedTypes.createPolicy && !window.trustedTypes.defaultPolicy) {
    window.trustedTypes.createPolicy('default', {
        createHTML: string => string,
        createScriptURL: string => string,
        createScript: string => string,
    });
    handleDuplicateTask_BOH().then(async (res)=> {
        var duplicateTask = await res.find((list) => list !== null);
        renderPage_BOH(pageKeys.LANDING, {duplicateList: duplicateTask.list})
        main.style.cssText = `
            translate: 0;
            opacity: 1;
            visibility: visible;
        `;
        setTimeout(() => document.querySelector('#plugin_boh').style.overflow = 'visible', 50);
    });
} else {
    setTimeout(() => {
        renderPage_BOH(pageKeys.ERROR)
        main.style.cssText = `
            translate: 0;
            opacity: 1;
            visibility: visible;
        `;
    }, 400);
    setTimeout(() => handleClose_BOH, 2000);
}