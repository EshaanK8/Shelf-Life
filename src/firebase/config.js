import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDAxm__c6audTDu0i0TixJGQ9UrOi87CB4",
    authDomain: "inventorya-b09e5.firebaseapp.com",
    databaseURL: "https://inventorya-b09e5-default-rtdb.firebaseio.com",
    projectId: "inventorya-b09e5",
    storageBucket: "inventorya-b09e5.appspot.com",
    messagingSenderId: "387122632886",
    appId: "1:387122632886:web:b36cf59c543c2f32f42e17",
    measurementId: "G-R2E7ZC8JBS"
};

if (!firebase.apps.length) {
    
    firebase.initializeApp(firebaseConfig);
}

export { firebase };