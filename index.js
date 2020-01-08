const https = require('https');
const fs = require('fs')

// it is supposed that dotenv.config() is required

/**
 * Creates an HTTPS server using passed listener, and starts it.
 * Requires PATH_TO_PRIVATE_KEY, PATH_TO_FULL_CERT and HTTPS_PORT values in process.env in order to run.
 * @param {Object} listener  - an express() listener
 * @returns {Object} asyncronously returns server object which can be used to manipulate running server.
 */
const httpsServer = async ( listener, callback ) => {

    if( !listener ){
        throw "ERROR: no listener! \nPlease instantiate an express server and pass it as argument"
    }

    const { PATH_TO_PRIVATE_KEY, PATH_TO_FULL_CERT, HTTPS_PORT } = process.env

    if( !PATH_TO_FULL_CERT || !PATH_TO_PRIVATE_KEY ){
        throw "ERROR: No certificate path: please, add PATH_TO_PRIVATE_KEY and PATH_TO_FULL_CERT values to .env \n" +
        "You can use the next command to create self-signed certificates: \n" +
        "openssl req -nodes -new -x509 -keyout server.key -out server.cert"
    }
    
    if( !HTTPS_PORT ){
        throw "ERROR: No port to run on: please add HTTPS_PORT value to .env"
    }
    
    // const privateKey = fs.readFileSync('cert/key.pem').toString();
    // const certificate = fs.readFileSync('cert/certificate.pem').toString();  
    
    const key = fs.readFileSync(PATH_TO_PRIVATE_KEY).toString();
    const cert = fs.readFileSync(PATH_TO_FULL_CERT).toString();
    
    // enable HTTPS
    const app = https.createServer({key, cert}, listener );
    
    console.log("Starting HTTPS server...")
    return await app.listen( HTTPS_PORT, err => {    
        if( err ){
            console.log("Server error:", err)
        } else {
            console.log(`Started. Listening to ${HTTPS_PORT}`)
            if( callback ){                
               callback( app )
            }
        }
        
        // return the server object
        return app;
    })
}


module.exports = httpsServer

