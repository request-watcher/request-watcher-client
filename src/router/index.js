import Vue from 'vue'
import Router from 'vue-router'
import RequestWatcher from '@/components/RequestWatcher'
import HistoryViewer from '@/components/HistoryViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'requestWatcher',
      component: RequestWatcher
    },
    {
      path: '/historyViewer',
      name: 'historyViewer',
      component: HistoryViewer
    }
  ]
})
