<template>
  <section class="section">
    <div class="container">
      <h1 class="title-has-text-centered"><b>Salas</b></h1>
      <!--se muestra el componente, y le pasamos la propiedad la cual recibe la propiedad computada
      (valores traidos de el estado de rooms.js) enviamos la propiedad computada
     y envimos el getters que tiene las salas ordenadas -->
      <roomsComponent
        :unreadMessages="unreadMessages"
        :rooms="$store.getters['rooms/roomsByDate']"
      />
    </div>
  </section>
</template>

<script>
import { mapState } from "vuex";
import roomsComponent from "../components/roomsComponent.vue";

export default {
  name: "roomsView",
  components: {
    roomsComponent,
  },
  //trabajamos con un mapState de rooms para ver los cambios
  computed: {
    ...mapState("messages", ["messages"]),
    ...mapState("rooms", ["rooms"]),
    ...mapState("user", ["meta"]),

    //propiedad para saber cuantos mensajes no leidos hay
    unreadMessages() {
      //filtramos todos los mensajes
      return this.messages.filter((message) => {
        return (
          // User participated
          this.meta.joined[message.roomId] &&
          // Mensaje llegados despues de la ultima conexion a la sala
          this.meta.joined[message.roomId] < message.createdAt
        );
      });
    },
  },


};
</script>

<style lang="scss">
@import "../sass/main.scss";
</style>

