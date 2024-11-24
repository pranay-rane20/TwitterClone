const express = require('express');
const app = express();
const userModel = require('./models/user.model');
const postModel = require('./models/post.model');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const flash = require('connect-flash');
const expressSession = require('express-session');



require('./config/db.config'); 
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(flash());
app.use(expressSession({
    resave:false,
    saveUninitialized : false,
    secret : "skjdfsiyfgsnf8"
}))


app.get('/', (req, res) => {
    res.render('welcome')
});

app.get('/profile', isLoggedIn ,(req, res) => {
    res.render('profile')
})
   
app.get('/register', (req, res) => {
    res.render('register', {error : req.flash("error")[0]});
})

app.post('/register', (req, res) => {
    const {username, password} = req.body;

    let user = userModel.findOne({username});
    if(user) {
        // data
        req.flash("error", "account already exists, please login.")
        return res.redirect('/register');
    }
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            await userModel.create({
                username,
                password : hash
            })
        })
        let token = jwt.sign({username}, "secret") // don't do this extremely unsafe for representational purpose only.
        res.cookie("token", token);
        res.redirect('/profile')
    })
})

app.get('/login', (req, res) => {
    res.render('login', {error : req.flash("error")[0]});
})
 
app.post('/login' , async (req, res) => {
    const {username, password}  = req.body;
    let user = await userModel.findOne({username});
    if(!user) {
        req.flash("error", "username or password is invalid");
        return res.redirect('/login');
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if(result){
            let token = jwt.sign({username}, "secret"); //don't repeat this extremely unsafe
            res.cookie("token", token);
            res.redirect('/profile');
        }
        else {
            req.flash("error", "username or password is incorrect.")
            return res.redirect("/login");
        }
    })
})


app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect('/login');
})

app.get('/feed', (req, res) => {
    res.render('feed')
})

app.get('/createpost', isLoggedIn , (req, res) => {
    res.render('createpost');
})

app.post('/createpost' , isLoggedIn , async (req, res) => {
    const { tweet } = req.body;
    await postModel.create({
        tweet,
        username : req.user.username
    })
    res.redirect('/feed');
})



function isLoggedIn(req, res, next) {
    if(!req.cookies.token){
        req.flash("error", "you must be loggedin.");
        return res.redirect('/login');
    }
    jwt.verify(req.cookies.token, "secret", (err, decoded) => { // don't write secret here, unsafe
        if(err) {
            res.cookie("token", "");
            return res.redirect('/login');
        }else {
            req.user = decoded;
            next();
        }
    })
}



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});