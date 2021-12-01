<template>
  <article class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-half is-offset-one-quarter">
          <h1 class="title has-text-centered">Crear sala</h1>
          <!--inicio formulario para crear sala-->
          <form>
            <div class="field">
              <label class="label">Nombre</label>
              <div class="control">
                <input
                  v-model="roomData.name"
                  class="input"
                  type="text"
                  placeholder="Ejemplo Empresa"
                  required
                />
              </div>
            </div>

            <div class="field">
              <label class="label">Descripcion</label>
              <div class="control">
                <textarea
                  v-model="roomData.description"
                  class="textarea"
                  placeholder="Ejemplo: Sala para hablar de programacion"
                  required
                ></textarea>
              </div>
            </div>

            <div class="field">
              <label class="label">Imagen</label>
              <div class="control">
                <!--este div es dinamico, muestra un backgournd dependiendo lo que devuelva
                la propiedad computada-->
                <div
                  class="room__image"
                  :style="{
                    'background-image': `url(${roomImage})`,
                  }"
                >

                <!--contiene el boton para regresar a la imagen por defecto, si se presiona
                //imageURL pasa como null y la propiedad computada muestra la imagen por defecto-->
                  <a
                    href="#"
                    v-if="image"
                    @click.prevent="image = roomData.imageURL = null"
                    class="
                      is-pulled-right
                      button
                      is-small is-danger is-outlined
                    "
                    >X</a
                  >

                </div>
                <div class="file">
                  <label class="file-label">
                    <!--accion para cargar una imagen con una referencia para usar -->
                    <input
                      class="file-input"
                      type="file"
                      @change="onFileChange"
                      ref="file"
                    />
                    <span class="file-cta">
                      <span class="file-label"> Subir imagen de portada </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div class="field has-text-right">
              <div class="control">
                <button
                  type="submit"
                  class="button is-link"
                  :class="{ 'is-loading': isLoading }"
                  @click.prevent="createRoom"
                >
                  Crear
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "CreateRoom",
  data() {
    return {
      isLoading: false,
      //recibe la imagen para enviar a storage
      image: null,

      roomData: {
        name: "",
        description: "",
        //obtenemos la imagen con su url
        imageURL: "",
      },
    };
  },
  methods: {
    //creamos un metodo local para enviar datos a la accion de enviar datos a firestores
    async createRoom() {
      //encendemos el spinner
      this.isLoading = true;
      try {
        //creamos una variable que tiene el id de la sala
        const newRoom = await this.$store.dispatch("rooms/getNewRoomId")
        //esa id de la sala la agreamos a roomID 
        const roomID = newRoom.id

        //si image(local) es diferente de null
        if (this.image) {
          //lanzamos la accion para subir imagen, le pasamos la imagen que tiene
          //y el id, este esta en la variable de arriba
          this.imageURL = await this.$store.dispatch("rooms/uploadRoomImage", {
            roomID,
            image: this.image,
           
          });
        }


        //mandamos a la accion en rooms los datos necesarios para la base de datos en
        //firestore
        await this.$store.dispatch("rooms/createRoom", {
          name: this.roomData.name,
          description: this.roomData.description,
          //mandamos imagen para la base de datos
          image: this.imageURL,
          //y el id de la sala
          roomID,
        });
        this.roomData.name, this.roomData.description, this.imageURL = "";


        console.log("sala creada");
        //despues de crear, la sala, enviar al home
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      } finally {
        //se desactiva el spinner
        this.isLoading = false;
      }
    },
    //metodo para obtener la imagen, de manera local, primero obtenemos el evento
    //luego agregamos a image, solo el primer elemento, si es que se agregan mas de uno
    onFileChange(event) {
      this.image = event.target.files[0];
      //usamos la referencia, para luego agregar un valor de nulo
      this.$refs.file.value = null;
    },
  },

  computed: {
    //propiedad computada, para mostrar la imagen cargada por defecto o la cargada por el usuario
    roomImage() {
      //retornamos la imagen
      return this.image
      //la imagen si hay algo. aca creamos un objeto de tipo url con la imagen
        ? URL.createObjectURL(this.image)
        //o el cargado por el programador
      : require("@/assets/img/image1.jpg");
    },
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