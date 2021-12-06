<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <section class="modal-card-body">
        <h3 class="subtitle has-text-centered is-size-4 is-marginless">
          {{ message }}
        </h3>
        <!--en src tenemos la imagen que es pasada como propiedad, y la clase sirve para mostrar
        los filtros-->
        <div class="photo">
          <img class="photo__image" :src="file" :class="activeFilter" />
        </div>
        <!--la clase filters sirve para que se seleccione el filte con respecto al nombre
        estos tambien son enviados como propiedad, que name sea igual a activeFilter
        tambien mostramos todas las imagenes con todos los filtros para tener una vista previa
        por eso con v-for mostramos todos los filtros a cada imagen-->
        <div class="filters">
          <div
            :class="{
              'filters__filter--selected': filter.name === activeFilter,
              [filter.name]: true
            }"
            class="filters__filter"
            v-for="(filter, $index) in filters"
            :key="$index"
          >
          <!--aca esta la imagen ue se le aplica el filter.name, evento click activeFilter-->
            <img
              @click="activeFilter = filter.name"
              class="filters__filter__image"
              :src="file"
            />
            <!--mostramos el nombre del filtro-->
            <h4 class="filters__filter__name">{{ filter.name }}</h4>
          </div>
        </div>
      </section>
      <!--si acepta emitimos el evento confirm a viewRoom.vue y le pasamos acticeFilter-->
      <footer class="modal-card-foot buttons is-right">
        <button
          @click="$emit('confirm', activeFilter)"
          class="button"
          :class="actionClass"
        >
          Confirm
        </button>
        <!--emitimos el evento cancel si no quiere aplicar filtros -->
        <button @click="$emit('cancel')" class="button">Cancel</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
    //obtenemso como props, la imagen(file)los filtros(filters), el mensaje, y la accion de la clase
  name: "FilterModalComponent",
  props: {
    file: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    filters: {
      type: Array,
      required: true
    },
    actionClass: {
      type: String,
      default: "is-info"
    }
  },
  //activeFilter empieza como normal
  data() {
    return {
      activeFilter: "normal"
    };
  }
};
</script>
<!--estilos-->
<style lang="scss" scoped>
.modal {
  display: block;
}
.photo {
  padding: 0.5rem;
  width: 100%;
  &__image {
    width: 100%;
    height: auto;
  }
}
.filters {
  padding: 0.5rem;
  overflow: scroll;
  display: flex;
  &__filter {
    position: relative;
    cursor: pointer;
    margin: 0.3rem;
    &--selected {
      border: 3px solid orange;
    }
    &__image {
      width: 20vmax;
      height: auto;
      max-width: 20vmax;
      display: block;
    }
    &__name {
      position: absolute;
      left: 0;
      bottom: 0;
      text-align: center;
      width: 100%;
      color: white;
      background-color: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
