import Vue from 'vue'
import Router from 'vue-router'
import RequestWatcher from '@/components/RequestWatcher'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'requestWatcher',
      component: RequestWatcher
    }
  ]
})
