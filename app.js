let express = require('express');
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');

let bodyParser = require('body-parser');
let cors = require('cors');

const routes = require('./routes/index');

const app = express();

app.use(cors());

app.use(express.json);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

const db = require('./models');
db.mongoose.connect(db.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to the database!');
    app.listen(3000, () => {
        console.log(`Express is running on port 3000`);
    });
}).catch(err => {
    console.log('Cannot connect to the database!', err);
    process.exit();
});

app.use(routes);

module.exports = app;