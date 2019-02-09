// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

let app = null

//wait for firebase auth to init before creating the app
firebase.auth().onAuthStateChanged( () => {

  //init app if not already created
  if(!app){
    app = new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})

/* eslint-disable no-new */


/*
  APPUNTI

  nell'applicazione stiamo usando firebase.auth() per autenticare un utente.
  Quando ricarichiamo la pagina viene ricaricata l'intera applicazione e l'utente deve risultare ancora loggato.
  L'utente risulta loggato dopo quel secondo circa che firebase impiega per re inizializzarsi.
  Allora, con il metodo
      firebase.auth().onAuthStateChanged( () => {
          // app here
      }
  stiamo dicendo di caricare l'applicazione solo dopo che firebase è stato re inizializzato

  Ovviamente serve una variabile locale
      let app = null
  per mantenere lo stato memorizzato


*/