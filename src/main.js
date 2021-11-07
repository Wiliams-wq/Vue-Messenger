import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

Vue.config.productionTip = false

const requireComponent = require.context(
  './components',
  false,
//en base, es una palabra clave para buscar, por eso el nombre del componente
//global es BaseForm, si se elimina todos los componentes quedarian como globales
//se puede editar al gusto, poniendo una palabra clave para los componentes globales
//y colocarla en lugar de Base
  /Base[A-Z]\w+\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(
      fileName
      .replace(/^\.\/_/, '')
      .replace(/\.\w+$/, '')
      .split('-')
      .map((kebab) => kebab.charAt(0).toUpperCase() + kebab.slice(1))
     
      .join('')
    )
  )


  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
}),

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
