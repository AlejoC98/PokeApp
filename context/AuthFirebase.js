import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from './../firebase.js';
import { collection, addDoc, query, where, getDocs, doc } from "firebase/firestore";

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

const CreateNewUser = async (email, password, fisrtname, lastname) => {
    await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        // Capitalizing First and Last name
        fisrtname = fisrtname.charAt(0).toUpperCase() + fisrtname.slice(1);
        lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);

        updateProfile(user, {
            displayName: [fisrtname, lastname].join(" "),
            photoURL: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg"
        }).then(() => {
            console.log("Updated");
        }).catch((err) => {
            throw new Error(err);
        });

        return user;

    }).catch((error) => {
      throw new Error(error);
    });
}

const getUserData = async () => {
    return auth.currentUser;
}

export { AuthLogin, AutheCheck, CreateNewUser, getUserData }