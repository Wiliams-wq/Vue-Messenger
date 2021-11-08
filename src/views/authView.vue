<template>
  <article class="section">
    <div class="container">
      <div class="column ed-container">
        <div class="column ed-item lg-50">
          <!-- inicio de formulario de login
          usamos v-if si login es true(propiedad de data, true por defecto)
          se muestra el template con el login-->
          <template v-if="isLogin">
            <div>
              <h1 class="title has-text-centered">Login</h1>
              <form @submit.prevent="doLogin">
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
                    >
                      Login
                    </button>
                  </div>
                </div>
               <!--cambiamos el estado de isLogin, para que sea falso y se muestre
               el formulario de registro-->
                <a href="#" @click="isLogin = false"> No tengo cuenta</a>
              </form>
            </div>
          </template>
          <!-- final de formulario de login-->

          <!-- inicio de formulario de registro si  isLogin es falso se muestra-->
          <template v-else>
            <div>
              <h1 class="title has-text-centered">Registro</h1>
              <form @submit.prevent="register">
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
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
                <!--si se quiere inicia sesion, cambiamos isLogin a true y se cumple
                el v-if por lo que se muestra el iniciar sesion-->
                <a href="#" @click="isLogin = true"> Quiero iniciar sesion</a>
              </form>
            </div>
          </template>
          <!-- final de formulario de  registro-->
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
      isLogin: true,
      isLoading: false,
      datosUser: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    register() {},
    doLogin() {},
  },
};
</script>