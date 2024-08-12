import chai from 'chai'
import supertest from 'supertest'
const assert = chai.assert
import express from '../app.js'
import login from '../assets/js/Functions/login.js'
import DBfunctions from '../assets/js/Database/DBfunctions.js'

describe('Login test', () => {
  it('should return valid login', async() => {
    const validUsername = 'sa'
    const validPassword = '123'
    const loginData = await login.checkUser(validUsername, validPassword)
    assert.equal(loginData, true)
  })  

  it('should return invalid login', async() => {
    const invalidUsername = 'asdfg'
    const invalidPassword = '123'
    const loginData = await login.checkUser(invalidUsername, invalidPassword)
    assert.equal(loginData, false)
  })
})

describe('Add cabin test', () => {
  it('should add a cabin', async () => {
    const name = "Cabin 10"
    const size = 50
    const rooms = 2
    const location = "Sweden"
    const price = 200

    await DBfunctions.addCabin(name, size, rooms, location, price) 

    const cabins = await DBfunctions.getCabins()
    const addedCabinInDB = cabins.find(cabin => cabin.name === name)

    assert.ok(addedCabinInDB, 'Expected cabin to be added to the database')
    assert.equal(addedCabinInDB.name, name, 'Expected cabin name to be added')
    assert.equal(addedCabinInDB.size, size, 'Expected cabin size to be added')
    assert.equal(addedCabinInDB.rooms, rooms, 'Expected cabin rooms to be added')
    assert.equal(addedCabinInDB.location, location, 'Expected cabin location to be added')
    assert.equal(addedCabinInDB.price, price, 'Expected cabin price to be added')
  })

  it('should not add a cabin', async() => {
    const name = "Cabin 500"
    const size = 5
    const rooms = null
    const location = "Sweden"
    const price = null
  
    if (size !== null && rooms !== null && price !== null) {
      await DBfunctions.addCabin(name, size, rooms, location, price)
    }

    const cabins = await DBfunctions.getCabins()
    const addedCabinInDB = cabins.find(cabin => cabin.name === name)
  
    assert.equal(addedCabinInDB, undefined, 'Cabin with invalid type')
  })
})

describe('Edit cabin test', () => {
  it('should add a cabin', async () => {
    const name = "Cabin " + ((await DBfunctions.getCabins()).length + 1)
    const size = 50
    const rooms = 2
    const location = "Sweden"
    const price = 200

    await DBfunctions.addCabin(name, size, rooms, location, price)

  })

  it('should return an edited cabin', async () => {
    const newName = "Cabin 3"
    const newSize = 60
    const newRooms = 3
    const newLocation = "Denmark"
    const newPrice = 300


    const cabins = await DBfunctions.getCabins()
    const cabin = cabins.find(c => c.name === "Cabin " + cabins.length)
    const c = {cabinID: cabin.docID, name: newName, size: newSize, rooms: newRooms,
               location: newLocation, price: newPrice}

    await DBfunctions.editCabin(c)

    const updatedCabins = await DBfunctions.getCabins()
    const updatedCabin = updatedCabins.find(c => c.docID === cabin.docID)

    assert.equal(updatedCabin.name, newName, 'Cabin name edited')
    assert.equal(updatedCabin.size, newSize, 'Cabin size edited')
    assert.equal(updatedCabin.rooms, newRooms, 'Cabin rooms edited')
    assert.equal(updatedCabin.location, newLocation, 'Cabin location edited')
    assert.equal(updatedCabin.price, newPrice, 'Cabin price edited')
  })
})

describe('Delete cabin test', () => {
  it('should add a cabin', async () => {
    const name = "Cabin 1000"
    const size = 50
    const rooms = 2
    const location = "Sweden"
    const price = 200

    await DBfunctions.addCabin(name, size, rooms, location, price) 
  })

  it('should delete cabin', async () => {
    const cabinsBefore = await DBfunctions.getCabins()
    const cabinDelete = cabinsBefore.find(c => c.name === "Cabin 1000")

    assert.ok(cabinDelete, 'Cabin to delete exists')

    await DBfunctions.deleteCabin(cabinDelete.docID)

    const cabinsAfter = await DBfunctions.getCabins()

    const cabinInDB = cabinsAfter.find(c => c.name === "Cabin 1000")
    assert.equal(cabinInDB, undefined)
  })
})


