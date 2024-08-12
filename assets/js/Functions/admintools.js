let lastChosenItem = null

function selectItem(element) {
  if (lastChosenItem) {
    lastChosenItem.classList.toggle('selected')
  }
  element.classList.toggle('selected')

  lastChosenItem = element
}



// Delete login
async function deleteLogin() {
  const lastChosen = lastChosenItem

  if (lastChosenItem) {
    const username = lastChosen.childNodes[0].textContent.trim()
    if (username) {
      const login = await fetch(`/get-login/${username}`)
        .then(response => response.json())

      if (login && login.docID) {
        const response = await fetch(`/logins/${login.docID}`, {
          method: 'DELETE',
        })
        if (response.status === 204) {
          window.location = "/admintools"
        }
      }
    }
  } else {
    const errorMessage = document.getElementById('error')
    errorMessage.textContent = 'Please select a login'
  }
}
