const express = require('express');
const app = express();
const port = 3000;

const exphbs = require('express-handlebars').engine;
const routes = require('./routes');

// setting template engine
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// setting static files
app.use(express.static('public'));

// settubg body-parser
app.use(express.urlencoded({ extended: true }));

// routes setting
app.use(routes);

// connect to db
require('./config/mongoose');

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on http://localhost:${port}`);
});
