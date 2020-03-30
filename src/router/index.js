import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/layout'),
    meta: { title: 'Home', auth: false },
    redirect: 'Main',
    children: [
      {
        path: '',
        name: 'Main',
        component: () => import('@/views/Main.vue'),
        meta: { title: 'Main', auth: true }
      },
      {
        path: 'game-board/:id',
        name: 'GameBoard',
        component: () => import('@/views/GameBoard.vue'),
        meta: { title: 'GameBoard', auth: true },
        props: true,
        children: [
          // 적용방법 미숙.. 인식을 못함
          // {
          //   path: "writeGameBoard",
          //   name: "WriteGameBoard",
          //   component: () => import("@/views/WriteGameBoard.vue")
          // },
          // {
          //   path: "readGameBoard",
          //   name: "ReadGameBoard",
          //   component: () => import("@/views/ReadGameBoard.vue")
          // }
        ]
      },
      // 화면 테스트용으로 작성
      {
        path: 'game-board/:id/readGameBoard',
        name: 'ReadGameBoard',
        component: () => import('@/views/ReadGameBoard.vue'),
        meta: { title: 'ReadGameBoard', auth: true },
        props: true
      },
      {
        path: 'game-board/:id/writeGameBoard',
        name: 'WriteGameBoard',
        component: () => import('@/views/WriteGameBoard.vue'),
        meta: { title: 'WriteGameBoard', auth: true },
        props: true
      },
      {
        path: 'game-board/:id/pointRequest',
        name: 'PointRequest',
        component: () => import('@/views/PointRequest.vue'),
        meta: { title: 'PointRequest', auth: true },
        props: true
      },
      {
        path: 'game-board/:id/pointRequestList',
        name: 'PointRequestL',
        component: () => import('@/views/PointRequestList.vue'),
        meta: { title: 'PointRequestL', auth: true },
        props: true
      },
      {
        path: 'game-board/:id/readRankBoard',
        name: 'ReadRankBoard',
        component: () => import('@/views/ReadRankBoard.vue'),
        meta: { title: 'ReadRankBoard', auth: true },
        props: true
      }
    ]
  },
  {
    path: '/signIn',
    name: 'SignIn',
    component: () => import('@/views/auth/SignIn.vue'),
    meta: { title: 'SignIn', auth: false }
  },
  {
    path: '/signOut',
    name: 'SignOut',
    component: () => import('@/views/auth/SignOut.vue'),
    meta: { title: 'SignOut', auth: false }
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: () => import('@/views/auth/SignUp.vue'),
    meta: { title: 'SignUp', auth: false }
  },
  { path: '*', component: () => import('@/views/NotFound.vue') }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // 페이지의 라우터 제목을 사용해 페이지의 이름을 지정
  if (to.meta && to.meta.title) {
    document.title = to.meta.title
  }

  // 메타 & 인증 속성 확인
  if (to.meta && to.meta.auth !== undefined) {
    // 페이지에 인증이 필요할 떄
    if (to.meta.auth) {
      // 인증 여부 확인
      if (store.getters['auth/isAuthenticated']) {
        next() // 진행
        return
      }
      // 인증 미확인
      router.push({ name: 'SignIn' })
      return
    }
    // 이미 인증이 되어있다면
    if (store.getters['auth/isAuthenticated']) {
      // Home으로 이동
      router.push({ name: 'Home' })
      return
    }
    next() // 진행
    return
  }
  next() // 진행
  return
})

export default router
