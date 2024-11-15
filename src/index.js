const express = require('express');
require('dotenv').config()
const PORT = process.env.PORT;
const bodyParser = require('body-parser');
const path = require('path');
const productRoutes = require('./routes/routes');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src/css')));
app.use('/api', productRoutes);

app.set('view engine', 'ejs');
app.set('views', 'src/views')


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});