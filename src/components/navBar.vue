<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="https://bulma.io">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
          />
        </a>
        <!-- se agregar ref par poder manejar el estilo del menu hamburguesa
esto con bulma-->
        <a
          @click.prevent="toggleNavBar"
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          ref="burger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <!-- se agregar ref par poder manejar el estilo del menu hamburguesa
esto con bulma-->
      <div id="navbarBasicExample" class="navbar-menu" ref="navBar">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/"> Home </router-link>

          <router-link class="navbar-item" to="/create"> Crear sala </router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <!--template que se muestra si user tiene datos, este es es el perfil y boton de cerrar sesion-->
              <template v-if="user">
                <router-link class="button is-primary" :to="{name: 'profile'}">
                  <strong>Perfil</strong>
                </router-link>

                <a class="button is-light" @click.prevent="doLogout">
                  Cerrar Sesion
                </a>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "navBar",
  //al momento de iniciar la app, obetenemos las referencias
  //del html, y los agregamos a las variables locales refs es de vue
  mounted() {
    this.burger = this.$refs.burger;
    this.navBar = this.$refs.navBar;
  },
  data() {
    return {
      //variables locales, valor inicial de cero
      burger: null,
      navBar: null,
    };
  },

  methods: {
    //agregamos funcion al boton hamburguesa, agregamos la clase is-active
    //de bulma, este se agrega si cumple con el tamaño de pantalla
    //classlist.toggle agrega o elimina la clase dependiendo si hay o no
    toggleNavBar() {
      this.burger.classList.toggle("is-active");
      this.navBar.classList.toggle("is-active");
    },
    //metodo para cerrar sesion
    async doLogout() {
      try{
        //mandamos datos a la accion doLogout
        await this.$store.dispatch("user/doLogout");
        //al salir redirecciona a auth
        this.$router.push({name: "auth"});
        console.log("sesion cerrada");
      }catch(error){
        console.log(error);
      }
    },
  },

  computed: {
    //traemos la propiedad de mapState de nuestra store para saber si tiene datos o es nulo, si es nulo
    //el template no se muestra(perfil y boton de logout) y se muestra si tiene datos.
    ...mapState("user", ["user"]),
  },
};
</script>