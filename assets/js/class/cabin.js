/*
  This class represents a cabin.
  A cabin has a name, a size (m^2), a number of rooms, a location and a price of renting.
*/

class Cabin {
  #name
  #size
  #rooms
  #location
  #price
 
  constructor(name, size, rooms, location, price) {
      if (typeof name !== 'string'  || typeof size !== 'number'     ||
          typeof rooms !== 'number' || typeof location !== 'string' ||
          typeof price !== 'number') 
      {
        throw new Error('Invalid parameter types')
    }
      this.#name = name
      this.#size = size
      this.#rooms = rooms
      this.#location = location
      this.#price = price
    }

    toString() {
      return `Name: ${this.#name},
              Size: ${this.#size},
              Rooms: ${this.#rooms},
              Location: ${this.#location},
              Price: ${this.#price}`
      }
}
