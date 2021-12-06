//este modulo maneja los mensajes de la app, lo que llega y envia

import { db, storage } from '../firebase'
const state = {
    //mensajes son para guardar los mensajes que se creen en el chat
    messages: [],
    //recibe el query si el estado tiene la informacion de los mensajes no se activa
    //si no lo tiene se activa
    messagesListener: () => { },

    //filtros para las imagenes
    filters: [
        { name: "normal" },
        { name: "clarendon" },
        { name: "gingham" },
        { name: "moon" },
        { name: "lark" },
        { name: "reyes" },
        { name: "juno" },
        { name: "slumber" },
        { name: "aden" },
        { name: "perpetua" },
        { name: "mayfair" },
        { name: "rise" },
        { name: "hudson" },
        { name: "valencia" },
        { name: "xpro2" },
        { name: "willow" },
        { name: "lofi" },
        { name: "inkwell" },
        { name: "nashville" }
      ]
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

      //accion paraa agregar imagen a storage, se usa el id, de la sala y la imagen que se envia
      //tambien se agrega el tipo de dato que es, para agregar la extension
      async uploadMessageFile({rootGetters}, { roomID, file, type}) {

        //creamos un timestamp  con el momento actual
        const timestamp = Date.now();

        //obtenemos el uid del usuario
        const userUid = rootGetters['user/getUserUid'];
        //creamos una variable que sirve para comparar lo que tenga type, si es igual
        //a phto, entonces va la extension jpg si es distinto va .wav
        const extension = type === "photo" ? ".jpg" : ".wav";
        //esta funcion retorna una promesa, primero creamos una variable
        //en la que tiene la referencia de la imagen y la url en la que se guarda en storgae
        //en este caso, rooms, messsages, el nombre del que lo creo y el timestamp
        const uploadPhoto = () => {
            //para saber el archivo le pasamos extesnsion ya que ese lo tiene
            let imageName = `rooms/${roomID}/messages/${userUid}--${timestamp}-${extension}`;

            //se retorna la promesa de storage.ref, que es una referencia a la imagen
            // enviamos el path imagenName y el archivo image(enviado desde createRoom)
            return storage.ref(imageName).put(file)
        };
        //con esta funcion, usamos ref como respuesta de la promesa
        //esta lo retornamos con getDownloadURL, esta funcion esta en la documentacion y sirve
        //para devolver una Url a ese recurso.
        function getDownloadURL(ref) {
            return ref.getDownloadURL()
        }

        try {
            //creamos una variable que contiene la promesa de la funcion uploadPhoto
            let upload = await uploadPhoto();
            //con esta funcion, usamos la promesa de getDownloaderURL y como parametro le pasamos
            //esa url creada en imageName que lo tiene la funcion uploadPhoto
            //con .ref para tener su referencia. Devuelve una url al recurso subido
            return await getDownloadURL(upload.ref);
        } catch (error) {
            throw Error(error.message)
        }
    },



    //funcion asincrona para traer mensajes en firestore, para saber cual es 
    //la sala se pasa el Id de la misma
    async getMessages({ commit }) {
        //creamos el mensaje, es una subcoleccion de rooms,  y para que este atento se pasa
        //la funcion doSnapshot, usando collectionGroup obtenemos todos los mensajes de los documentos
        //messages
        const query = db
            .collectionGroup("messages")
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
//recibe el parametro de la sala, agregamos filters para agregarlo a la base del mensaje  
//tambien obtenemos audio y lo agregamos a la base de datos 
    async createMessage({ rootState }, { roomID, message, photo, filter, audio }) {
        //se crea una subcoleccion, que estara en el documento al que correponda el id
        await db.collection('rooms').doc(roomID).collection('messages').add({
            //datos agregados a la subcoleccion
            userId: rootState.user.user.uid,
            userName: rootState.user.user.displayName,
            roomId: roomID,
            message,
            //uso de photo para guardar la url de la imagen
            photo,
            //usamos audio para enviar a la base de datos
            audio,
            //enviamos filter
            filter,
            createdAt: Date.now()
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
