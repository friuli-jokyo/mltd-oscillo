import { createRouter, createWebHashHistory } from 'vue-router'
import GraphView from './GraphView.vue'
import Preferences from './Preferences.vue'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Preferences',
            component: Preferences
        },
        {
            path: '/graphview',
            name: 'GraphView',
            component: GraphView
        },
    ]
})

export default router