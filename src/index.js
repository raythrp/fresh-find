const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'src/css')));

app.set('view engine', 'ejs');
app.set('views', 'src/views')


app.listen(8080, () => {
  console.log('App listening on port 8080');
});