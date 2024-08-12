// Snowmobile selected
let lastChosenItem = null

function selectItem(element) {

  if (lastChosenItem) {
    lastChosenItem.classList.toggle('selected')
  }
  element.classList.toggle('selected')

  lastChosenItem = element

  updateDescription(lastChosenItem)
}

function updateDescription(element) {
  const engine = element.textContent.trim()

  fetch(`/get-snowmobile/${engine}`)
  .then(response => response.json())
  .then(snowmobile => {
    const divDescription = document.getElementById('descriptionField')
    divDescription.innerHTML = ''

    const order = ['engine', 'seats', 'price']

    for (const key of order) {
      if (key in snowmobile) {
        const DivInfo = document.createElement('div')
        DivInfo.textContent = `${key}: ${snowmobile[key]}`
        divDescription.appendChild(DivInfo)
      }
    }
  })
  .catch(error => console.error('Fetching snowmobile failed: ', error))
}

async function editSnowmobile() {
  const engine = document.getElementsByName('engine')[0].value
  const price = document.getElementsByName('price')[0].value
  const seats = document.getElementsByName('seats')[0].value
  let data = {engine: engine, price: price, seats: seats}
  let url = `/editSnowmobile/${engine}`
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  })
  if (response.status == 200) {
    window.location = "/adminequipment"
  }
}

async function redirectSnowmobile() {
  if (lastChosenItem) {
    const engine = lastChosenItem.textContent.trim()
    window.location = `/editsnowmobile?snowmobileEngine=${engine}`
  }
  const errorMessage = document.getElementById('error')
  errorMessage.textContent = 'Please select a snowmobile'
}

async function deleteSnowmobile() {
  const lastChosen = lastChosenItem

  if (lastChosen) {
    const engine = lastChosen.textContent.trim()
    if (engine) {
      const snowmobile = await fetch(`/get-snowmobile/${engine}`)
        .then(response => response.json())

      if (snowmobile && snowmobile.docID) {
        const response = await fetch(`/snowmobiles/${snowmobile.docID}`, {
          method: 'DELETE',
        })
        if (response.status === 204) {
          window.location = "/adminequipment"
        }
      }
    }
  } else {
    const errorMessage = document.getElementById('error')
    errorMessage.textContent = 'Please select a snowmobile'
  }
}

async function redirectSnowmobileBooking() {
  let startDate = document.getElementById('startDate').value
  let endDate = document.getElementById('endDate').value

  if (lastChosenItem && startDate && endDate) {
      const engine = lastChosenItem.textContent.trim()
      window.location = `/snowmobilebooking?snowmobileEngine=${engine}&startDate=${startDate}&endDate=${endDate}`
  }
    if (!lastChosenItem) {
    const errorMessage = document.getElementById('error')
    errorMessage.textContent = 'Please select a snowmobile'
  }
  else {
    const errorMessage = document.getElementById('error')
    errorMessage.textContent = 'Please select a date'
  }
}


    

