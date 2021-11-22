//modulo del usuario auntentificado o no auntentificado

import { auth, db } from '../firebase.js'

const state = {
    user: null
};

const mutations = {
    //obtenemos el usuario de el estado, y luego le pasamos 
    //el usuario que viene de firebase y lo guardamos en el estado
    setUser(state, user) {
        state.user = user;
    }
};
const actions = {
    //al hacer login, enviamos el email y password traidos desde el componente
    //AuthView con el metodo signInWithEmailAndPassword, entre parentesis
    //de ese metodo pasamos lo del componente y luego usamos currentUser
    // que sera nulo si nadie esta autentificado o esta en proceso
    async doLogin({ commit }, { email, password }) {
        await auth.signInWithEmailAndPassword(email, password);
        commit('setUser', auth.currentUser);
    },



    //con el metodo register se registra, obtenemos email, password y nombre
    //del componente, para crear el usuario usamos el metodo
    //createUserWithEmailAndPassword, entre parentesis pasamos el email y password
    //para que lo tenga firebase.

    //creamos la constate user para guardar el currentUser, despues con ese
    //user usar updateProfile, este metodo se lanza sobre la instancia del usuario
    //que este conectado, para cambiar la imagen nombre u otros metadatos
    //si se quiere almacenar datos extras se agrega un documento
    //en la base de datos que se usa, en este caso firestore.

    //dentro de updateProfile, pasamos el dato que queremos cambiar,
    //en este caso displayName: name, 

    async doRegister({ commit }, { email, password, name }) {
        await auth.createUserWithEmailAndPassword(email, password);
        const user = auth.currentUser;
        await user.updateProfile({
            displayName: name
        });
        commit('setUser', user);
    },

    //salimos del usuario, usamos el metodo signOut, solo es asi 

    async doLogout({ commit }) {
        await auth.signOut();
        commit('setUser', null);
    },
    //accion para recupera contraseña pasamos un email para nueva contraseña
    async doReset(context, email) {
        await auth.sendPasswordResetEmail(email);
    },


    //vemos si el usuario esta o no logueado, usamos promesas esto para vue-router y los guardianes
    getCurrentUser() {
        //creamos la promesa
        return new Promise((resolve, reject) => {
            //creamos la constante unsubscribe, este tendra el metodo onAuthStateChanged
            //esto devuelve una promesa, recibimos user y devolvemos unsuscribe(se retorna a si mismo)
            //si todo salve bien resolvemos con user
            const unsubscribe = auth.onAuthStateChanged(
                user => {
                    unsubscribe();
                    resolve(user);
                },
                () => {
                    //si algo falla, lanzamos reject
                    reject();
                }
            );
        });
    },
    //accion para actualizar perfil, se obtiene el nombre, email y password
    //obtenemos el usuario con currentUser, luego comparamos name si tiene algo
    //que cambie displayname pasandole name igual con email y password
    async updateProfile({ commit, state }, { name, email, password }) {
        const user = auth.currentUser;
        if (name) {
            await user.updateProfile({
                displayName: name
            });

            /*
Las transacciones en Firebase permiten realizar acciones de lectura y escritura en varios
 documentos a la vez. Se trata de operaciones atómicas, por lo que, o todas tienen éxito,
  o la operación falla en su conjunto. Algo necesario a la hora de tratar con muchos documentos. 
  
  en este caso se actualizan todos los documentos(cada mensaje) si cambia el nombre del usuario
  que envia o recibe el mensaje runTransaction es el metodo para hacer una transaccion
  primero lee el valor y luego escribe el nuevo, devuelve un callback*/
            db.runTransaction(async transaction => {
                //obtenemos todos los documentos, para reducir, se usa collectionGrup
                //y no es necesario definir la coleccion padre de messages sino solo
                //el nombre de la subcoleccion
                const query =
                    await db.collectionGroup("messages")
                    //consulatamos todos los documentos y traemos en especifico los que 
                    //sean iguales, el id del que creo el mensaje, con el id del usuario
                    //que esta logueado en el estado
                        .where("userId", "==", state.user.uid)
                        .get();
                        //todos los documentos que tiene query se recorren, se usa el callback
                        //y se usa el metodo update, para actualizar el nombre del usuario
                        //cda vez que recorra el documento, se sabe el documento con la referencia
                        //doc.ref
                query.forEach(doc => {
                    transaction.update(doc.ref, {userName: name });
                });
                const query2 =
                    await db.collectionGroup("rooms")
                        .where("userId", "==", state.user.uid)
                        .get();

                query2.forEach(doc => {
                    transaction.update(doc.ref, {userName: name });
                })
                
            })
        }
        if (email) {
            await user.updateEmail(email);
        }
        if (password) {
            await user.updatePassword(password);
        }

        commit('setUser', user);
    }

};
const getters = {
    //getter para tener el uid del usuario y comparar si es o no el dueño 
    //del que creo la sala
    getUserUid(state) {
        return state.user.uid;
    }
};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}