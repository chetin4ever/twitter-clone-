// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";

import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDn_rBWr0lNtnJF-LBaNLfg1TPBKUDy6FY",
  authDomain: "qwitter-2fa76.firebaseapp.com",
  projectId: "qwitter-2fa76",
  storageBucket: "qwitter-2fa76.appspot.com",
  messagingSenderId: "277637624400",
  appId: "1:277637624400:web:04898c136eb17fbebe1755"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();
export default db;
