import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from './../firebase.js';
import { collection, addDoc, query, where, getDocs, doc } from "firebase/firestore";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage";
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
            res.redirect("/Login");
            break;
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

const CreateNewUser = async (email, password, fisrtname, lastname, profile_img) => {
    let response;

    await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
        let upload_img;
        // Capitalizing First and Last name
        fisrtname = fisrtname.charAt(0).toUpperCase() + fisrtname.slice(1);
        lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);
    
        if (profile_img != undefined) {
            const metadata = {
                contentType: 'image/jpeg'
            };
            // const metadata = {
            //     contentType: profile_img?.mimetype ?? ''
            // };
            
            var uniqueImgName = [fisrtname, lastname].join("_") + new Date();

            // Upload file and metadata to the object 'images/mountains.jpg'
            const storageRef = ref(storage, 'images/' + uniqueImgName);
            const uploadTask = await uploadBytesResumable(storageRef, profile_img.buffer, metadata);

            upload_img = await getDownloadURL(uploadTask.ref);
            
        } else {
            console.log("Nossa");
            upload_img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngall.com%2Fprofile-png%2Fdownload%2F51525&psig=AOvVaw2Cy-FavCzDKct1N41XorEC&ust=1676560375535000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLiomZ_ol_0CFQAAAAAdAAAAABAE";
        }

        await updateProfile(user, {
            displayName: [fisrtname, lastname].join(" "),
            photoURL: upload_img
        }).then(() => {
            response = auth.currentUser;
        }).catch((err) => {
            console.log(err);
            throw new Error(err);
        });
    
    }).catch((error) => {
      throw new Error(error);
    });

    return response;
}

const getUserData = async () => {
    return auth.currentUser;
}

export { AuthLogin, AutheCheck, CreateNewUser, getUserData }