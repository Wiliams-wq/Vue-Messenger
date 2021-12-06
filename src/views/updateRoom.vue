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

             <div class="field">
              <label class="label">Image</label>
              <div class="control">
                <div
                  class="room__image"
                  :style="{
                    'background-image': `url(${roomImage})`
                  }"
                >
                  <a
                    href="#"
                    v-if="imageURL"
                    @click.prevent="image = imageURL = null"
                    class="is-pulled-right button is-small is-danger is-outlined"
                    >X</a
                  >
                </div>
                <div class="file">
                  <label class="file-label">
                    <input
                      class="file-input"
                      type="file"
                      @change="onFileChange"
                      ref="file"
                    />
                    <span class="file-cta">
                      <span class="file-label">
                        Choose a image
                      </span>
                    </span>
                  </label>
                </div>
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
      this.room = await this.$store.dispatch("rooms/getRoom", this.id)

      //agregamos a la url lo que haya dentro de imagen.
      this.imageURL = this.room._delegate._document.data.value.mapValue.fields.image.stringValue;
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
      image: null,
      //imageURL, primero devuelve del archivo local, y luego de la url final a ese archivo en 
      //storage de firebase
      imageURL: "",
    };
  },

  methods: {
    //capturamos el evento, luego en image agregamos solo una imagen si es que se seleccionan mas
    onFileChange(event){
      this.image = event.target.files[0];
      //a la variable imageURL le asignamos la url de la imagen creando una nueva url
      this.imageURL = URL.createObjectURL(this.image)
      //limpiamos el valor que tiene pasandole null
      this.$refs.file.value = null
    },




    //actualizmos la sala en firebase
    async updateRoom() {
      this.isLoading = true;
      try {
//si hay imagen que se ejecute lo siguiente
        if(this.image){
          //de manera local, se pasa el id y la imagen,y esto se agrega a la imageURL
          this.imageURL = await this.$store.dispatch("rooms/uploadRoomImage",{
            roomID: this.id,
            file: this.image
          })

          
        }


        //enviamos los nuevos datos a la accion de rooms
        await this.$store.dispatch("rooms/updateRoom", {
          id: this.id,
          name: this.room.name,
          description: this.room.description,
          image: this.imageURL
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
      //mostrar el boton si tiene algo name 0 description
      return this.room.name || this.room.description;
    },
    //si imageURL tiene algo que lo devuelva, si no , que requiera la imagen local del proyecto
    roomImage(){
      //imageUrl esta dentro del estado
      return this.imageURL ? this.imageURL : require("@/assets/image1.jpg");
    }
  },
};
</script>

<style lang="scss" scoped>
.room__image {
  height: 20vmax;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid;
  background-size: cover;
  background-position: center;
}
</style>