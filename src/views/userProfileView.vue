<template>
  <div>
      <article class="section">
          <div class="container">
              <div class="columns">
                  <div class="column is-half is-offset-one-quarter">
                      <h1 class="title has-text-centered">Perfil</h1>
                      <!-- inicio del Formulario para cambiar informacion del perfil-->
                      <form v-if="user">
                            <div class="field">
                                <label class="label">Nombre</label>
                                <div class="control">
                                  <!--placeholder de manera dinamica
                                  para que se muestre
                                  los valores actuales de nombre,
                                  email, contraseña, estos traidos
                                  con el mapsate en user.js con los datos
                                  displayname, email y password-->
                                    <input class="input"
                                     type="text" 
                                     :placeholder="user.displayName" 
                                     v-model="userData.name">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Email</label>
                                <div class="control">
                                    <input class="input" 
                                    type="email" 
                                    :placeholder="user.email" 
                                    v-model="userData.email">
                                </div>
                            </div>
                            <div class="field">
                                <label class="label">Contraseña</label>
                                <div class="control">
                                    <input class="input" 
                                    type="password" 
                                    v-model="userData.password">
                                </div>
                            </div>
                            <div class="field">
                                <div class="control">
                                  <!--- disable para que se active o no el boton
                                  si es distinto de true queda descativado -->
                                    <button 
                                    class="button is-primary" 
                                    :class="{'is-loading': isLoading}"
                                    @click.prevent="updateProfile"
                                    :disabled="!hasDataChanged"
                                    >Actualizar</button>
                                </div>
                            </div>
                      </form>
                      <!--fin del formulario par cambiar informacion del perfil-->

                  </div>
              </div>
          </div>
      </article>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isLoading: false,
      userData: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    //metodo para actualizar, nombre email y passoword
    async updateProfile() {
      //activamos isLoading
      this.isLoading = true;
      try {
        //mandamos lo recibido en v-model a la accion user/updateProfile
        this.$store.dispatch("user/updateProfile", {
          name: this.userData.name,
          email: this.userData.email,
          password: this.userData.password,
        });
        console.log("Perfil actualizado");
        this.userData = {
          name: "",
          email: "",
          password: "",
        };
      } catch (e) {
        console.log(e);
      }finally {
        this.isLoading = false;
        this.$router.push("/");
      }
    },
  },
  computed: {
    //computed para obtener el usuario si existe o es null
    ...mapState("user", ["user"]),
    //computed para saber si los datos del usuario han cambiado
    //si cambia, se activa el boton, si no, queda como inactivo
    hasDataChanged() {
        return(
      //name exists and is different
      this.userData.name && this.userData.name !== this.user.displayName ||
        //email exists and is different
        this.userData.email && this.userData.email !== this.user.email ||
        //password exists and is different 
        this.userData.password.length
        
        );
    },
  },
};
</script>