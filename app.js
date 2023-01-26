// Imports
import express from 'express';
const app = express();
const port = 3000;
import { AuthLogin, getUserData } from './context/AuthFirebase.js'

// Static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


let LoginError = undefined;

// Set Views
app.set('views', './views');
app.set('view engine', 'ejs');

// Views
app.get("/", (req, res) => {
    res.render('login', {error : LoginError});
});

app.post('/Dashboard', (req, res) => {
    // AuthLogin(req.body.username);
    AuthLogin(req.body.username, req.body.password).then((result) => {
        res.send("You're logged", {currentUser: `Email or Password doesn't match`});
        console.log( Object.getOwnPropertyNames(result));
        console.log(result.email);
    }).catch((err) => {
        LoginError = `Email or Password doesn't match`;
        res.redirect('/');
    });
    
});

// Listen to port
app.listen(port, () => {
    console.log(`Server Running at port ${port}`);
});