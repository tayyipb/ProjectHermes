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

// Dates selected
let startDateInput = document.getElementById('startDate')
let endDateInput = document.getElementById('endDate')

startDateInput.addEventListener('change', dateChanged)
endDateInput.addEventListener('change', dateChanged)

async function dateChanged() {

  let startDate = document.getElementById('startDate').value
  let endDate = document.getElementById('endDate').value

  if (startDate && endDate) {
    fetch(`/get-cabins/${startDate}/${endDate}`)
    .then(res => res.json())
    .then(data => {updateCabinList(data)})
    .catch(error => {console.error('Error:', error)})
  }
}

// Update cabin list
function updateCabinList(cabins) {
  let cabinList = document.getElementById('cabinList')

  cabinList.innerHTML = ''

  cabins.forEach(cabin => {
    let cabinDiv = document.createElement('div')
    cabinDiv.classList.add('selectable-item')
    cabinDiv.textContent = cabin.name
    cabinDiv.onclick = function() {selectItem(this)}

    cabinList.appendChild(cabinDiv)
  })

  // Reset the description field
  const divDescription = document.getElementById('descriptionField')
  divDescription.innerHTML = ''
}

async function redirectBooking() {
  let startDate = document.getElementById('startDate').value
  let endDate = document.getElementById('endDate').value

    if (lastChosenItem && startDate && endDate) {
      const name = lastChosenItem.textContent.trim()
      window.location = `/booking?cabinName=${name}&startDate=${startDate}&endDate=${endDate}`
    }
    if (!lastChosenItem) {
      const errorMessage = document.getElementById('error')
      errorMessage.textContent = 'Please select a cabin'
    }
    else {
      const errorMessage = document.getElementById('error')
      errorMessage.textContent = 'Please select a date'
    }
}

