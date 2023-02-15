// Imports
import express from 'express';
const app = express();
const port = 3000;
import { AuthLogin, AutheCheck, CreateNewUser, getUserData } from './context/AuthFirebase.js';
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';
import { getPokeCards } from './context/AuthPoke.js';
import { Console } from 'console';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Static files
app.use(session({
    secret: "aEsfjZehIdPlcrhLCV1E5Znmbd9VU4Zx",
    cookie: {
        sameSite: "strict",
        path: "/"
    },
    saveUninitialized: true,
    resave: true
}));
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'node_modules/animate.css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/axios/dist')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(AutheCheck);

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

// Views
app.get("/", (req, res) => {

    var response = "../components/modules/loginForm";

    res.render('auth', {content : response});
});

app.get("/SignUp", (req, res) => {

    var response = "../components/modules/registerForm";

    console.log(response);

    res.render('auth', {content : response});
});

app.post("/authentication", (req, res) => {
    const {email, password} = req.body;

    let response = {};

    AuthLogin(email, password).then((result) => {
        console.log(result.uid);
        req.session.authenticated = true;
        req.session.user = {
            uid: result.uid
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

app.post("/Register", async (req, res) => {

    const {firstname, lastname, email, password} = req.body;
    // const email = req.body.email;

    console.log(req.files);
    console.log(req.body);

    // await CreateNewUser(email, password, firstname, lastname).then((result) => {
    //     console.log(result, "Resultado");
    //     res.send(true);
    // }).catch((err) => {
    //     // err.message = err.message.replace(/[^\w\s]/gi, " ");
    //     err.message = err.message.split("/");
    //     err.message = err.message[1].replace(/-/g, " ");

    //     err.message = err.message.charAt(0).toUpperCase() + err.message.slice(1);;

    //     res.status(401).json({
    //         message: err.message
    //     });
    // });
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
        case "game":
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

app.get('/Dashboard', async (req, res) => {
    let userData = {};
    await getUserData().then((res) => {
        userData = {
            "firstname" : res.displayName.split(" ")[0],
            "lastname" : res.displayName.split(" ")[1],
            "email" : res.email,
            "profile": res.photoURL
        }
    });
    
    res.render('index', {currentUser: userData});
});

app.post('/loadRound', async (req, res) => {

    req.body["action"] = "setCards";
    var cards = [];
    var matches = [];
    var players = {};

    await getPokeCards(req).then((result) => {
        // getting randon cards from set depending on game level
        for (let index = 0; index < parseInt((req.body.gameLevel - req.body.gameMatches)); index++) {
            cards.push(result[Math.floor(Math.random()*result.length)]);
        }
        // Getting randon card to create matches
        for (let index = 0; index < parseInt((req.body.gameMatches)); index++) {
            var element = cards[Math.floor(Math.random()*cards.length)];


            while (cards.filter((v) => (v === element)).length == 2) {
                element = cards[Math.floor(Math.random()*cards.length)];
            }

            cards = cards.concat([element]);
            matches.push(element.id);
        }
    }).catch((err) => {
        res.status(300).send(err);
    });

    Object.keys(req.body.players).forEach((player) => {
        players[player] = {
            "name" : req.body.players[player],
            "color" : "",
            "matches": 0
        }
    });

    res.send({
        func: "createGameField",
        args: [cards, req.body.gameMatches, players, req.body.gameRounds, req.body.filter, req.body.action, req.body.gameLevel]
    });

});

app.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.redirect("/");
    }
});

// Listen to port
app.listen(port, () => {
    console.log(`Server Running at port ${port}`);
});