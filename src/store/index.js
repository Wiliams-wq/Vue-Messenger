import Vue from 'vue'
import Vuex from 'vuex'

//importacion de modulos
import messages from "./messages";
import rooms from "./rooms";
import user from "./user";
import utils from "./utils";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    messages,
    rooms,
    user,
    utils
  },

  state: {
  },


  mutations: {
  },


  actions: {
    //el estado de autenticacion del usuario, para chequear si esta o no logueado
    checkAuth(){

    },
  },

})

export default store;
store.dispatch("checkAuth");