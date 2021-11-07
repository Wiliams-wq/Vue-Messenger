//se importa fireabse y los servicios que se usan
import {initializeApp} from "firebase/app";
//importacion de servicios
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"


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
  const app = initializeApp(firebaseConfig);

  //se exportan constantes con los servicios que se van a usar, se usa app, que fue 
  //inicializado y constantes con los servicios de firebase
  export  const auth = getAuth(app);
  export  const db = getFirestore(app);
  export  const storage = getStorage(app);
