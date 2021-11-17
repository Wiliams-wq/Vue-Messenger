<template>
  <section class="section">
    <div class="container">
      <h1 class="title-has-text-centered"> <b>Salas</b> </h1>
      <!--se muestra el componente, y le pasamos la propiedad la cual recibe la propiedad computada
      (valores traidos de el estado de rooms.js)-->
      <roomsComponent :rooms="rooms"/>
    </div>
  </section>
</template>

<script>
import {mapState} from "vuex"
import roomsComponent from "../components/roomsComponent.vue"

export default {
  name: "roomsView",
  components:{
    roomsComponent
  },
  //trabajamos con un mapState de rooms para ver los cambios 
  computed:{
    ...mapState("rooms", ["rooms"])
  }
};
</script>

<style lang="scss">
@import "../sass/main.scss";
</style>

