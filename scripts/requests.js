function createTask(userName, siteCategoryValue, location) {
    const siteCategoryField = siteCategoryValue ? [{
      id: "391becbd-90fe-457c-98a2-bf5a6c7a7723",
      value: siteCategoryValue,
    }] : [];
  
    fetch( `https://api.clickup.com/api/v2/list/901701936084/task`, {
      method: 'POST',
      headers: {
          'Authorization': 'pk_66618625_50L0LVB3TVCFNDCEGY9KZS87PPFGZWRA',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: document.title,
        status: 'New',
        notify_all: false,
        custom_fields: [
          {
            id: "c6e9db3f-099f-4fec-aca5-68a1e8618070",
            value: userName,
          },
          {
            id: "20351e27-6c88-4c6f-a32d-1d87e215b3b6",
            value: location,
          },
          ...siteCategoryField
        ],
      })
    }).then(res => {
      if (res.status === 200){
        console.log("Success:", res);
      } else {
        console.log("Failure:", res);
      }
    })
  }
  
const pageQueries = [
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
const pageLocation = window.location.href;
const pageCategory = pageQueries.filter((pageQuery) => pageLocation.includes(pageQuery.query))[0];

//createTask('JJ', pageCategory ? pageCategory.key : null, window.location.href)
  //chrome.storage.sync.get(['name'], (item) => console.log(item));