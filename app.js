// Imports
import express from 'express';
const app = express();
const port = 3000;
import { AuthLogin } from './context/AuthFirebase.js';
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Static files
app.use(express.static('public'));

app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

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
];

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

app.post("/forms", (req, res) => {
    const data = req.body;
    var form;
    switch (data.action) {
        case "createGame":
            form = "../components/newGameForm";
            break;
    }

    res.render(form);
});

app.post("/modules", (req, res) => {

    let module;

    const opt = req.body.module;

    switch (opt) {
        case "home":
            module = "../components/modules/newGameModule";
            break;
        case "sets":
            module = "../components/modules/cardSetModule";
            break;
    }

    res.render(module);

});

// app.post("/pokeload", (req, res) => {

//     const action = req.body.action;

    

//     if (response)
//         res.status(200).json({
//             content: response
//         });

// });

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