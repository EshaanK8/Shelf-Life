import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';
import {FIREBASE_VISION_API_KEY, FIREBASE_AUTH_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID} from "./secret.js"

const firebaseConfig = {
    apiKey: FIREBASE_AUTH_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: "1:387122632886:web:b36cf59c543c2f32f42e17",
    measurementId: "G-R2E7ZC8JBS"
};

if (!firebase.apps.length) {
    
    firebase.initializeApp(firebaseConfig);
    firebase.firestore().settings({ experimentalForceLongPolling: true });
}

export { firebase };