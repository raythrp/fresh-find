const express = require('express');
const fs = require('fs');
const https = require('https');
require('dotenv').config()
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, 'utf-8');
const certificate = fs.readFileSync(process.env.CERTIFICATE, 'utf-8');
const ca = fs.readFileSync(process.env.CHAIN);
const credentials = { key: privateKey, cert: certificate, ca: ca};

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'src/css')));

const productRoutes = require('./routes/routes');
app.use('/api', productRoutes);

app.set('view engine', 'ejs');
app.set('views', 'src/views')

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(443, () => {
  console.log('HTTPS server running on port 443')
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});