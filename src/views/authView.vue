<template>
  <article class="section">
    <div class="container">
      <div class="column ed-container">
        <div class="column ed-item lg-50">
          <!-- inicio de formulario de login-->
          <template v-if="isLogin">
            <div>
              <h1 class="title has-text-centered">Login</h1>
              <form @submit.prevent="doLogin">
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
                    <button
                      type="submit"
                      class="button is-link"
                      :class="{ 'is-loading': isLoading }"
                    >
                      Login
                    </button>
                  </div>
                </div>
                <a href="#" @click="isLogin = false"> No tengo cuenta</a>
              </form>
            </div>
          </template>
          <!-- final de formulario de login-->

          <!-- inicio de formulario de registro-->
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
                    <button
                      type="submit"
                      class="button is-link"
                      :class="{ 'is-loading': isLoading }"
                    >
                      Registrarse
                    </button>
                  </div>
                </div>
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