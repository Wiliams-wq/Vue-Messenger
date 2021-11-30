<!--componente para mostrar la vista de actualizar o cambiar datos de la sala-->
<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title has-text-centered">Editar Sala</h1>
          <!-- formulario para cambiar datos de la sala utilizamos room que es la variable local para 
          ver los datos, primero de el estado local y luego de firebase-->
          <form v-if="room">
            <div class="field">
              <label class="label">Nombre</label>
              <div class="control">
                <input
                  :placeholder="room.name"
                  v-model="room.name"
                  class="input"
                  type="text"
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Descripcion</label>
              <div class="control">
                <textarea
                  :placeholder="room.description"
                  v-model="room.description"
                  class="textarea"
                ></textarea>
              </div>
            </div>

            <div class="field is-grouped is-grouped-right">
              <div class="control">
                <button
                  type="submit"
                  class="button is-link"
                  :disabled="!hasDataChanged"
                  :class="{ 'is-loading': isLoading }"
                  @click.prevent="updateRoom"
                >
                  Actualizar
                </button>
              </div>
              <div class="control">
                <button
                  type="button"
                  class="button is-danger"
                  :class="{ 'is-loading': isLoading }"
                  @click.prevent="removeRoom"
                >
                  Borrar
                </button>
              </div>
            </div>
          </form>
          <!-- End of room form -->
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "UpdateRoom",
  async created() {
    try {
      //obtener desde estado local, le pasamos el id para ubicar la sala del estado local
      let room = this.$store.getters["rooms/getRooms"](this.id);
      //si no existe la sala en el estado local, revisar firebase
      if (!room) {
        //obtener desde firestore, si no hay nada en room o es distinto de true, lanzamos el
        //error de que no existe la sala
        room = await this.$store.dispatch("rooms/getRoom", this.id);
        if (!room.exists) throw new Error("No existe la sala");
        //agregamos los datos de getRoom (room.data) a room
        room = room.data();
      }
      //agregamos la sala a la variable local room
      this.room = room;
    } catch (e) {
      console.log(e);
    }
  },
  //la propiedad que se recibe es el id, este es de tipo string y que sea requerido con eso
  //este id es el mismo que tiene el ide de vue router para saber la sala presionada, por ende
  //es el mismo
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // la variable local como room en nulo  el loading es false
      room: null,
      isLoading: false,
    };
  },

  methods: {
    //actualizmos la sala en firebase
    async updateRoom() {
      this.isLoading = true;
      try {
        //enviamos los nuevos datos a la accion de rooms
        await this.$store.dispatch("rooms/updateRoom", {
          id: this.id,
          name: this.room.name,
          description: this.room.description,
        });
        //despues lo mandamos a la vista de rooms
        this.$router.push("/");
      } catch (e) {
        console.log(e);
      } finally {
        //descativamos el isLoading
        this.isLoading = false;
      }
    },
    //metodo para borrar la sala
    async removeRoom() {
      this.isLoading = true;
      try {
        //primero enviamos las propiedades en la accion requestConfirmation para mostrar el modal
        //el mensaje es el de la prop, tambien mandamos el nombre del componente 
        await this.$store.dispatch("utils/requestConfirmation", {
          props: { message: "¿Estas seguro de borrar la sala?" },
          component: "confirmationModal",
        });
        //si todo sale bien en esa accion, se elimina la sala, enviando el id 
        await this.$store.dispatch("rooms/removeRoom", this.id);
        //despues lo mandamos a la vista de rooms
        this.$router.push("/");
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
  },

  computed: {
    hasDataChanged() {
      //mostrar el boton si tiene algo name y description
      return this.room.name || this.room.description;
    },
  },
};
</script>