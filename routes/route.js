const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')
const passport = require('passport');


const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.send('You are not authorized to view this page');
    }
  };


router.get('/' , controller.index)
router.get('/movies' ,auth, controller.movies)
router.get('/random' ,auth, controller.random)
router.get('/register' , controller.register)
router.post('/register' , controller.registerPost)



router.post('/login',
passport.authenticate('local-login', {
  successRedirect: '/logged',
  failureRedirect: '/',
  failureFlash: true
}))


router.get('/logged' ,auth, controller.logged)
router.get('/logout' , controller.logout)




module.exports = router