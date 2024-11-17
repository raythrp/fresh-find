const express = require('express');
require('dotenv').config()
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'src/css')));

const productRoutes = require('./routes/routes');
app.use('/api', productRoutes);

app.set('view engine', 'ejs');
app.set('views', 'src/views')


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});