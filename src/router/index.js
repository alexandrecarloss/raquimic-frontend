import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import PerguntasView from '../views/PerguntasView.vue'
import EditarPerguntaView from '../views/EditarPerguntaView.vue'
import MoleculaFormView from '../views/MoleculaFormView.vue'
import MoleculasView from '../views/MoleculasView.vue'
import QuizFormView from '../views/QuizFormView.vue'
import QuizzesView from '../views/QuizzesView.vue'

const routes = [
  { path: "/login", 
    meta: { public: true, name: 'login' }, 
    component: LoginView 
  },

  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },

  {
    path: '/perguntas',
    name: 'perguntas',
    component: PerguntasView,
    meta: { requiresAuth: true }
  },

  {
    path: '/perguntas/nova',
    name: 'pergunta-nova',
    component: EditarPerguntaView,
    meta: { requiresAuth: true }
  },

  {
    path: '/perguntas/:id/editar',
    name: 'pergunta-editar',
    component: EditarPerguntaView,
    props: true,
    meta: { requiresAuth: true }
  },

  {
    path: "/moleculas",
    name: "Moleculas",
    component: MoleculasView,
    meta: { requiresAuth: true }
  },
  {
    path: "/moleculas/nova",
    name: "NovaMolecula",
    component: MoleculaFormView,
    meta: { requiresAuth: true }
  },
  {
    path: "/moleculas/:id/editar",
    name: "EditarMolecula",
    component: MoleculaFormView,
    props: true,
    meta: { requiresAuth: true }
  },

  {
    path: "/quizzes",
    name: "Quizzes",
    component: QuizzesView,
    meta: { requiresAuth: true }
  },

  {
    path: "/quizzes/nova",
    name: "NovoQuiz",
    component: QuizFormView,
    meta: { requiresAuth: true }
  },

  {
    path: "/quizzes/:id/editar",
    name: "EditarQuiz",
    component: QuizFormView, 
    props: true,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    return next('/login')
  }

  next()
})

export default router
