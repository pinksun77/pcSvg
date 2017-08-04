import Vue from 'vue'
import Router from 'vue-router'
import LearnerG from '@/components/LearnerG'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'learnerG',
      component: LearnerG
    }
  ]
})
