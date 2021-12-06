<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <h3 class="subtitle is-size-4 is-marginless">
          {{ message }}
        </h3>
      </header>

      <section class="modal-card-body has-text-centered">
        <button v-if="!recorder" @click="record()" class="button is-info">
          Start recording
        </button>
        <button v-else @click="stop()" class="button is-danger">
          Stop recording
        </button>
        <div class="mt-5" v-if="audio">
          <h5 class="subtitle is-marginless mb-1">Review your recording</h5>
          <audio :src="newAudioURL" controls></audio>
        </div>
      </section>
      <footer class="modal-card-foot buttons is-right">
          <!--emitimos el evento confirm-->
        <button
          :disabled="!audio"
          @click="$emit('confirm', audio)"
          class="button"
          :class="actionClass"
        >
          Confirm
        </button>
        <button @click="$emit('cancel')" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "RecordModalComponent",
  //se recibe como propiedad el mensaje que se muestra y la actionClass
  props: {
    message: {
      type: String,
      required: true
    },
    actionClass: {
      type: String,
      default: "is-success"
    }
  },
  data() {
    return {
        //guarda el audio
      audio: null,
      //graba el audio
      recorder: null
    };
  },
  methods: {
      //funcion para grabar
    async record() {
      try {
          //comenzamos con el audio en nulo
        this.audio = null;
        //se comienza a grabar solo audio, video no usando apis del navegador
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });
        //metodos de javascript para agregar audio recordedChunks es nativo de javascript
        const options = { mimeType: "audio/webm" };
        const recordedChunks = [];
        //a recorder le agregamos la opcion y el stream(audio)
        this.recorder = new MediaRecorder(stream, options);
        //escuchamos el evento dataavailable en donde vmos agregado a una matriz el audio
        this.recorder.addEventListener("dataavailable", e => {
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }
        });
        //al dar stop se genera el blob que es el archivo de audio
        this.recorder.addEventListener("stop", () => {
            //eso lo agregamos a audio
          this.audio = new Blob(recordedChunks);
        });
        this.recorder.start();
      } catch (error) {
        this.$toast.error(error.message);
      }
    },
    //metodo para detener, recorder.stop que es un evento que oye recorder y lo pasamos anulo
    //por que se limpia
    stop() {
      this.recorder.stop();
      this.recorder = null;
    }
  },
  //devolvemos el audio per creando un objeto de tipo URL con this.audio
  computed: {
    newAudioURL() {
      return URL.createObjectURL(this.audio);
    }
  }
};
</script>

<style scoped>
.modal {
  display: block;
}
</style>