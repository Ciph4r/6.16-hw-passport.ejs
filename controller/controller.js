const { default: Axios } = require('axios')
const bcrypt = require('bcryptjs');
const User = require('../models/User')

require('dotenv').config()
const key = process.env.KEY


module.exports = {
    index: (req,res) => {
        res.render('main/index')
    },
    movies: (req ,res) => {
        Axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${key}&language=en-US&page=1`).then(x =>{ 
            let data =x.data.results
            res.render('main/movie' , {data})
           })
           .catch(err => console.log(err))
    },



    random: (req ,res) => {
        Axios.get('https://randomuser.me/api/?results=20').then(x =>{ 
            let data = x.data.results
            res.render('main/random' , {data})
           })
           .catch(err => console.log(err))
    },

    register: (req ,res) => {
        res.render('main/register')
    },

    registerPost : (req,res) => {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
              req.flash('errors', 'Account exists')
              return res.redirect(301, '/register')
            } else {
              const newUser = new User()
              const salt = bcrypt.genSaltSync(10)
              const hash = bcrypt.hashSync(req.body.password, salt)
        
              newUser.name = req.body.name
              newUser.email = req.body.email
              newUser.password = hash
        
              newUser
                .save()
                .then((user) => {
                  req.login(user, (err) => {
                    if (err) {
                      res
                        .status(500)
                        .json({ confirmation: false, message: 'Server Error' });
                    } else {
                      res.redirect('/logged')
                    }
                  })
                })
                .catch((err) => console.log('Error here'))
            }
          })
        },

        logged: (req ,res) => {
            res.render('main/logged')
        },
        logout: (req,res) => {
            req.logout();
            // req.sessions.destroy()
            req.flash('success', 'You are now logged out');
            res.redirect('/')
        }

}