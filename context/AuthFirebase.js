import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './../firebase.js'

const AuthLogin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            return userCredential.user;
            console.log(userCredential.user);
        })
        .catch((error) => {

            throw new Error(error.code);

            // const errorCode = error.code;
            // const errorMessage = error.message;
            console.log( error.message);
            console.log( error.code);
    });
}

const getUserData = (user) => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          // ...
        } else {
          // User is signed out
          // ...
        }
      });
}

export { AuthLogin, getUserData} 