//este modulo maneja las salas de la app de mensajes
import { db } from '../firebase';
const state = {
    //arreglo que tiene las salas
    rooms: []
};

const mutations = {
    //mutacion para agregar sala al estado
    setRooms(state, rooms) {
        state.rooms = rooms;
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
        //obtenemos la colleccion rooms de manera ordenada 
        const query = db.collection('rooms').orderBy('createdAt', 'desc');   
        //escuchamos la coleeccion que esta en query con onSnapshot que devuelve una promesa
        query.onSnapshot(querySnapshot => {
            //creamos una constante para recibir los datos de maenra local
            const rooms = [];
            //lanzamos el commit a true y root true para que se active
            commit("setLoading", true, { root: true });
            //la promesa obtenida, se cicla, esta es doc cada uno estara en data
            querySnapshot.forEach(doc => {
                //variable rooms para tener la data del documento recorrido 
                let room = doc.data();
                //al id de room le pasamos el id del documento recorrido
                room.id = doc.id;
                //empujamos room a rooms (matriz local)
                rooms.push(room);
            });
            //pasamos a false el setLoading para que deje de cargar 
            commit("setLoading", false, { root:true });
            //hacemos commit a set rooms y pasamos la matriz local rooms
            commit("setRooms", rooms);
        });

    }

};


export default {
    //namespaced: true es para que separar los moduls vuex
    namespaced: true,
    state,
    mutations,
    actions
}