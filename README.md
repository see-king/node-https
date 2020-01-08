# Simple nodejs HTTPS server running on express and https

## Usage

First, make sure you have SSL sertificate and public key files.
- You can use `openssl req -nodes -new -x509 -keyout server.key -out server.cert` to generate self-signed certificate.

Add PATH_TO_FULL_CERT, PATH_TO_PRIVATE_KEY and HTTPS_PORT values in .env file:
### .env:
```
PATH_TO_FULL_CERT=./certs/server.cert
PATH_TO_PRIVATE_KEY=./certs/server.key
HTTPS_PORT=5555
```

Then feed an express() listener with routing to the app.
### test.js:
```javascript
require("dotenv").config()
const express = require('express')
const httpsServer = require('https-server')

// create express listener
const api = express()

// add any routing here, e.g. api.get("/", (req, res) => res.send("Server OK!")))

httpServer( api ) // now HTTPS server is running
```

alternatively, receive https object within callback
```javascript
httpsServer( api, server => {
    // do something with server, e.g. server.close()
})
```

or call asynchronously and receive server object as result
```javascript
(
    async () => {
        const server = await httpsServer(api)
        // do something with server
        // ... 
        // close
        server.close()
        }
)()

```

## Tests

- `npm test` runs a small test with server on port 5555.
- `npm run test-live` does the same, but doesn't close the server after checking it, so that user can check the server manually.