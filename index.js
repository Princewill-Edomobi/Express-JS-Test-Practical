const express = require('express');
const app = express();

const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const path = require('path');
var DIST_DIR = path.join(__dirname, "dist");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Serving the files on the dist folder
app.use(express.static(DIST_DIR));

const mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/practical_test';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = process.env.PORT || 3000;
const ClientController = require('./api/controllers/clients');
const ProviderController = require('./api/controllers/providers');

const checkAuth = (req,res,next)=>{next()}

const Seed = require('./seed');

//Routes
app.post("/clients/new", checkAuth, ClientController.client_create);

app.get("/clients/get-all", checkAuth, ClientController.client_get_all);

app.get("/clients/get/:clientId", checkAuth, ClientController.client_get);

app.patch("/clients/update/:clientId", checkAuth, ClientController.client_update);

app.delete("/clients/delete/:clientId", checkAuth, ClientController.client_delete);

app.post("/providers/new", checkAuth, ProviderController.provider_create);

app.get("/providers/get-all", checkAuth, ProviderController.provider_get_all);

app.get("/providers/get/:providerId", checkAuth, ProviderController.provider_get);

app.patch("/providers/update/:providerId", checkAuth, ProviderController.provider_update);

app.delete("/providers/delete/:providerId", checkAuth, ProviderController.provider_delete);

//Home Url
app.get('/home', function(req, res) {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
});

Seed();

app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`listening on ${port}`);
});