<template>
<!--este componente solo se muestra si dentro de setLoading es distinto de true
diciendo que termino de cargar-->
  <div v-if="!$store.state.isLoading">
      <!--este h1 se muestra solo si rooms es diferente de cero, quiere decir que no
      tiene ni un dato-->
    <h1 v-if="!rooms.length" class="subtitle has-text-centered mt-2">
      No hay sala de conversacion.
      <!--si no tiene muestra un link a create para crear una sala-->
      <router-link :to="{ name: 'create' }">Create one</router-link>.
    </h1>
    <!--si es else se muestran todas las salas-->
    <div v-else class="columns is-multiline">
      <!-- Room element  con for para que room sea lo que tiene rooms-->
      <div v-for="room in rooms" :key="room.id" class="column is-one-third">
        <div class="card">
          <div class="card-image">
            <figure class="image is-16by9">
              <img
                src="https://bulma.io/images/placeholders/1280x960.png"
                alt="Placeholder image"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                  <!--mostramos el nombre de la sala-->
                <p class="title is-4">{{ room.name }}</p>
                <!--mostramos el nombre del que creo la sala-->
                <p class="subtitle is-6"><b>Por </b> {{ room.CreateByName }}</p>
              </div>
            </div>
            <!--mostramos la descripcion-->
            <div class="content">
              {{ room.description }}
            </div>
          </div>
        </div>
      </div>
      <!-- End of room element -->
    </div>
  </div>
</template>

<script>
export default {
  name: "roomsComponent",
  //recibimos una propiedad enviada por el componente padre, roomsView de tipo array
  //ya que vienen varios datos, y es de manera requerida
  props: {
    rooms: {
      type: Array,
      required: true,
    },
  },
};
</script>