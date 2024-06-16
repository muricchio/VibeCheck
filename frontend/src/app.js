const express = require('express');

const app = express();
const PORT = process.env.PORT;
const html_dir = __dirname + '/static';

// Designate the static folder as serving static resources
app.use(express.static(html_dir));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const frontendRoutes = require('./frontendRoutes.js');

app.use('/', frontendRoutes);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));