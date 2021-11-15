<template>
  <article class="section">
    <div class="container">
      <div class="column ed-container">
        <div class="column ed-item lg-50">
          <!-- inicio de formulario de login
          usamos v-if si login es true(propiedad de data, true por defecto)
          se muestra el template con el login-->
          <template v-if="action === 'login'">
            <div>
              <h1 class="title has-text-centered">Login</h1>
              <form>
                <div class="field">
                  <label class="label has-text-left">Email</label>
                  <div class="control">
                    <!--en cada input, al escribir el dato que se solicita
                    lo almacenamos en una parte especificada el el arreglo de data
                    datosUser-->
                    <input
                      v-model="datosUser.email"
                      type="email"
                      class="input"
                      required
                      placeholder="Escribe tu email"
                    />
                  </div>
                </div>

                <div class="field">
                  <label class="label has-text-left">Contraseña</label>
                  <div class="control">
                    <input
                      v-model="datosUser.password"
                      type="password"
                      class="input"
                      required
                      placeholder="Escribe tu contraseña"
                    />
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <button
                      type="submit"
                      class="button is-link"
                      :class="{ 'is-loading': isLoading }"
                      @click.prevent="doLogin"
                    >
                      Login
                    </button>
                  </div>
                </div>
                <!--cambiamos el estado de isLogin, para que sea falso y se muestre
               el formulario de registro-->
                <a href="#" @click="action = 'register'"> No tengo cuenta</a>
                <a href="#" @click="action = 'reset'"> Olvidé mi contraseña</a>
              </form>
            </div>
          </template>
          <!-- final de formulario de login-->

          <!-- inicio de formulario de registro si  isLogin es falso se muestra-->
          <template v-if="action === 'register'">
            <div>
              <h1 class="title has-text-centered">Registro</h1>
              <form>
                <div class="field">
                  <label class="label has-text-left">Nombre</label>
                  <div class="control">
                    <input
                      v-model="datosUser.name"
                      type="email"
                      class="input"
                      required
                      placeholder="Escribe tu nombre"
                    />
                  </div>
                </div>
                <div class="field">
                  <label class="label has-text-left">Email</label>
                  <div class="control">
                    <input
                      v-model="datosUser.email"
                      type="email"
                      class="input"
                      required
                      placeholder="Escribe tu email"
                    />
                  </div>
                </div>

                <div class="field">
                  <label class="label has-text-left">Contraseña</label>
                  <div class="control">
                    <input
                      v-model="datosUser.password"
                      type="password"
                      class="input"
                      required
                      placeholder="Escribe tu contraseña"
                    />
                  </div>
                </div>

                <div class="field">
                  <div class="control">
                    <!--is-loding es una clase de bulma esta de forma dinamica
                    para que se muestre solo cuando sea presionado el boton cambiando
                    isLoading a true, ya que en data ahora esta en false-->
                    <button
                      type="submit"
                      class="button is-link"
                      :class="{ 'is-loading': isLoading }"
                      @click.prevent="Register"
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
                <!--si se quiere inicia sesion, cambiamos isLogin a true y se cumple
                el v-if por lo que se muestra el iniciar sesion-->
                <a href="#" @click="action = 'login'"> Quiero iniciar sesion</a>
              </form>
            </div>
          </template>
          <!-- final de formulario de  registro-->

          <!--form reset password and email-->
          <template v-if="action === 'reset'">
            <div>
              <h1 class="title has-text-centered">Reset Password</h1>
              <form>
                <div class="field">
                  <label class="label has-text-left">Email</label>
                  <div class="control">
                    <input
                      v-model="datosUser.email"
                      type="email"
                      class="input"
                      required
                      placeholder="Escribe tu email"
                    />
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <button
                      type="submit"
                      class="button is-link"
                      :class="{ 'is-loading': isLoading }"
                      @click.prevent="doReset"
                    >
                      Reset Password
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </template>
          <!--final form reset password and email-->
        </div>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "AuthView",
  data() {
    return {
      action: "login",
      isLoading: false,
      datosUser: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    //metodo para registrarse
    async Register() {
      this.isLoading = true;
      try {
        //llamamos a la store y usamos dispatch par enviar datos a la accion  user/doRegister se especifica
        //el modulo en que esta, enviamos email, que esta en this.datosUser.email el password y nombre
        await this.$store.dispatch("user/doRegister", {
          email: this.datosUser.email,
          password: this.datosUser.password,
          name: this.datosUser.name,
        });
        console.log("registro exitoso");
        this.resetData();
        this.redirect();
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false;
      }
    },
    //metodo para iniciar sesion
    async doLogin() {
      //pasamos a true el spinner para que se muestre como cargando
      this.isLoading = true;
      try {
        //llamamos a la store y usamos dispatch par enviar datos a la accion  user/doLogin se especifica
        //el modulo en que esta, enviamos email, que esta en this.datosUser.email y el password
        await this.$store.dispatch("user/doLogin", {
          email: this.datosUser.email,
          password: this.datosUser.password,
        });
        console.log("login exitoso");
        this.resetData();
        this.redirect();
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
//metodo para reset password
    async doReset() {
      this.isLoading = true;
      try {
        //llamamos a la store y usamos dispatch par enviar datos a la accion  user/doReset se especifica
        //el modulo en que esta, enviamos email, que esta en this.datosUser.email
        await this.$store.dispatch("user/doReset", this.datosUser.email);
        this.resetData();
        console.log("reset exitoso");
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },
    //metodo para limipiar los datos del formulario
    resetData() {
      this.datosUser = {
        name: "",
        email: "",
        password: "",
      };
    },
    //metodo para redireccionar al home
    redirect() {
      this.$router.push({ name: "Home" });
    },
  },
};
</script>