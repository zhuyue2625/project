import Vue from 'vue'
import Router from 'vue-router'
import awesomepos from '@/components/page/awesomepos'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'awesomepos',
      component: awesomepos
    }
  ]
})
