'use strict'


class Test {
    constructor(name) {
        console.log("Constructor : " + name)
        this.name  =name
    }


    greet() {
        console.log("Ciao " + this.name)
    }


}


module.exports = Test
