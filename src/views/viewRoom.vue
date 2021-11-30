<template>
  <div>
    <article class="section">
      <div class="container">
        <div class="columns">
          <!--si room tiene algo se muestra este componente, de lo contrario no-->
          <div v-if="room" class="column is-half is-offset-one-quarter">
            <!--mostrar nombre de la sala, ver por que no funciona-->
            <h1 class="title has-text-centered">{{ room.name }}</h1>
            <!--referencia messages para mostrar siempre el primer mensaje-->
            <div class="messages content" ref="messages">
              <!--ciclar los mensajes para que se muestren uno por uno cda vez que haya nuevos
              y se muestra la clase messaje si el mensaje es del usuario esto se sabe usando el
              el getters de user, comparando que sea igual al userId del message  messages de el mapState
              usamos una propiedad computada para que filtre los mensajes de acuerdo a la sala -->
              <div
                v-for="message in roomMessages"
                :key="message.id"
                class="message"
                :class="{
                  'message--own':
                    message.userId === $store.getters['user/getUserUid'],
                }"
              >
                <p>
                  <!--se muesta el mensaje-->
                  {{ message.message }}
                  <span
                    v-if="message.userId !== $store.getters['user/getUserUid']"
                  >
                    <br />
                    <!--{{ message.createdAt | timeAgo}} para tiempo revisar el filtro y aprende
                  a filtrar la fecha de creacion de la hora con Dayjs -->
                    <small>{{ message.userName }}</small>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
    <section class="send">
      <!--formulario para enviar mensaje unido al metodo de tipo, escuchando el submit-->
      <form @submit.prevent="createMessage" class="form">
        <div class="control">
          <!--text area para escribir mensaje, unido a data con el v-mode -->
          <textarea
            v-model="message"
            class="textarea form__textarea"
            placeholder="Escribe tu mensaje aqui..."
          ></textarea>
        </div>
        <!--se muestra el boton solo si tiene escrito algo disable es distinto de true-->
        <div class="control">
          <button
            :disabled="!message"
            type="submit"
            class="button is-info"
            :class="{ 'is-loading': isLoading }"
          >
            Enviar
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
//uso de mapstate de messages
import { mapState } from "vuex";

const Dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
Dayjs.extend(relativeTime);

export default {
  name: "ViewRoom",
  //para cuando se crea el componente se ejecuta el metodo created
  async created() {

    //con esto obtenemos el uid del usuario para saber cuando sale y entra de una sala en meta
    this.userUid = this.$store.getters["user/getUserUid"];

    try {
      //primero en room revisa si existe la sala de manera local
      //con el getter se revisa y se obtitne el id, de la sala presionada
      let room = await this.$store.getters["rooms/getRooms"](this.id);

      //enviamos los datos a la mutacion para actualizar los datos en meta
      this.$store.dispatch("user/updateMeta", {
        roomID: this.id,
        //false para quese ejecute arrayUnion
        exit: false,
        uid: this.userUid,
      });

      //si room es distinto de true, entonces se obtiene la sala en firebase
      if (!room) {
        //la misma variable, se usa para obtener la sala en firebase se pasa en espeficico la sala
        //que se necesita en rooms que es get room, por eso se pasa el id(este id, por que fue
        //el componente presionado)
        this.room = await this.$store.dispatch("rooms/getRoom", this.id);
        //si en firebase no existe landamos el throw error
        if (!room.exists) throw new Error("Could not find room");
        //si si se obitiene, pasamos la data de la room a la variable room
        room = room.data();
      }
      //los datos de la variable room(scoped local en la funcion) se le pasa a la varible room
      //de este componente,
      this.room = room;
      //despues de ya sabido que se tiene la sala, se obtienen los mensajes creados, si es que los hay

      //si no error y redirecciona a home
    } catch (error) {
      console.error(error.message);
      this.$router.push({ name: "home" });
    }
  },

  destroyed() {
    //cambiamos los datos de meta, al mandar el id de la sal para saber en cual sala salio, exit para que sea el
    //metodo arrayRemove y el uid 
    this.$store.dispatch("user/updateMeta", {
      roomID: this.id,
      exit: true,
      uid: this.userUid,
    });
  },
  props: {
    //la propiedad que se recibe es el id, este es de tipo string y que sea requerido con eso
    //este id es el mismo que tiene el ide de vue router para saber la sala presionada, por ende
    //es el mismo
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    //datos, mensaje(v-model) y isLoading(para el boton de enviar) y la sala para mostrar
    return {
      isLoading: false,
      message: "",
      room: null,
      userUid: "",
    };
  },
  methods: {
    //metodo para que, cuando se mande un mensaje la pantalla siempre se mantenga la inicio
    // y no sea necesario hacer scroll para verlos
    scrollDown() {
      //agregamos a la constante messages la referencia del elemento messages
      const messages = this.$refs.messages;
      //metodo de vue
      this.$nextTick(() => {
        //constante para tener el lugar de messages(que tiene la referencia) de manera vertical,
        //esto cada vez que cambie
        const height = messages.scrollHeight;
        //con el objeto window y scrollTo se le dice que siempre este en top con cda cambio
        //al estar siempre arriba, lo de abajo se muestra ya que todo sube y behavior para que el cambio
        //sea suave
        window.scrollTo({
          top: height,
          behavior: "smooth",
        });
      });
    },

    //metodo para crear mensajes
    async createMessage() {
      //se pone el boton en cargando
      this.isLoading = true;

      try {
        //lanzamos la mutacion para crear el mensaje, pasandole el id de la sala y el mensaje
        //esto lo tiene la variable meesage de este componente
        await this.$store.dispatch("messages/createMessage", {
          roomID: this.id,
          message: this.message,
        });
        //llamamos a la funcion para que se mueva el scroll
        this.scrollDown();
        //limpiamos el mensaje
        this.message = "";
      } catch (error) {
        //mostrar el error en consola
        console.error(error.message);
      } finally {
        //termina de cargar
        this.isLoading = false;
      }
    },
  },
  filters: {
    timeAgo(timestamp) {
      const date = new Date(timestamp);
      return Dayjs().from(Dayjs(date), true);
    },
  },

  //usamos el mapState para mostrar los mensajs que hayan en
  computed: {
    ...mapState("messages", ["messages"]),
    //retornamos los mensajes que corresponden a la sala de convesacion
    roomMessages() {
      return this.messages.filter(message => message.roomId === this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.messages {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding-bottom: 90px;
}
.message {
  padding: 1rem;
  width: 75%;
  &--own {
    background-color: #baffc5;
    width: 75%;
    align-self: flex-end;
  }
}
.send {
  background-color: gray;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > *:first-child {
    flex-grow: 1;
    margin-right: 1rem;
  }
}
.textarea.form__textarea {
  min-height: 4rem;
}
</style>