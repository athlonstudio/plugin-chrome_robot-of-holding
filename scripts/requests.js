const clickupStudioAuth = 'pk_66618625_50L0LVB3TVCFNDCEGY9KZS87PPFGZWRA';

async function createTask_BOH(userName = 'Anonymous', listId, category = {}, {name, url, description}) {
  const siteCategoryField = 'key' in category ? [{
    id: "391becbd-90fe-457c-98a2-bf5a6c7a7723",
    value: category.key,
  }] : [];

  const requestBody = {
    name,
    description,
    status: 'New',
    notify_all: false,
    custom_fields: [
      ...siteCategoryField,
      {
        id: "c6e9db3f-099f-4fec-aca5-68a1e8618070",
        value: userName,
      },
      {
        id: "82f86939-4bfd-4ad5-98e3-57c089304cb5",
        value: url,
      },
    ],
  };

  const response = await fetch( `https://api.clickup.com/api/v2/list/${listId}/task`, {
    method: 'POST',
    headers: {
        'Authorization': clickupStudioAuth,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  return response;
}

async function getLists_BOH() {
  const response = await fetch(`https://api.clickup.com/api/v2/folder/90171237027/list`,{method: 'GET',headers: {Authorization: clickupStudioAuth}});
  return response.json();
}

async function getTasks_BOH(listId) {
  const response = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`,{method: 'GET',headers: {Authorization: clickupStudioAuth}});
  return response.json();
}