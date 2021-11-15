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
      roomData: {
        name: "",
        description: "",
      },
    };
  },
  methods: {
      //creamos un metodo local para enviar datos a la accion de enviar datos a firestores
      async createRoom(){
          //encendemos el spinner
          this.isLoading = true;
          try{
              //mandamos a la accion en rooms los datos necesarios para la base de datos en
              //firestore
              await this.$store.dispatch("rooms/createRoom", {
                  name: this.roomData.name,
                  description: this.roomData.description,
              });
              console.log("sala creada");
              //despues de crear, la sala, enviar al home
              this.$router.push("/");
          }catch(error){
                console.log(error);
          }finally{
              //se desactiva el spinner
              this.isLoading = false;
          }
      }
  },
};
</script>