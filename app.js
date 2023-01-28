// Imports
import express from 'express';
const app = express();
const port = 3000;
import { AuthLogin, getUserData} from './context/AuthFirebase.js';
import session from "express-session";

// Static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(session({
    secret: "aEsfjZehIdPlcrhLCV1E5Znmbd9VU4Zx",
    cookie: {
        sameSite: "strict",
    },
    saveUninitialized: false,
    resave: true
}));

var urlAuth = [
    "/Dashboard"
]

// app.use((req, res) => {
//     // if (req.session.authenticated == true)
//     //     if (!(req.route.path in urlAuth))
//     //         res.render('index');
//     // else
//     //     if (req.route.path in urlAuth)
//     //         res.render("login");
//     console.log("Sisa");
// });

// Views
app.get("/", (req, res) => {

    if (req.session.authenticated == true) {
        res.render('index');
    } else {
        res.render('login');
    }

});

app.post("/authentication", (req, res) => {
    const {username, password} = req.body;
    console.log(username);
    console.log(password);
    AuthLogin(username, password).then((result) => {
        req.session.authenticated = true;
        req.session.user = {
            username
        }
        res.redirect('/Dashboard');
    }).catch((err) => {
        err.message = err.message.replace("auth/", "");
        err.message = err.message.replace(/-/g, " ");
        res.status(401).json({
            message: err.message
        });
    });
});

app.get('/Dashboard', (req, res) => {
    if (req.session.authenticated == true) {
        res.render('index', {currentUser: req.session.user.username});
    } else {
        res.render('login');
    }
});

// Listen to port
app.listen(port, () => {
    console.log(`Server Running at port ${port}`);
});