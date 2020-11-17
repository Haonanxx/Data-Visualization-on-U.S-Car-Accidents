import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import VueChart from '../views/VueChart.vue'
import VuePlanets from "../views/VuePlanets";
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/vuechart',
    name: 'VueChart',
    component: VueChart
  },
  {
    path: '/vueplanets',
    name: 'VuePlanets',
    component: VuePlanets
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/d3chart',
    name: 'D3Chart',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/D3Chart.vue')
  },
  {
    path: '/d3planets',
    name: 'D3Planets',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/D3Planets.vue')
  },
  {
    path: '/smallmultiples',
    name: 'SmallMultiples',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/SmallMultiples.vue')
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
