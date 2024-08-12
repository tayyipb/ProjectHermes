/*
  This class represents a login.
  A login has a (user)name and a password.
*/

class Login {
  #name
  #password

  constructor(name, password) {
      if (typeof name !== 'string' || typeof password !== 'string') 
      { 
        throw new Error('Invalid parameter types')
    }
      this.#name = name
      this.#password = password
    }
    
    toString() {
      return `Name: ${this.#name},
              Password: ${this.#password}`
        }
}
