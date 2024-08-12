import express, { response } from 'express'
import pug from 'pug'
import session from 'express-session'
import DBfunctions from './assets/js/Database/DBfunctions.js'
import login from './assets/js/Functions/login.js'

const app = express()
app.use(express.json())
app.set('view engine', 'pug')
app.use(express.static('assets'))
app.use(session({
  secret: 'B0F24A61-A5A3-11EB-9258-5C61994B2A1E',
  saveUninitialized: true,
  resave: true
}))
app.use(express.urlencoded({ extended: true }))

app.use(login.checkTabs)

app.get('/', (request, response) => {
  let isLoggedIn = false
  if (request.session.isLoggedIn) {
      isLoggedIn = true
  }
  response.render('login', {knownUser: isLoggedIn})
})

app.post('/login', async (request, response) => {
  const {username, password} = request.body
  if (await login.checkUser(username, password)) {
    request.session.isLoggedIn = true
    request.session.username = username
    response.redirect('/home')
  } else {
    response.status(200).render('login', {error: 'Invalid username or password'})
  }
})

app.get('/home', async (request, response) => {
  let cabins = await DBfunctions.getCabins()
  response.render('home', {cabins: cabins})
})

app.post('/createbooking/:cabinName/:startDate/:endDate', async (req, res) => {
  const name = req.params.cabinName
  const startDateString = req.params.startDate
  const endDateString = req.params.endDate

  const startDate = new Date(startDateString)
  const endDate = new Date(endDateString)

  const {bedLinens, cleaning, customer, email, other, phoneNumber, towel} = req.body
  const parsedPhoneNumber = Number(phoneNumber)
  const parsedBedLinens = Boolean(bedLinens)
  const parsedTowel = Boolean(towel)
  const parsedCleaning = Boolean(cleaning)
  const cabins = await DBfunctions.getCabins()

  const cabin = cabins.find(c => c.name === name)

  await DBfunctions.addBooking(parsedBedLinens, cabin, parsedCleaning, customer, email, endDate,
                               other, parsedPhoneNumber, startDate, parsedTowel)
  res.redirect('/home')
}) 

app.get('/booking', async (request, response) => {
  const name = request.query.cabinName
  const startDate = request.query.startDate
  const endDate = request.query.endDate
  response.render('booking', { name: name, startDate: startDate, endDate: endDate })
})

app.post('/createbookingsnowmobile/:engine/:startDate/:endDate', async (req, res) => {
  const engine = req.params.engine
  const startDateString = req.params.startDate
  const endDateString = req.params.endDate
  const {other, customer, email, phoneNumber} = req.body
    
  const startDate = new Date(startDateString)
  const endDate = new Date(endDateString)
  const parsedPhoneNumber = Number(phoneNumber)
   
  const snowmobiles = await DBfunctions.getSnowmobiles()
  const snowmobile = snowmobiles.find(s => s.engine === engine)

  await DBfunctions.addBookingSnowmobile(snowmobile, startDate, endDate, other, customer, email, parsedPhoneNumber)
  res.redirect('/adminequipment')
}) 

app.get('/snowmobilebooking', async (request, response) => {
  const engine = request.query.snowmobileEngine
  const startDate = request.query.startDate
  const endDate = request.query.endDate
  response.render('snowmobilebooking', {engine: engine, startDate: startDate, endDate: endDate})
})


/*app.get('/booking/:name', async (request, response) => {
  response.redirect('/booking')
}) */

app.get('/admincabins/', async (request, response) => {
  let cabins = await DBfunctions.getCabins()
  response.render('admincabins', {cabins: cabins})
})

app.get('/admintools/', async (request, response) => {
  let logins = await DBfunctions.getLogins()
  response.render('admintools', {logins: logins})
})

app.get('/logins/:loginID', async (request, response) => {
  const login = await DBfunctions.getLogin(request.params.loginID)
  response.render('admintools', { login: login })
})

app.delete('/logins/:loginID', async (request, response) => {
  await DBfunctions.deleteLogin(request.params.loginID)
  response.status(204)
  response.end()
})

app.post('/addLogin', async (request, response) => {
  const { username, password } = request.body
  await DBfunctions.addLogin(username, password)
  response.redirect('/admintools')
})

app.get('/adminbooking/', async (request, response) => {
  let bookings = await DBfunctions.getBookings()
  let snowmobilebookings = await DBfunctions.getSnowmobileBookings()
  response.render('adminbooking', {bookings: bookings, snowmobilebookings: snowmobilebookings})
})

app.delete('/cabins/:cabinID', async (request, response) => {
  await DBfunctions.deleteCabin(request.params.cabinID)
  response.status(204)
  response.end()
})

app.delete('/snowmobiles/:snowmobileID', async (request, response) => {
  await DBfunctions.deleteSnowmobile(request.params.snowmobileID)
  response.status(204)    
  response.end()
})

app.get('/adminequipment/', async (request, response) => {
  let snowmobiles = await DBfunctions.getSnowmobiles()
  response.render('adminequipment', {snowmobiles: snowmobiles})
})

app.post('/addsnowmobile', async (request, response) => {
  const {engine, price, seats} = request.body
  const parsedPrice = Number(price)
  const parsedSeats = Number(seats)

  if (engine && parsedPrice && parsedSeats) {
    await DBfunctions.addSnowmobile(engine, parsedPrice, parsedSeats)
    response.redirect('/adminequipment')
  } else {
    response.render('addsnowmobile')
  }
})

app.post('/addcabin', async (request, response) => {
  const { name, size, rooms, location, price } = request.body
  const parsedSize = Number(size)
  const parsedRooms = Number(rooms)
  const parsedPrice = Number(price)

  if (name && parsedSize && parsedRooms && location && parsedPrice) {
    await DBfunctions.addCabin(name, parsedSize, parsedRooms, location, parsedPrice)
    response.redirect('/admincabins')
  } else {
    response.render('addcabins')
  }
})

app.get('/editSnowmobile', async (request, response) => {
  const engine = request.query.snowmobileEngine
  const snowmobiles = await DBfunctions.getSnowmobiles()
  const snowmobile = snowmobiles.find(s => s.engine === engine)
  response.render('editsnowmobile', {snowmobile: snowmobile})
})

app.put('/editSnowmobile/:engine', async (request, response) => {
  const snowmobileEngine = request.params.engine
  const {engine, price, seats} = request.body
  const snowmobiles = await DBfunctions.getSnowmobiles()
  const snowmobile = snowmobiles.find(s => s.engine === snowmobileEngine)
  const sm = {engine: engine, price: price, seats: seats, engine: snowmobileEngine, snowmobileID: snowmobile.docID }
  await DBfunctions.editSnowmobile(sm)
  response.status(200)
  response.end()
})

app.get('/editCabin', async (request, response) => {
  const name = request.query.cabinName
  const cabins = await DBfunctions.getCabins()
  const cabin = cabins.find(c => c.name === name)
  response.render('editcabins', { cabin: cabin })
})

app.put('/editCabin/:name', async (request, response) => {
  const cabinName = request.params.name
  const {location, name, price, rooms, size} = request.body
  const cabins = await DBfunctions.getCabins()
  const cabin = cabins.find(c => c.name === cabinName)
  const c = {location: location, name: name, price: price, rooms: rooms, size: size, name: cabinName, cabinID: cabin.docID }
  await DBfunctions.editCabin(c)
  response.status(200)
  response.end()
})

app.get('/editBooking', async (request, response) => {
  const customer = request.query.bookingCustomer
  const bookings = await DBfunctions.getBookings()
  const booking = bookings.find(b => b.customer === customer)
  response.render('editbooking', {booking: booking })
})

app.put('/editBooking', async (request, response) => {
  const {phoneNumber, email, cleaning, bedlinens, towels, customer, other} = request.body
  const parsedPhoneNumber = Number(phoneNumber)
  const parsedBedLinens = Boolean(bedlinens)
  const parsedTowel = Boolean(towels)
  const parsedCleaning = Boolean(cleaning)
  const bookings = await DBfunctions.getBookings()
  const booking = bookings.find(b => b.customer === customer)

  const b = {phoneNumber: parsedPhoneNumber, email: email, cleaning: parsedCleaning, bedlinens: parsedBedLinens,
             towels: parsedTowel, customer: customer, other: other, bookingID: booking.docID}
  await DBfunctions.editBooking(b)
  response.status(200)
  response.end()
})

app.delete('/bookings/:bookingID', async (request, response) => {
  await DBfunctions.deleteBooking(request.params.bookingID)
  response.status(204)
  response.end()
})

app.delete('/snowmobilebookings/:snowmobilebookingID', async (request, response) => {
  await DBfunctions.deleteSnowmobileBooking(request.params.snowmobilebookingID)
  response.status(204)
  response.end()
})

app.get('/editSnowmobileBooking', async (request, response) => {
  const customer = request.query.snowmobilebookingCustomer
  const snowmobilebookings = await DBfunctions.getSnowmobileBookings()
  const snowmobilebooking = snowmobilebookings.find(s => s.customer === customer)
  response.render('editsnowmobilebooking', {snowmobilebooking: snowmobilebooking})
})

app.put('/editSnowmobileBooking', async (request, response) => {
  const {phoneNumber, email, customer, other} = request.body
  const snowmobilebookings = await DBfunctions.getSnowmobileBookings()
  const parsedPhoneNumber = Number(phoneNumber)
  const snowmobilebooking = snowmobilebookings.find(s => s.customer === customer)
  const s = {phoneNumber: parsedPhoneNumber, email: email, 
              customer: customer, other: other, snowmobilebookingID: snowmobilebooking.docID}
  await DBfunctions.editSnowmobileBooking(s)
  response.status(200)
  response.end()
})

app.delete('/snowmobilebookings/:snowmobilebookingID', async (request, response) => {
  await DBfunctions.deleteBooking(request.params.snowmobilebookingID)
  response.status(204)
  response.end()
})

// Doesn't work yet: the cabins aren't filtered correctly
app.get('/get-cabins/:startDate/:endDate', async (req, res) => {
  const startDate = req.params.startDate
  const endDate = req.params.endDate

  try {
    let cabins = await DBfunctions.getCabins()
    let bookings = await DBfunctions.getBookings()
 
    bookings.forEach(booking => (booking.cabin))
 
    cabins.forEach(cabin => (cabin.name))

    cabins = cabins.filter(async cabin => {
      const hasConflictingBookings = bookings.some(booking => {
        const cabinData = booking.cabin
      
        return (
          cabinData &&
          cabinData.path === cabin.path &&
          booking.startDate <= endDate &&
          booking.endDate >= startDate
        )
      })
      return !hasConflictingBookings
    })

    cabins.forEach(cabin => (cabin.name))

    res.json(cabins)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/get-cabin/:name', async (req, res) => {
  try {
    let cabins = await DBfunctions.getCabins()
    
    const cabinName = req.params.name
    const cabin = cabins.find(c => c.name === cabinName)

    if (!cabin) {
      return res.status(404).json({ error: 'Cabin not found' })
    }

    res.json(cabin)
  } catch (error) {
    console.error('fetching cabin failed: ', error)
    res.status(500).json({error: 'Internal Server Error'})
  }
})

app.get('/get-booking/:customer', async (req, res) => {
  try {
    let bookings = await DBfunctions.getBookings()
    
    const bookingCustomer = req.params.customer
 
    const booking = bookings.find(b => b.customer === bookingCustomer)

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }

    res.json(booking)
  } catch (error) {
    console.error('fetching booking failed: ', error)
    res.status(500).json({error: 'Internal Server Error'})
  }
})

app.get('/get-snowmobile/:engine', async (req, res) => {
  try {
    let snowmobiles = await DBfunctions.getSnowmobiles()
    
    const snowmobileEngine = req.params.engine
    const snowmobile = snowmobiles.find(s => s.engine === snowmobileEngine)
    
    if (!snowmobile) {
      return res.status(404).json({ error: 'Snowmobile not found' })
    }

    res.json(snowmobile)
  } catch (error) {
    console.error('fetching snowmobile failed: ', error)
    res.status(500).json({error: 'Internal Server Error'})
  }
})

app.get('/get-login/:username', async (req, res) => {
  try {
    let logins = await DBfunctions.getLogins()
    
    const loginUsername = String(req.params.username)
    const login = logins.find(l => l.username === loginUsername)
    
    if (!login) {
      return res.status(404).json({ error: 'Login not found' })
    }

    res.json(login)
  } catch (error) {
    console.error('fetching login failed: ', error)
    res.status(500).json({error: 'Internal Server Error'})
  }
})

app.listen(8080, () => {  
})

app.get('/get-snowmobilebooking/:customer', async (req, res) => {
  try {
    let snowmobilebookings = await DBfunctions.getSnowmobileBookings()
    const snowmobileCustomer = req.params.customer
    const snowmobilebooking = snowmobilebookings.find(b => b.customer === snowmobileCustomer)

    if (!snowmobilebooking) {
      return res.status(404).json({ error: 'Snowmobilebooking not found' })
    }

    res.json(snowmobilebooking)
  } catch (error) {
    console.error('fetching snowmobilebooking failed: ', error)
    res.status(500).json({error: 'Internal Server Error'})
  }
})

export default {app}