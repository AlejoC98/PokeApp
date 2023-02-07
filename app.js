// Imports
import express from 'express';
const app = express();
const port = 3000;
import { AuthLogin } from './context/AuthFirebase.js';
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';
import { getPokeCards } from './context/AuthPoke.js';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Static files
app.use(express.static('public'));

app.use('/css', express.static(path.join(__dirname, 'node_modules/animate.css')));

app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/axios/dist')));

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

// Views
app.get("/", (req, res) => {

    if (req.session.authenticated == true) {
        res.render('index');
    } else {
        res.render('login');
    }

});

app.post("/authentication", (req, res, next) => {
    const {username, password} = req.body;

    let response = {};

    AuthLogin(username, password).then((result) => {
        req.session.authenticated = true;
        req.session.user = {
            username
        }
        response["url"] = '/Dashboard';
        res.send(response);
    }).catch((err) => {
        // err.message = err.message.replace(/[^\w\s]/gi, " ");
        err.message = err.message.split("/");
        err.message = err.message[1].replace(/-/g, " ");

        err.message = err.message.charAt(0).toUpperCase() + err.message.slice(1);;

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
        case "newgame":
            module = "../components/modules/gameField";
            break;
    }

    if (module != "")
        res.render(module);

});

app.post("/pokeload", async (req, res) => {


    var response = await getPokeCards(req);

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

app.post('/NewGame', async (req, res) => {

    req.body["action"] = "setCards";
    var cards = [];

    console.log(req.body);

    await getPokeCards(req).then((result) => {
        // getting randon cards from set depending on game level
        for (let index = 0; index < parseInt((req.body.gameLevel - req.body.gameMatches)); index++) {
            cards.push(result[Math.floor(Math.random()*result.length)]);
        }
        // Getting randon card to create matches
        for (let index = 0; index < parseInt((req.body.gameMatches)); index++) {
            const element = cards[Math.floor(Math.random()*cards.length)];
            cards = cards.concat([element]);
        }

    }).catch((err) => {
        res.status(300).send(err);
    });

    res.send({
        func: "createGameField",
        args: [cards, req.body.gameMatches, req.body.players]
    });

});

// Listen to port
app.listen(port, () => {
    console.log(`Server Running at port ${port}`);
});