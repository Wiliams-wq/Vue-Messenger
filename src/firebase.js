
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

//datos de la aplicacion dada por firebase
 const firebaseConfig = {
    apiKey: "AIzaSyDjAEB_MeQ_C6oNO785I84XM9m9ahH9Nl0",
    authDomain: "vuemessenger-cf856.firebaseapp.com",
    projectId: "vuemessenger-cf856",
    storageBucket: "vuemessenger-cf856.appspot.com",
    messagingSenderId: "505685991966",
    appId: "1:505685991966:web:516066721a4e17103dc40f",
    measurementId: "G-GEHHGWVBSQ"
  };

  //se inicializa firebase
  firebase.initializeApp(firebaseConfig);

  //se exportan constantes con los servicios que se van a usar, se usa app, que fue 
  //inicializado y constantes con los servicios de firebase
  
export const db = firebase.firestore(); 
export const auth = firebase.auth();
export const storage = firebase.storage();

