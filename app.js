require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const simplifyRoute = require('./routes/simplify');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', simplifyRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
