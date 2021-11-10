import Vue from 'vue'
import Vuex from 'vuex'

//importacion de modulos
import messages from "./messages";
import rooms from "./rooms";
import user from "./user";
import utils from "./utils";

//importacion de auth de firebase
import {auth} from "../firebase";

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
    checkAuth({commit}){
      //usamos el metodo onAuthStateChanged de firebase para chequear si esta logueado o no
      auth.onAuthStateChanged(user => {
        //comparamos la informacion de user, y mandamos el commit del estado de autenticacion
        if(user){
          commit('user/setUser', user);
        }else{
          //si no esta logueado, madamos null a la mutacion setUser
          commit("user/setUser", null);
        }
      })
    },
  },

})

export default store;
store.dispatch("checkAuth");