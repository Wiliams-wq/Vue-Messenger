import Vue from 'vue'
import Vuex from 'vuex'

//importacion de modulos
import messages from "./messages";
import rooms from "./rooms";
import user from "./user";
import utils from "./utils";

//importacion de auth de firebase
import { auth } from "../firebase";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    messages,
    rooms,
    user,
    utils
  },

  state: {
    isLoading: true
  },


  mutations: {
    //esta mutacion sirve para cambiar el estado de true a false, esta en estado
    setLoading(state, loading) {
      state.isLoading = loading;
    }
  },


  actions: {
    //accion de index esta para validar informacion al iniciar el programa
    //como autentificacion, salas en firestore,
    checkAuth({ dispatch, commit }) {
      //usamos el metodo onAuthStateChanged de firebase para chequear si esta logueado o no
      auth.onAuthStateChanged(user => {
        //comparamos la informacion de user si esta o no logueado
        if (user) {
          //commit para mandar la informacion a user de logueado
          commit('user/setUser', user);
          //accion enviada a rooms para que si esta logueado, mostrarlos
          dispatch('rooms/getRooms');
        } else {
          //si no esta logueado, madamos null a la mutacion setUser
          commit("user/setUser", null);
          //si no esta logueado, mandamos a la mutacion setRooms una matriz vacia ya que no se
          //debe mostrar nada
          commit("rooms/setRooms", []);
          //si no esta logueado, mandamos el mismo valor que tiene la mutacion setRoomsListener
          //para que no se muestre nada
          commit("rooms/setRoomsListener", () => { });
          //si no esta logueado, mandamos a la mutacion setMessages una matriz vacia ya que no se
          //debe mostrar nada
          commit("messages/setMessages", []);
          //si no esta logueado, mandamos el mismo valor que tiene la mutacion setMessagesListener
          //para que no se muestre nada
          commit("messages/setMessagesListener", () => { });
        }
      })
    },
  },

})

export default store;
store.dispatch("checkAuth");