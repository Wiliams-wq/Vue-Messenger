import Vue from 'vue'
import VueRouter from 'vue-router'
import roomsView from '../views/roomsView.vue'
import authView from '../views/authView.vue'
import userProfileView from '../views/userProfileView.vue'
import createRoom from '../views/createRoom.vue'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: roomsView,
//creamos la propiedad meta, en donde para ser accedido debe ser requerido como true
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: "/auth",
    name: "auth",
    component:authView

  },
  {
    path: "/profile",
    name: "profile",
    component:userProfileView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/create",
    name: "createRoom",
    component:createRoom,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//usamos router.beforeEach para que se ejecute antes de cada ruta
//de esta manera protegemos las rutas a las que no queremos que el usuario pueda acceder
//asi, si intenta cambiar de ruta, se redirige  al login
router.beforeEach(async (to, from, next) => {
  //creamos una constante en donde vea donde estamos (to), matched para verificar los metadatos
  //de la ruta. some es un metodo para ver si se cumple la condicion y devuelve true o false
//some devuelte un callback, este llamada record y comparamos el resultado con el metadato requiresAuth  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  //comparamos el valor de la constate requiresAuth, que sea true o false, siempre y cuando veamos
  //lo que tenga la accion getCurrentUser(para ver si esta logueado o no)
  if (requiresAuth && !(await store.dispatch('user/getCurrentUser'))) {
    //si la respuesta es false, next es el auth, ya que no puede entrar (true de requiereAuth y false
    //de getCurrentUser)
    next({name: 'auth'});
    //hacemos la misma comparacion y si en la accion es true, entonces se puede entrar
  }else if (!requiresAuth && (await store.dispatch('user/getCurrentUser'))) {
    //si la respuesta es true, next es el home, ya quepuede entrar(true de requiereAuth y 
    //true de getCurrentUser)
    next({name: 'Home'});
  } else{
    //cualquier otra ruta puede accder
    next();
  }
})
export default router
