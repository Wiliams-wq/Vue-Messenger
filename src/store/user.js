//modulo del usuario auntentificado o no auntentificado

import { auth, db, firebase } from '../firebase.js'

const state = {
    user: null,
    //meta de metadatos, esta guardara informacion donde esta conectado y cuando
    //se conecto por ultima vez(en las salas)
    meta: {},
    //funcion que nos permite escuchar la informacion del usuario
    userListener: () => { }

};

const mutations = {
    //obtenemos el usuario de el estado, y luego le pasamos 
    //el usuario que viene de firebase y lo guardamos en el estado
    setUser(state, user) {
        state.user = user;
    },
    //agregamos los metadatos a meta  para tenerlos en el estado
    setMeta(state, meta) {
        state.meta = meta;
    },

    //funcion que nos permite escuchar la informacion del usuario
    setUserListener(state, userListener) {
        //si userListener es igual a true(tiene algo escuchado) entonces
        // agregamos ese listener a la funcion
        //si no, lanza la funcion para que escuche
        if (userListener) {
            state.userListener = userListener;
        } else {
            state.userListener();
        }
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
                    transaction.update(doc.ref, { userName: name });
                });
                const query2 =
                    await db.collectionGroup("rooms")
                        .where("userId", "==", state.user.uid)
                        .get();

                query2.forEach(doc => {
                    transaction.update(doc.ref, { userName: name });
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
    },


    //accion que srive para actualizar los metadatos, si entra a la sala de conversacion
    //se actualiza los metadatos y decif que esta conectado, y si se sale cambiar los metadatos
    //y mostrar el tiempo con timestamp

    //se necesita un el id para saber en que sala entro, un boleano (exit) para saber si entro o no
    //y el uid del usuario para crear su documento propio
    async updateMeta(context, { roomID, exit, uid }) {

        //creamos una coleccion para guardar los metadatos llamada user
        const ref = db.collection("users").doc(uid);
        //obtenemos los documentos y lo agregamos a userDoc
        const userDoc = await ref.get()

        //si userDoc no tiene nada, entonces con set agregamos una matriz vacia y no quede con nulo
        //esto para evitar el error FirebaseError: No document to update
        if (!userDoc.exists) {
            await ref.set({});
        }

        //agregamos a una constante los valores que tenga esto con el operador ternario, si es true arrayRemove
        //y si es false arrayUnion
        const method = exit ? "arrayRemove" : "arrayUnion";


        //actualizamos el documento con el metodo update, los datos que se actualizan es connected
        //y usamos firebase.firestore.FieldValue es metodo para despues agregar arrayUnion o arrayRemove
        //entre corchetes agregamos method por que esa constante tiene la propiedad y dentro de parentesis
        //agregamos el id de la sala como string que cambia
        await ref.update({
            connected: firebase.firestore.FieldValue[method](`${roomID}`),
            //agregamos joined esta propiedad tendra un arreglo con nombre del id de la sala que presiono
            //por eso el uso del operador ternario, y luego agregamos la fecha en que fue cambiada con DateNow
            [`joined.${roomID}`]: Date.now()

        });
    },
    //esta accion sirve para obtener los metadatos en tiempo real  y se los pase al estado meta{}
    async getMeta({ state, commit }) {
        //consultamos a users y el documento con el id del usuario por eso consutamos ese doc y le pasamos state.user.uid
        const ref = db.collection("users").doc(state.user.uid);
        //al actualizar la consulta le pasamos a conected una matriz vacia, esto si se sale de la pantalla de
        //o cierra la ventana de la web
        await ref.update({
            connected: [],
        })
        //query tendra lo que se escucha en ref con el metodo onSnapshot  que a su vez tiene como callback
        //la funcion doSnapshot
        const query = ref.onSnapshot(doSnapshot)
        //a la mutacion le pasamos el query
        commit("setUserListener", query)
        //funcion que se ejecuta cada vez que se escucha un cambio en el documento doc si cambia algo
        //se lanza el commit setMeta y se le envia los datos de doc
        function doSnapshot(doc) {
            commit("setMeta", doc.data())
        }

    },


};
const getters = {
    //getter para tener el uid del usuario y comparar si es o no el dueño 
    //del que creo la sala
    getUserUid(state) {
        return state.user.uid;
    },


};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}