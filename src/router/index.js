import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
import Signup from '@/components/auth/Signup'
import Login from '@/components/auth/Login'
import ViewProfile from '@/components/profile/ViewProfile'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GMap',
      component: GMap,
      //ROUTEGUARD to ensure that only authenticated users can go to this page
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile/:id',
      name: 'ViewProfile',
      component: ViewProfile,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

//fire a function before each route is loaded in
router.beforeEach( ( to, from, next ) => {
  /*
    to: where we go
    from: where we're from
    next: the function is called next 
  */
  //check to see if route requires auth
  // how?
  // look where we're going to and match something
  if(to.matched.some( rec => rec.meta.requiresAuth) ){
    //check auth state of user
    let user = firebase.auth().currentUser
    if(user){
      //user is signed in, procede to route
      next()
    }else{
      //if user is not signed in, redirect to login
      next( {name: 'Login'} )
    }
  }else{
    next()
  }
} )

export default router