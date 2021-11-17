//este modulo maneja las salas de la app de mensajes
import { db } from '../firebase';
const state = {
    //arreglo que tiene las salas
    rooms: [],
    //recibe a query, para activarlo o desactivarlo, si lo tiene el estado, no se activa
    //si no lo tiene el estado, se activa
    roomsListener: () => {}

};

const mutations = {
    //mutacion para agregar sala al estado
    setRooms(state, rooms) {
        state.rooms = rooms;
    },
    //mutacion para crear sala, unica con los datos y su id tipo de cambio add
    createRoom(state, { roomData, id }) {
        roomData.id = id
        state.rooms.unshift(roomData)
    },
    //mutacion para actualizar sala, se sabe cual es por su id pasandole su nuevo
    //valor
    updateRoom(state, { index, roomData, id }) {
        roomData.id = id
        state.rooms[index] = roomData
    },
    //mutacion para eliminar sala, con splice se elimina el elemento ya que se tiene el indice
    //y el numero de elementos a eliminar (1)
    removeRoom(state, index) {
        state.rooms.splice(index, 1)
    },

    //escuchar al query que se pasa
    setRoomsListener(state, listener) {
        //si listener tiene algo
        if(listener){
            //se agrega al estado
            state.roomsListener = listener
            //si no tiene, se ejecuta el query
        }else{
            state.roomsListener()
        }
    }
};
const actions = {
    //accion para crear sala, recibimos del componente el nombre y la descripcion
    async createRoom({ rootState }, { name, description }) {
        //con await usamos la constante db de firestore y llamamos a la coleccion rooms si existe
        //lo agrega y si no esta lo crea, con add agregamos los elementos que recibimos
        await db.collection('rooms').add({
            name,
            description,
            //este es para agregar el dato de ahora(momento en que se crea)
            createdAt: Date.now(),
            //agregamos el uid, este proporcionado por firebase autentication por eso lo llamamos
            //user como archivo y user como elemnto de estao
            createdBy: rootState.user.user.uid,
            //agregamos el nombre de quien lo creo, en este caso displayName
            CreateByName: rootState.user.user.displayName
        });
    },



    //obtenemos las salas creadas en firestore
    async getRooms({ commit }) {
        //obtenemos la colleccion rooms de manera ordenada, tambien agregamos onSnapshot para
        //escuchar cambios en la coleccion, este recibe una funcion, creada en la parte de abajo
        const query = db.collection('rooms').orderBy('createdAt', 'desc').onSnapshot(doSnapshot);
        
        //mandamos el query a la mutacion setRoomsListener
        commit('setRoomsListener', query)

        //funcion para escuchar cambios de la coleccion, esta tiene tres formas, added
        //removed y modified
        function doSnapshot(querysnapshot) {
            //pasamos a true para comenzar como propiedad asyncrona
            commit("setLoading", true, { root: true });

            //usamos el metodo para escuchar todos los cambios de la coleccion
            //y los ciclamos para recibir uno por uno y pasar por cada condicion
            querysnapshot.docChanges().forEach(change => {

                //si el tipo de cambio es added, lanzamos el commit createRoom para crear la sala
                if (change.type === 'added') {
                    commit('createRoom', {
                        roomData: change.doc.data(),
                        id: change.doc.id
                    })
                }

                //si el cambio es modified, lanzamos el commit updateRoom para actualizar la sala
                //agregaos nuevo index, y los datos nuevos
                if (change.type === 'modified') {
                    commit('updateRoom', {
                        index: change.newIndex,
                        roomData: change.doc.data(),
                        id: change.doc.id
                    })
                }

                //si el cambio es removed, lanzamos el commit removeRoom para eliminar la sala
                //pasando el indice anterior
                if (change.type === 'removed') {
                    commit('removeRoom', change.oldIndex)
                }
            });
            //pasamos a false para terminar la propiedad asyncrona
            commit("setLoading", false, { root: true });
        }

    },
    //metodo para obtener la sala por id, esta solo obtiene una 
    async getRoom(context, id) {
        //obtenemos la coleccion rooms de manera ordenada
        return await db.collection('rooms').doc(id).get();
    },
    //metodo para actualizar la sala
    async updateRoom(context, { id, name, description }) {
        //constante (arreglo)que se enviara a la coleccion al actualizar
        const roomData = {};
        //si name tiene algo agregamos a al arreglo de roomData lo recibido enviado por el componente
        if (name) roomData.name = name;
        //si description tiene algo agregamos a al arreglo de roomData lo recibido enviado por el componente
        if (description) roomData.description = description;
        //enviamos a la coleccion los nuevos datos que tiene el arreglo roomData
        //se sabe cual es el documento por que recibimos el id, y este se lo pasamos a doc
        await db.collection('rooms').doc(id).update(roomData);
    }
};

const getters = {
    //getter para obtener las salas por id, de esta manera de todos los que estan en el arreglo
    //se sabe cual se tiene 
    getRooms: state => id => {
        return state.rooms.filter(room => room.id === id);
    }
};


export default {
    //namespaced: true es para que separar los moduls vuex
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

