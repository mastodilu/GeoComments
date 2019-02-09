<template>
  <div class="view-profile container">
    <div v-if=profile class="card">
      <h2 class="deep-purple-text center">Profilo di {{profile.alias}}</h2>
      <!-- add comment form -->
      <form @submit.prevent="addComment">
        <div class="field">
          <label for="comment">Add a comment</label>
          <input type="text" name="comment" v-model=newComment>
          <p v-if=feedback class="red-text center"></p>
        </div>
      </form>
      <!-- comment list -->
      <div v-if="comments.length > 0">
        <ul id="commentsCollection" class="collection comments">
          <li v-for="(comment, index) in comments" :key=index>
            <span class="deep-purple-text"><b>{{comment.from}}</b></span>
            <span class="grey-text time">{{comment.timestamp}}</span>
            <span class="grey-text text-darken-2 paddingBlock">{{comment.content}}</span>
          </li>
        </ul>
      </div>
        
      
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import moment from 'moment'
export default {
  name: 'ViewProfile',
  data(){
    return{
      profile: null,
      newComment: null,
      tempComment: null,
      feedback: null,
      comments: [],
      user: null //current logged in user
    }
  },
  created(){
    let ref = db.collection('users')

    //get current user
    ref.where( 'user_id', '==', firebase.auth().currentUser.uid).get()
    .then( snapshot => {
      snapshot.forEach( doc => {
        this.user = doc.data()
        this.user.id = doc.id
      } )
    } )

    //profile data
    ref.doc(this.$route.params.id).get()
    .then( user => {
      this.profile = user.data()
    } )

    //show comments
    db.collection('comments').where('to', '==', this.$route.params.id)
    .onSnapshot( (snapshot) => { //listen for real time changes
      snapshot.docChanges().forEach( change => {
        if(change.type == 'added'){
          this.comments.unshift( {
            from: change.doc.data().from,
            content: change.doc.data().content,
            timestamp: moment(change.doc.data().timestamp).format('lll')
          } )
        }
      } )
    } )
  },
  methods:{
    addComment(){
      this.tempComment = this.newComment
      this.feedback = null
      if(this.newComment){  
        this.newComment = null
        db.collection('comments').add(
          {
            to: this.$route.params.id,
            from: this.user.alias,
            content: this.tempComment,
            time: Date.now()
          }
        ).then( () => {
          this.tempComment = null
        } )
      }else{
        this.feedback = "you must enter a comment to add it"
      }
    }
  }
}
</script>

<style>
.view-profile .card{
  margin-top: 20px;
  padding-top: 15px;
  padding-right: 15px;
  padding-left: 15px;
  padding-bottom: 1px;
}

.view-profile h2{
  margin-top: 0;
}

.view-profile #commentsCollection{
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 0px;
  padding-bottom: 0px;
}

.view-profile .time{
  font-size: 0.8em;
}
.view-profile .paddingBlock{
  display: block;
  margin-bottom: 5px;
  /* padding-bottom: 5px; */
}
</style>
