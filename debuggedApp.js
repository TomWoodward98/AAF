let express = require('express');
let mongoose = require('mongoose');
let cookieParser = require('cookie-parser');

let bodyParser = require('body-parser');
let cors = require('cors');

const User = require('./models/user');
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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


//TempAddRoute-ForTesting
app.post('/api/register', function(req, res) {
    const { email, password } = req.body;
    const user = new User({ email, password });
    user.save(function(err) {
      if (err) {
        console.log(err);
        res.status(500).send("Error registering your account, try again.");
      } else {
        res.status(200).send("you have successfully registered!");
      }
    });
  });

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
  });
