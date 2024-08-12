import {getFirestore, collection, getDocs, getDoc, doc, deleteDoc, addDoc, updateDoc} from 'firebase/firestore'
import { initializeApp } from "firebase/app"

// Configuration
const firebaseConfig = {
  apiKey: "AIzaSyClewA03uqvNSQMCjHoFooi8-hVjl4X4YQ",
  authDomain: "projekthermes-52aa0.firebaseapp.com",
  projectId: "projekthermes-52aa0",
  storageBucket: "projekthermes-52aa0.appspot.com",
  messagingSenderId: "542006607709",
  appId: "1:542006607709:web:a63b06c44d684ec52672b4"
}

// Collections
const firebase_app = initializeApp(firebaseConfig)
const db = getFirestore(firebase_app)
const cabinsCollection = collection(db, 'cabins')
const loginsCollection = collection(db, 'logins')
const snowmobilesCollection = collection(db, 'snowmobiles')
const bookingsCollection = collection(db, 'bookings')
const bookingsSnowmobileCollection = collection(db, 'bookingsSnowmobile')

// Cabin
const getCabins = async () => {
  let cabinQueryDocs = await getDocs(cabinsCollection)
  let cabins = cabinQueryDocs.docs.map(doc => {
    let data = doc.data()
    data.docID = doc.id
    return data 
  })
  return cabins
}

const deleteCabin = async (id) => {
  await deleteDoc(doc(db, 'cabins', id))
}

const addCabin = async (name, size, rooms, location, price) => {
  const cabin = {name, size, rooms, location, price}
  await addDoc(cabinsCollection, cabin)
}

const editCabin = async (cabin) => {
  await updateDoc(doc(db, 'cabins', cabin.cabinID), {
      location: cabin.location,
      name: cabin.name,
      price: cabin.price,
      rooms: cabin.rooms,
      size: cabin.size
  })
}

const addBooking = async (bedLinens, cabin, cleaning, customer, email, endDate, other, phoneNumber, startDate, towel) => {
  const booking = {bedLinens, cabin, cleaning, customer, email, endDate, other, phoneNumber, startDate, towel}
  await addDoc(bookingsCollection, booking)
}

const addBookingSnowmobile = async (snowmobile, startDate, endDate, other, customer, email, phoneNumber) => {
  const bookingSnowmobile = {snowmobile, startDate, endDate, other, customer, email, phoneNumber}
  await addDoc(bookingsSnowmobileCollection, bookingSnowmobile)
}

const editBooking = async (booking) => {
  await updateDoc(doc(db, 'bookings', booking.bookingID), {
      phoneNumber: booking.phoneNumber,
      email: booking.email,
      cleaning: booking.cleaning,
      bedlinens: booking.bedlinens,
      towels: booking.towels,
      customer: booking.customer,
      other: booking.other
  })
}


// Snowmobile
const getSnowmobile = async (id) => {
  const docRef = doc(db, 'snowmobiles', id)
  const snowmobileQueryDoc = await getDoc(docRef)
  let snowmobile = snowmobileQueryDoc.data()
  snowmobile.docID = snowmobileQueryDoc.id
  return snowmobile
}

const getCabin = async (id) => {
  const docRef = doc(db, 'cabins', id)
  const cabinQueryDoc = await getDoc(docRef)
  let cabin = cabinQueryDoc.data()
  cabin.docID = cabinQueryDoc.id
  return cabin
}

const deleteSnowmobile = async (id) => {
  await deleteDoc(doc(db, 'snowmobiles', id))
}

const getSnowmobiles = async () => {
  let snowmobileQueryDocs = await getDocs(snowmobilesCollection)
  let snowmobiles = snowmobileQueryDocs.docs.map(doc => {
    let data = doc.data()
    data.docID = doc.id
    return data 
  })
  return snowmobiles
}

const addSnowmobile = async (engine, price, seats) => {
  const snowmobile = {engine, price, seats}
  await addDoc(snowmobilesCollection, snowmobile)
}

const editSnowmobile = async (snowmobile) => {
  await updateDoc(doc(db, 'snowmobiles', snowmobile.snowmobileID), {
      engine: snowmobile.engine,
      price: snowmobile.price,
      seats: snowmobile.seats
  })
}

// Login
const getLogin = async (id) => {
  const docRef = doc(db, 'logins', id)
  const loginQueryDoc = await getDoc(docRef)
  let login = loginQueryDoc.data()
  login.docID = loginQueryDoc.id
  return login
}

const getLogins = async () => {
  let loginQueryDocs = await getDocs(loginsCollection)
  let logins = loginQueryDocs.docs.map(doc => {
    let data = doc.data()
    data.docID = doc.id
    return data
  })
  return logins
}

const addLogin = async (username, password) => {
  const login = {username, password}
  await addDoc(loginsCollection, login)
}

const deleteLogin = async (id) => {
  await deleteDoc(doc(db, 'logins', id))
}

// Booking
const getBookings = async () => {
  let bookingQueryDocs = await getDocs(bookingsCollection)
  let bookings = bookingQueryDocs.docs.map(doc => {
    let data = doc.data()
    data.docID = doc.id
    return data 
  })
  return bookings
}

const getSnowmobileBookings = async () => {
  let snowmobileBookingQueryDocs = await getDocs(bookingsSnowmobileCollection)
  let snowmobileBookings = snowmobileBookingQueryDocs.docs.map(doc => {
    let data = doc.data()
    data.docID = doc.id
    return data 
  })
  return snowmobileBookings
}

const editSnowmobileBooking = async (snowmobilebooking) => {
  await updateDoc(doc(db, 'bookingsSnowmobile', snowmobilebooking.snowmobilebookingID), {
      customer: snowmobilebooking.customer,
      email: snowmobilebooking.email,
      other: snowmobilebooking.other,
      phoneNumber: snowmobilebooking.phoneNumber
  })
}

const deleteSnowmobileBooking = async (id) => {
  await deleteDoc(doc(db, 'bookingsSnowmobile', id))
}

const deleteBooking = async (id) => {
  await deleteDoc(doc(db, 'bookings', id))
}

export default {getCabins, getSnowmobileBookings, editSnowmobileBooking, getSnowmobile, addBookingSnowmobile, getCabin, getLogin, addBooking, deleteCabin, addCabin, editBooking, getLogins, addLogin, deleteLogin, getSnowmobiles, getBookings, addSnowmobile, editSnowmobile, editCabin, deleteSnowmobile, deleteBooking, deleteSnowmobileBooking}
