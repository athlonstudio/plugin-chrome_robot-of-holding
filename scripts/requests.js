const clickupStudioAuth = 'pk_66618625_50L0LVB3TVCFNDCEGY9KZS87PPFGZWRA';

export async function createTask(userName = 'Anonymous', list, category, {name, url, description}) {
  const siteCategoryField = category ? [{
    id: "391becbd-90fe-457c-98a2-bf5a6c7a7723",
    value: siteCategoryValue,
  }] : [];

  const response = await fetch( `https://api.clickup.com/api/v2/list/${list}/task`, {
    method: 'POST',
    headers: {
        'Authorization': clickupStudioAuth,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      description,
      status: 'New',
      notify_all: false,
      custom_fields: [
        {
          id: "c6e9db3f-099f-4fec-aca5-68a1e8618070",
          value: userName,
        },
        {
          id: "20351e27-6c88-4c6f-a32d-1d87e215b3b6",
          value: url,
        },
        ...siteCategoryField
      ],
    })
  })
  return response;
}

export async function getLists() {
  const response = await fetch(`https://api.clickup.com/api/v2/folder/90171237027/list`,{method: 'GET',headers: {Authorization: clickupStudioAuth}});
  return response.json();
}

export async function getTasks(list) {
  const response = await fetch(`https://api.clickup.com/api/v2/list/${list}/task`,{method: 'GET',headers: {Authorization: clickupStudioAuth}});
  return response.json();
}