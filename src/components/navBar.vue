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

          <router-link class="navbar-item" to="/"> Crear sala </router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <router-link class="button is-primary">
                <strong>Perfil</strong>
              </router-link>

              <a class="button is-light"
               @click.prevent="cerrarSesion"
              > Cerrar Sesion </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "navBar",
  //al momento de iniciar la app, obetenemos las referencias 
  //del html, y los agregamos a las variables locales refs es de vue
  mounted(){
    this.burger = this.$refs.burger;
    this.navBar = this.$refs.navBar;
  },
  data(){
    return {
//variables locales, valor inicial de cero
      burger: null,
      navBar: null,
    }
  },

  methods:{
  //agregamos funcion al boton hamburguesa, agregamos la clase is-active
  //de bulma, este se agrega si cumple con el tamaño de pantalla
  //classlist.toggle agrega o elimina la clase dependiendo si hay o no
    toggleNavBar(){
      this.burger.classList.toggle("is-active");
      this.navBar.classList.toggle("is-active");
    },
//metodo para cerrar sesion
    cerrarSesion(){}

  }
};
</script>