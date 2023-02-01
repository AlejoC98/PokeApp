// Imports
import express from 'express';
const app = express();
const port = 3000;
import { AuthLogin } from './context/AuthFirebase.js';
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';
import pokemon from 'pokemontcgsdk';

pokemon.configure({apiKey: '11800482-77f0-4124-b53f-7f12ac6d690c'});

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

    let module = "";

    const opt = req.body.module;

    switch (opt) {
        case "home":
            module = "../components/modules/newGameModule";
            break;
        case "sets":
            module = "../components/modules/cardSetModule";
            break;
            case "cardsSet":
            module = "../components/modules/setCardsModule";
            break;
    }

    if (module != "")
        res.render(module);

});

app.post("/pokeload", async (req, res) => {

    const action = req.body.action;

    let response;

    switch (action) {
        case "all":
            await pokemon.card.where({ pageSize: 250, page: 1 }).then(result => {
                console.log(result.data[0].name) // "Blastoise"
                response = result;
            })
            break;
        case "sets":
            await pokemon.set.all().then((cards) => {
                // console.log(cards) // "Base"
                response = cards
            })
            break;
        case "setCards":
            let filter = req.body.filter;
            await pokemon.card.all({ q: 'set.id:' + filter }).then(result => {
                response = result;
            })
            break;
    }

    res.status(200).json({
        content: response
    });
});

app.get('/Dashboard', (req, res) => {
    res.render('index', {currentUser: "Parce"});
    // if (req.session.authenticated == true) {
    //     res.render('index', {currentUser: req.session.user.username});
    // } else {
    //     res.render('login');
    // }
});

// Listen to port
app.listen(port, () => {
    console.log(`Server Running at port ${port}`);
});