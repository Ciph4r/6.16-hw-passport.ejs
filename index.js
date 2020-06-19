const express = require('express')
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
let MongoStore = require('connect-mongo')(session);
const User = require('./models/User');
require('dotenv').config()
require('./lib/passport');
const port = process.env.PORT || 8080
const router = require('./routes/route')

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(`MongoDB Error: ${err}`));


app.set('view engine' , 'ejs')
app.set('views' ,path.join(__dirname , 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({
        url: process.env.MONGODB_URI,
        mongooseConnection: mongoose.connection,
        autoReconnect: true
      }),
      cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
      }
    })
  );
  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
  
    next();
  });

app.use('/',router)




app.listen(port , ()=> {
    console.log(`listening on ${port}`)
})