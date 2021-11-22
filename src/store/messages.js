//este modulo maneja los mensajes de la app, lo que llega y envia

import { db } from '../firebase'
const state = {
    //mensajes son para guardar los mensajes que se creen en el chat
    messages: [],
    //recibe el query si el estado tiene la informacion de los mensajes no se activa
    //si no lo tiene se activa
    messagesListener: () => { }
};

const mutations = {
    //mutacion para agregar los mensajes a el estado
    setMessages(state, messages) {
        state.messages = messages;
    },
    //mutacion para estar a la escuchar de lo que pase si se necesita o no activar el query
    setMessagesListener(state, listener) {
        if (listener) {
            //si listener tiene algo se agrega al estado
            state.listener = listener;
        } else {
            //si no, se lanza la funcion
            state.messagesListener()
        }
    },

};
const actions = {
    //funcion asincrona para traer mensajes en firestore, para saber cual es 
    //la sala se pasa el Id de la misma
    async getMessages({ commit }, roomID) {
        //creamos el mensaje, es una subcoleccion de rooms,  y para que este atento se pasa
        //la funcion doSnapshot
        const query = db
            .collection("rooms")
            .doc(roomID)
            .collection("messages")
            .orderBy("createdAt", "desc")
            .onSnapshot(doSnapshot);
            //despues de crear el mensaje, el query se agrega a la funcion del estado
            commit('setMessagesListener', query);

            //funcion que recibe snapshot para usarlo
        function doSnapshot(snapshot) {
            //creamos la constante messages con scope local
            const messages = [];
            //los daots que haya recibido los tiene snapshot por lo que hay que recorrerlo
            snapshot.forEach(doc => {
                //variable local para obtener la data de cada documento(mensaje)
                let message = doc.data();
                //a message(variable local) le agregamos el id del documento
                message.id = doc.id;
                //cada vez que recorra, lo que tenga message(variable) se lo agrega a messages(
                //constante de tipo matriz)
                messages.unshift(message);
            });
            //agregamos al estado la matriz local messages
            commit('setMessages', messages);
        }
    },
//accion para crear mensaje, se trae rooState, para tener los datos del usuario como su nombre
//y su id, se pasa el mensaje que se enviara a la subcoleccion, enviada en viewRoom, tambien
//recibe el parametro de la sala    
    async createMessage({ rootState }, { roomID, message }) {
        //se crea una subcoleccion, que estara en el documento al que correponda el id
        await db.collection('rooms').doc(roomID).collection('messages').add({
            //datos agregados a la subcoleccion
            userId: rootState.user.user.uid,
            userName: rootState.user.user.displayName,
            message,
            createdAt: new Date()
        });
    }

};
const getters = {

};
export default {
    //namespaced: true es para que separar los moduls vuex
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
