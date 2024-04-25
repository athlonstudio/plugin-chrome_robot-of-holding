const clickupStudioAuth = 'pk_66618625_50L0LVB3TVCFNDCEGY9KZS87PPFGZWRA';

async function createTask_BOH(userName = 'Anonymous', list, category = {}, {name, url, description}) {
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
        id: "20351e27-6c88-4c6f-a32d-1d87e215b3b6",
        value: url,
      },
    ],
  };

  const response = await fetch( `https://api.clickup.com/api/v2/list/${list}/task`, {
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

async function getTasks_BOH(list) {
  const response = await fetch(`https://api.clickup.com/api/v2/list/${list}/task`,{method: 'GET',headers: {Authorization: clickupStudioAuth}});
  return response.json();
}