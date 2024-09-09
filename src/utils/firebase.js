import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyCXOUnPDYcI-utdjBOQSISS4_i4-K5ix_M",
    authDomain: "mailing-358907.firebaseapp.com",
    projectId: "mailing-358907",
    storageBucket: "mailing-358907.appspot.com",
    messagingSenderId: "909810925791",
    appId: "1:909810925791:web:02d702ba8ccc8123afe96a",
    measurementId: "G-0N3L1GQKQ2"
};

initializeApp(firebaseConfig);

const DB = getFirestore();
const AUTH = getAuth();

export { DB, AUTH };
