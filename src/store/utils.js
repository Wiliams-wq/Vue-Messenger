//modulo que maneja utilidades

import Vue from 'vue'
const actions = {
    //recibimos props y component desde el componente updateRoom
    requestConfirmation(context, { props, component }) {
        //importamos el componente de manera dinamica, y pasamos como dinamos component
        //ya que el componente se carga dinamicamente
      const Component = () => import(`../components/${component}Component.vue`);

      //creamos una promesa esto para que se resuelva en el modal lanzado
      return new Promise((resolve, reject) => {
          //generamos una nueva instancia de vue con sus propiedades y metodos necesarios
          //para cargar un componente carcasa de forma dinámica y presentarle al usuario la opción
        const dialog = new Vue({

          methods: {
              //este metodo sirve para destruir esta instancia y removerla
            actionHandler(fn, arg) {
              return function() {
                  //el primer parametro es funcion y el segundo argumento
                fn(arg);
                //destruimos la instancia
                dialog.$destroy();
                //remover el elemento del DOM
                //($el Proporciona a la instancia de
                // Vue un elemento del DOM existente para montarse. Puede ser un selector 
                //CSS o un HTMLElement.)
                dialog.$el.remove();
              };
            }
          },
          /*
          Es una alternativa a las plantillas que le permiten aprovechar todo el poder
           programático de JavaScript. La función de renderización recibe un método 
           createElement como primer argumento utilizado para crear VNodes.
          */
          render(h) {
              //retornamos el componente que se renderizara en el modal
            return h(Component, {
                //retorna las props obtenidas desde el componente padre
              props,
              //metodos enviados por el padre que recibio del hijo
              on: {
                  //se ejecuta cuando el usuario confirma la acción y se resuelve la promesa
                  //devolvemos la data del metodo
                confirm: data => {
                    //enviamos datos a actionHandler
                  this.actionHandler(resolve, data)();
                },
                //si cancela, muestra un error en consola y se rechaza la promesa
                cancel: this.actionHandler(reject, new Error("Action cancelled"))
              }
            });
          }
          //sirve para montar el componente en el DOM
        }).$mount();
        //obtenmos el elemento del DOM App y le agregmos el dialog(instancia vue) y el, forma en 
        //se monta al DOM en app
        document.getElementById("app").appendChild(dialog.$el);
      });
    }
  };
export default {
//namespaced: true es para que separar los moduls vuex
    namespaced: true,
    actions
 
}