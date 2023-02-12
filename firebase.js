// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCkOv8W9p0hYYFkRdRx0MadoG1jm7gs8ss",
  authDomain: "pokemon-app-13e01.firebaseapp.com",
  projectId: "pokemon-app-13e01",
  storageBucket: "pokemon-app-13e01.appspot.com",
  messagingSenderId: "607603867963",
  appId: "1:607603867963:web:b157999cdc60182fbcb71e",
  measurementId: "G-0V3D4JP1VG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize firebase storage
const storage = getStorage(app);
// const analytics = getAnalytics(app);
// export const auth = getAuth(app);
const auth = getAuth(app);

export {auth, db, storage}