<template>
  <!--este componente solo se muestra si dentro de isLoading es distinto de true
diciendo que termino de cargar-->
  <div v-if="!$store.state.isLoading">
    <!--este h1 se muestra solo si rooms es diferente de cero, quiere decir que no
      tiene ni un dato-->
    <h1 v-if="!rooms.length" class="subtitle has-text-centered mt-2">
      No hay sala de conversacion.
      <!--si no tiene muestra un link a create para crear una sala-->
      <router-link :to="{ name: 'createRoom' }">Crear Sala</router-link>.
    </h1>
    <!--si es else se muestran todas las salas-->
    <div v-else class="columns is-multiline">
      <!-- Room element  con for para que room sea lo que tiene rooms-->
      <div
        v-for="(room, index) in rooms"
        :key="index"
        class="column is-one-third"
      >
        <!--router link envuelve todo el componente para que puede ser presionado y mandar al
        lugar de mensajes-->
        <router-link :to="{ name: 'viewRoom', params: { id: room.id } }">
          <!--uso de la clase unread para que se muestre si hasUnreadMessages sea true-->
          <div
            class="card room"
            :class="{ unread: hasUnreadMessages(room.id).length }"
          >
            <div v-if="hasUnreadMessages(room.id).length" class="unread-alert">
              {{ hasUnreadMessages(room.id).length }} unread messages 🔥
            </div>
            <!--card que tiene el fondo con la imagen que fue subida, se usar v-bind la funcion
            getRoomImage con el id para que se sepa cual sala es y que imagen correponde-->
            <div
              class="card-image room__image"
              :style="{ 'background-image': `url(${getRoomImage(room.id)})` }"
            ></div>
            <div class="card-content">
              <div class="media">
                <div class="media-content">
                  <!--mostramos el nombre de la sala-->
                  <p class="title is-4">{{ room.name }}</p>
                  <!--mostramos el nombre del que creo la sala-->
                  <p class="subtitle is-6"><b>Por </b> {{ room.userName }}</p>
                </div>
              </div>
              <!--mostramos la descripcion-->
              <div class="content">
                {{ room.description }}
              </div>
              <!--boton para editar, enviamos como parametro el id al router para que se muestre en la ruta
            ya que es dinamica, usamos v-if para comparar que sea el mismo usuario el que lo creo y el que
            esta en logueado, ya que si no puede cambiar los datos sin necesidad de ser el creador del mismo-->
              <router-link
                :to="{ name: 'updateRoom', params: { id: room.id } }"
                class="button is-small"
                v-if="room.userId === $store.getters['user/getUserUid']"
              >
                Editar
              </router-link>
            </div>
          </div>
        </router-link>
      </div>
      <!-- End of room element -->
    </div>
  </div>
</template>

<script>
export default {
  name: "roomsComponent",
  //recibimos una propiedad enviada por el componente padre, roomsView de tipo array
  //ya que vienen varios datos, y es de manera requerida
  props: {
    rooms: {
      type: Array,
      required: true,
    },
    //propiedad recibida de roomsView
    unreadMessages: {
      type: Array,
    },
  },

  methods: {
    //pasamos el id
    getRoomImage(roomId) {
      //con find buscamos el id que sea igual al que fue pasado por parametro
      const room = this.rooms.find(room => room.id === roomId);
      //si tiene algo lo muestra, si no, que muestre la imagen por defecto
      return room.image ? room.image : require("@/assets/image1.jpg");
    },



    //si tiene mensajes sin leer que se muestre, pasamos el id de la sala
    hasUnreadMessages(roomId) {
      //filtramos la propiedad enviada, y retornamos si message con el id de la sala es igual al id de la sala
      //en que esta
      return this.unreadMessages.filter((message) => {
        return message.roomId === roomId;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.room {
  position: relative;
  &.unread {
    border: 3px solid orange;
    animation: slidein 0.6s infinite alternate ease-in-out;
  }
  .unread-alert {
    position: absolute;
    top: 0;
    right: 0;
    background-color: orange;
    padding: 1rem;
    z-index: 2;
  }
}
@keyframes slidein {
  from {
    transform: translateY(-1rem);
  }
  to {
    transform: translateY(1rem);
  }
}

.room__image {
  height: 15vmax;
  background-size: cover;
  background-position: center;
}
</style>