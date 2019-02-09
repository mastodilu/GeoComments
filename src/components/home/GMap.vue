<template>
  <div class="map">
    <div class="google-map" id="map"></div>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
  name: 'GMap',
  data(){
    return{
      lat: 43,
      lng: 12
    }
  },
  methods:{
    renderMap(){
      const map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: this.lat, lng: this.lng },
        zoom: 6,
        maxZoom: 15,
        minZoom:3,
        streetViewControl: false
      })

      db.collection('users').get()
      .then( users => {
        users.docs.forEach( doc => {
          let data = doc.data() //get data stored inside each document
          if(data.geolocation){
            //create marker
            let marker = new google.maps.Marker( {
              position: {
                lat: data.geolocation.lat, 
                lng: data.geolocation.lng
              },
              map: map// or just map
            } )
            //add click to marker
            marker.addListener( 'click', () => {
              //fire this function when clicked
              this.$router.push( { name: 'ViewProfile', params:{ id: doc.id } } )
            } )
          }
        } )
      } )
    }
  },
  mounted(){
    //get current user
    let user = firebase.auth().currentUser

    //get user geolocation
    //check if api exists in the browser
    if(navigator.geolocation){
      //find user geolocation
        navigator.geolocation.getCurrentPosition( pos => {
          this.lat = parseFloat(pos.coords.latitude)
          this.lng = parseFloat(pos.coords.longitude)
          //find user record and update geo coords
          db.collection('users').where('user_id', '==', user.uid).get()
          .then( snapshot => {
            snapshot.forEach( (doc) => {
              db.collection('users').doc(doc.id).update( { //update document in users db
                geolocation: { lat: pos.coords.latitude, lng: pos.coords.longitude}
              } )
            } )
          } )
          .then( () => {
            this.renderMap()
          } )
          this.renderMap()
        }, error => {
          console.log(error.message)
          this.renderMap()
        }, {maximumAge: 60000, timeout: 3000})
    }else{
      //position center by default value
      this.renderMap()
    }
  }
}
</script>

<style>
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

</style>
