const express = require('express')
const httpsServer = require('../index')
const axios = require('axios')

require("dotenv").config()

const app = express()

// feed static folder
app.use("/", express.static("./tests/static") )

// return something on integrity check
app.get("/test", (req,res) => res.send("Server ok!"))

// prepare env values
process.env.PATH_TO_FULL_CERT='./tests/certs/server.cert'
process.env.PATH_TO_PRIVATE_KEY='./tests/certs/server.key'
process.env.HTTPS_PORT=5555


// start the server asyncronously to receive the server object.
const start = async () => {

    const server = await httpsServer(app)

    // prevent from dropping off on self-signed test certificate
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

    // Check if server is ok
    try {
        console.log("Checking server is ok, calling /test")
        const {data} = await axios.get(`https://localhost:${process.env.HTTPS_PORT}/test`)
        console.log("Server returns: ", data)
    } catch( e ){
        console.log( "Error checking server integrity:", e.message )
    }

    // Check server's static content
    try {
        console.log("Checking server static content under /")
        const {data} = await axios.get(`https://localhost:${process.env.HTTPS_PORT}`)
        console.log("Server returns: ", data)
    } catch( e ){
        console.log( "Error checking server static content:", e.message )
    }
    
    // if .env.DONT_STOP exists, don't stop the server
    if( process.env.DONT_STOP ){
        console.log( `You can check the server under https://localhost:${process.env.HTTPS_PORT}`)
        console.log( "Then stop the srcipt manually.")
    } else {
        console.log("Stopping server...")
        server.close()
        console.log("Server stopped")
        console.log("If you want to check working server manually, add .env file in project root with value DONT_STOP=1\n\n")
    }

}

start()


// this is also valid:
// https(app)
// or:
// https(app, ( server ) => { // do something with server } )



