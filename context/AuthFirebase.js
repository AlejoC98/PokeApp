import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './../firebase.js'
import session from "express-session";
import { application } from "express";

const AuthLogin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            return userCredential.user;
        })
        .catch((error) => {
          throw new Error(error.code);
    });
}

const AutheCheck = async (req, res, next) => {
    
    var status = true;

    switch (req.path) {
        case "/Dashboard":
        case "/module":
            if (!req.session.user) {
                res.redirect("/");
                status = false;
            }
            break;
        case "/":
        case "/Register":
            if (req.session.user) {
                res.redirect("/Dashboard");
                status = false;
            }
            break;
    }

    if (status === true)
        next();
}

// const getUserData = (user) => {
//     onAuthStateChanged(auth, (user) => {
//         if (user) {
//           // User is signed in, see docs for a list of available properties
//           // https://firebase.google.com/docs/reference/js/firebase.User
//           const uid = user.uid;
//           // ...
//         } else {
//           // User is signed out
//           // ...
//         }
//       });
// }

export { AuthLogin, AutheCheck }