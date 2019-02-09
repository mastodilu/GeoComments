<template>
  <div class="signup container">
    <form class="card-panel" @submit.prevent=signup>
      <h2 class="center deep-purple-text">Signup</h2>
      <div class="field">
        <label for="email">Email:</label>
        <input type="email" name="email" v-model=email>
      </div>
      <div class="field">
        <label for="password">Password: </label>
        <input type="password" name="password" v-model=password>
      </div>
      <div class="field">
        <label for="alias">Alias:</label>
        <input type="text" name="alias" v-model=alias>
      </div>
      <div class="field center">
        <button class="btn deep-purple">Signup</button>
        <span class="feedback red-text">{{feedback}}</span>
      </div>
    </form>
  </div>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'//import firebase library

export default {
  name: 'Signup',
  data(){
    return {
      email: null,
      password: null,
      alias: null,
      feedback: "",
      slug: null
    }
  },
  methods:{
    signup(){
      this.feedback = null
      if(this.alias && this.email && this.password){
        this.slug = slugify(this.alias, {
          replacement: '-',
          remove: /[$*_+~.()'"!\-:@]/g,
          lower: true
        })
        
        if(this.slug != ''){

          //check if user id exists in db
          let ref = db.collection('users').doc(this.slug)
          ref.get().then(doc => {
            if(doc.exists){
              this.feedback = 'this alias already exists'
            }else{//create user in users db
              firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
              .then(cred => {
                ref.set({ //set properties to this record
                  alias: this.alias,
                  geolocation: null,
                  user_id: cred.user.uid
                })
              })
              .then(()=>{
                this.$router.push({name: 'GMap'})
              })
              .catch(error => {
                console.log(error)
                this.feedback = error.message
              })
            }
          })
          .catch(err => {
            console.log(err)
          })

        }else{
          this.feedback = 'you must enter a valid alias'
        }
      }else{
        this.feedback = "you must enter all fields"
      }
    }
  }
}

</script>

<style>
.signup{
  max-width: 400px;
  margin-top: 10%;
}

.signup h2{
  font-size: 2.4em;
}

.signup .field{
  margin-bottom: 1vh;
}

.signup .feedback{
  margin-top: 2vh;
  display: block;
}
</style>

