import DBfunctions from '../Database/DBfunctions.js'

// Authenticate user
async function checkUser(username, password) {
  const logins = await DBfunctions.getLogins()
  const user = logins.find(login => login.username === username && login.password === password)

  if (user) {
    return true
  }
  return false
}

// Check tabs
function checkTabs(request, response, next) {
  let tabs = [
    '/home', '/admincabins', '/snowmobilebooking', '/get-snowmobilebooking/:customer',
    '/adminequipment', '/admintools', '/booking', '/adminbooking', '/logins/:loginID',
    '/editBooking', '/editSnowmobile', '/get-cabins/:startDate/:endDate', '/editCabin',
    '/get-cabin/:name', '/get-booking/:customer', '/get-snowmobile/:engine',
    '/get-login/:username', '/editSnowmobileBooking',
    `/snowmobilebooking?snowmobileEngine=${encodeURIComponent(request.query.snowmobileEngine)}&startDate=${encodeURIComponent(request.query.startDate)}&endDate=${encodeURIComponent(request.query.endDate)}`,
    `/editsnowmobilebooking?snowmobilebookingCustomer=${encodeURIComponent(request.query.customer)}`,
    `/editbooking?bookingCustomer=${encodeURIComponent(request.query.customer)}`,
    `/editcabin?cabinName=${encodeURIComponent(request.query.name)}`,
    `/editsnowmobile?snowmobileEngine=${encodeURIComponent(request.query.name)}`,
    `/snowmobilebooking?snowmobileEngine=${encodeURIComponent(request.query.engine)}&startDate=${encodeURIComponent(request.query.startDate)}&endDate=${encodeURIComponent(request.query.endDate)}`,
    `/booking?cabinName=${encodeURIComponent(request.query.name)}&startDate=${encodeURIComponent(request.query.startDate)}&endDate=${encodeURIComponent(request.query.endDate)}`,
    `/booking?cabinName=${encodeURIComponent(request.query.cabinName)}`
  ]
  if (tabs.includes(request.url) && !request.session.isLoggedIn) {
      response.redirect('/')
  } else {
    next()
  }
}

export default {checkUser, checkTabs}