/*
  This class represents a snowmobile.
  A snowmobile has an engine, a number of seats, whether it has a sledge, a sledgehood, and price.
*/

class Snowmobile {
  #engine
  #seats
  #sledge
  #sledgeHood
  #price

  constructor(engine, seats, sledge, sledgeHood, price) {
      if (typeof engine !== 'string'  || typeof seats!== 'number'        ||
          typeof sledge !== 'boolean' || typeof sledgeHood !== 'boolean' ||
          typeof price !== 'number')
      { 
        throw new Error('Invalid parameter types')
    }
      this.#engine = engine
      this.#seats = seats
      this.#sledge = sledge
      this.#sledgeHood = sledgeHood
      this.#price = price
    }

    toString() {
      return `Engine: ${this.#engine},
              Seats: ${this.#seats},
              Sledge: ${this.#sledge},
              Sledgehood: ${this.#sledgeHood},
              Price: ${this.#price}`
        }
}
