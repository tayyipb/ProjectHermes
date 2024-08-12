// Booking selected
let lastChosenItem = null

function selectItem(element) {

  if (lastChosenItem) {
    lastChosenItem.classList.toggle('selected')
  }
  element.classList.toggle('selected')

  lastChosenItem = element

  if (lastChosenItem) {
    const customerElement = lastChosenItem.querySelector('td.columns:nth-child(4)')
    if (customerElement) {
      const customer = customerElement.textContent.trim()
      if (customer) {
        const snowmobileBooking = lastChosenItem.classList.contains('snowmobile-booking')
        if (snowmobileBooking) {
          updateDescriptionSnowmobiles(lastChosenItem)
        } else {
          updateDescription(lastChosenItem)
        }
      }
    }
  }
}

function updateDescription(element) {
  const customerTd = element.lastElementChild

  const customer = customerTd.textContent

  fetch(`/get-booking/${customer}`)
  .then(response => response.json())
  .then(booking => {
    const divDescription = document.getElementById('descriptionField')
    divDescription.innerHTML = ''

    const order = ['cabin', 'customer', 'email', 'phoneNumber' , 'startDate', 'endDate', 'other',
                   'cleaning', 'bedlinens', 'towels']
  
    for (const key of order) {
      if (key in booking) {
        const DivInfo = document.createElement('div')

        if (key === 'cabin' && typeof booking.cabin === 'object' && 'name' in booking.cabin) {
          DivInfo.textContent = `${key}: ${booking.cabin.name}`
        } else if (key === 'startDate' && typeof booking.startDate === 'object') {
          const startDateTimestamp = booking.startDate.seconds * 1000 + booking.startDate.nanoseconds / 1e6
          const startDateObject = new Date(startDateTimestamp)
          DivInfo.textContent = `${key}: ${startDateObject.toLocaleDateString('en-GB', { timeZone: 'UTC' })}`
        } else if (key === 'endDate' && typeof booking.endDate === 'object') {
          const endDateTimestamp = booking.endDate.seconds * 1000 + booking.endDate.nanoseconds / 1e6
          const endDateObject = new Date(endDateTimestamp)
          DivInfo.textContent = `${key}: ${endDateObject.toLocaleDateString('en-GB', { timeZone: 'UTC' })}`
        } else {
           DivInfo.textContent = `${key}: ${booking[key]}`
        }
      
        divDescription.appendChild(DivInfo)
      }
    }
  })
  .catch(error => console.error('Fetching booking failed: ', error))
}

function updateDescriptionSnowmobiles(element) {
  const customerTd = element.lastElementChild

  const customer = customerTd.textContent

  fetch(`/get-snowmobilebooking/${customer}`)
  .then(response => response.json())
  .then(snowmobilebooking => {
    const divDescription = document.getElementById('descriptionField')
    divDescription.innerHTML = ''
    
    const order = ['customer', 'email', 'phoneNumber', 'snowmobile', 'startDate', 'endDate', 'other']
  
    for (const key of order) {
      if (key in snowmobilebooking) {
        const DivInfo = document.createElement('div')
        
        if (key === 'snowmobile' && typeof snowmobilebooking.snowmobile === 'object' && 'engine' in snowmobilebooking.snowmobile) {
          DivInfo.textContent = `${key}: ${snowmobilebooking.snowmobile.engine}`
        } else if (key === 'startDate' && typeof snowmobilebooking.startDate === 'object') {
          const startDateTimestamp = snowmobilebooking.startDate.seconds * 1000 + snowmobilebooking.startDate.nanoseconds / 1e6
          const startDateObject = new Date(startDateTimestamp)
          DivInfo.textContent = `${key}: ${startDateObject.toLocaleDateString('en-GB', { timeZone: 'UTC' })}`
        } else if (key === 'endDate' && typeof snowmobilebooking.endDate === 'object') {
          const endDateTimestamp = snowmobilebooking.endDate.seconds * 1000 + snowmobilebooking.endDate.nanoseconds / 1e6
          const endDateObject = new Date(endDateTimestamp)
          DivInfo.textContent = `${key}: ${endDateObject.toLocaleDateString('en-GB', { timeZone: 'UTC' })}`
        } else {
           DivInfo.textContent = `${key}: ${snowmobilebooking[key]}`
        }
      
        divDescription.appendChild(DivInfo)
      }
    }
  })
  .catch(error => console.error('Fetching snowmobilebooking failed: ', error))
}

async function editBooking() {
  const customer = document.getElementsByName('customer')[0].value
  const phoneNumber = document.getElementsByName('phoneNumber')[0].value
  const email = document.getElementsByName('email')[0].value
  const other = document.getElementsByName('other')[0].value
  const cleaning = document.getElementsByName('cleaning')[0].checked
  const bedlinens = document.getElementsByName('bedlinens')[0].checked
  const towels = document.getElementsByName('towels')[0].checked
  let data = { customer: customer, phoneNumber: phoneNumber, email: email, other: other,
               cleaning: cleaning, bedlinens: bedlinens, towels: towels}
  let url = `/editBooking`
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  })

  if (response.status == 200) {
    window.location = "/adminbooking"
  }
}

async function editSnowmobileBooking() {
  const customer = document.getElementsByName('customer')[0].value
  const phoneNumber = document.getElementsByName('phoneNumber')[0].value
  const email = document.getElementsByName('email')[0].value
  const other = document.getElementsByName('other')[0].value
  let data = { customer: customer, phoneNumber: phoneNumber, email: email, other: other}
  let url = `/editSnowmobileBooking`
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {'Content-Type': 'application/json'},
  })
  if (response.status == 200) {
    window.location = "/adminbooking"
  }
}

async function redirectBooking() {
  const lastChosen = lastChosenItem

  if (lastChosen) {
    const customerElement = lastChosen.querySelector('td.columns:nth-child(4)')
    if (customerElement) {
      const customer = customerElement.textContent.trim()
      if (customer) {
        const snowmobileBooking = lastChosen.classList.contains('snowmobile-booking')
        if (snowmobileBooking) {
          window.location = `/editsnowmobilebooking?snowmobilebookingCustomer=${customer}`
        } else {
          window.location = `/editbooking?bookingCustomer=${customer}`
        }
      }
    }
  } else {
    const errorMessage = document.getElementById('error')
    errorMessage.textContent = 'Please select a booking'
  }
}

async function deleteBooking() {
  const lastChosen = lastChosenItem

  if (lastChosen) {
    const customerElement = lastChosen.querySelector('td.columns:nth-child(4)')
    if (customerElement) {
      const customer = customerElement.textContent.trim()

      if (customer) {
        const snowmobileBooking = lastChosen.classList.contains('snowmobile-booking')

        if (snowmobileBooking) {
          const snowmobilebooking = await fetch(`/get-snowmobilebooking/${customer}`)
            .then(response => response.json())
          if (snowmobilebooking && snowmobilebooking.docID) {
            const response = await fetch(`/snowmobilebookings/${snowmobilebooking.docID}`, {
              method: 'DELETE',
            })
            if (response.status === 204) {
              window.location = "/adminbooking"
              }
            }
          } else {
            const booking = await fetch(`/get-booking/${customer}`)
            .then(response => response.json())
          if (booking && booking.docID) {
            const response = await fetch(`/bookings/${booking.docID}`, {
              method: 'DELETE',
            })
            if (response.status === 204) {
              window.location = "/adminbooking"
              }
            }

          }
        }
      }
    } else {
      const errorMessage = document.getElementById('error')
      errorMessage.textContent = 'Please select a booking'
   }
}

