import snowmobile from './snowmobile'
import cabin from './cabin'

/*
  This class represents a booking.
  A booking has a cabin to be booked within specified dates, a customer who owns the booking, their
  email and phone number, and whether they want cleaning, bedline and towels.
  A booking also has an other field which contains notes about extra clothes, helmets, shoes, snowmobiles,
  sleds etc. that the renter has requested.
*/

class Booking {
  #cabin
  #customer
  #email
  #phonenumber
  #startDate
  #endDate
  #cleaning
  #bedlinens
  #towel
  #other

  constructor(cabin, customer, email, phonenumber, startDate, endDate, cleaning, bedlinens, towel, other) {
      if (typeof cabin !== Cabin                || typeof customer !== 'String'       ||
          typeof email !== 'string'             || typeof phonenumber !== 'number'    ||
          typeof startDate !== Date             || typeof endDate !== Date            ||
          typeof cleaning !== 'boolean'         || typeof bedlinens !== 'boolean'     ||
          typeof towel !== 'boolean'            || typeof other !== 'string') 
      {
        throw new Error('Invalid parameter types')
    }
      this.#cabin = cabin
      this.#customer = customer
      this.#email = email
      this.#phonenumber = phonenumber
      this.#startDate = startDate
      this.#endDate = endDate
      this.#cleaning = cleaning
      this.#bedlinens = bedlinens
      this.#towel = towel
      this.#other = other
    }

    toString() {
      return `Cabin: ${this.#cabin},
              Customer: ${this.#customer},
              Email: ${this.#email},
              Phonenumber: ${this.#phonenumber},
              StartDate: ${this.#startDate},
              EndDate: ${this.#endDate},
              Cleaning: ${this.#cleaning},
              Bedlinens: ${this.#bedlinens},
              Towel: ${this.#towel},
              Other: ${this.#other}`
        }
}

