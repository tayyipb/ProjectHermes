// Cabin selected
let lastChosenItem = null

function selectItem(element) {

  if (lastChosenItem) {
    lastChosenItem.classList.toggle('selected')
  }
  element.classList.toggle('selected')

  lastChosenItem = element

  updateDescription(lastChosenItem)
}

// Update description
function updateDescription(element) {
  const cabinName = element.textContent.trim()

  fetch(`/get-cabin/${cabinName}`)
  .then(response => response.json())
  .then(cabin => {
    const divDescription = document.getElementById('descriptionField')
    divDescription.innerHTML = ''

    const order = ['name', 'size', 'rooms', 'location', 'price']
  
    for (const key of order) {
      if (key in cabin) {
        const DivInfo = document.createElement('div')
        DivInfo.textContent = `${key}: ${cabin[key]}`
        divDescription.appendChild(DivInfo)
      }
    }
  })
  .catch(error => console.error('Fetching cabin failed: ', error))
}

// Edit cabin
async function editCabin() {
  const location = document.getElementsByName('location')[0].value
  const name = document.getElementsByName('name')[0].value
  const price = document.getElementsByName('price')[0].value
  const rooms = document.getElementsByName('rooms')[0].value
  const size = document.getElementsByName('size')[0].value
  let data = {location: location, name: name, price: price, rooms: rooms, size: size}
  let url = `/editCabin/${name}`
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  })
  if (response.status == 200) {
    window.location = "/admincabins"
  }
}

// Redirect cabin
async function redirectCabin() {
  if (lastChosenItem) {
    const name = lastChosenItem.textContent.trim()
    window.location = `/editcabin?cabinName=${name}`
  }
  const errorMessage = document.getElementById('error')
  errorMessage.textContent = 'Please select a cabin'
}

// Delete cabin
async function deleteCabin() {
  const lastChosen = lastChosenItem

  if (lastChosen) {
    const name = lastChosen.textContent.trim()
    if (name) {
      const cabin = await fetch(`/get-cabin/${name}`)
        .then(response => response.json())

      if (cabin && cabin.docID) {
        const response = await fetch(`/cabins/${cabin.docID}`, {
          method: 'DELETE',
        })
        if (response.status === 204) {
          window.location = "/admincabins"
        }
      }
    }
  } else {
    const errorMessage = document.getElementById('error')
    errorMessage.textContent = 'Please select a cabin'
  }
}
