// import
import firebase from 'firebase'
// import '@firebase/firestore';
import { getFirestore } from '@firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyBkLTfXG2UDL2L_NVLW8qW_AKaxh_-VX2o",
  authDomain: "clone-important.firebaseapp.com",
  projectId: "clone-important",
  storageBucket: "clone-important.appspot.com",
  messagingSenderId: "817417385236",
  appId: "1:817417385236:web:933dbc0634b64e2744be01"
};

const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
const db = app.firestore()
export default db