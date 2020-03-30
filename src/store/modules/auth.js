import firebase from '@/firebase'

// state 초기화
const state = {
  user: null,
  isAuthenticated: false,
  authenticationStatus: null,
  isAdmin: false
}

const getters = {
  authenticatedUser: state => state.user,
  isAuthenticated: state => state.isAuthenticated,
  authenticationStatus: state => {
    return state.authenticationStatus
      ? state.authenticationStatus
      : { variant: 'secondary' }
  },
  hasAuthenticationStatus: state => {
    return !!state.authenticationStatus
  },
  isAdmin: state => state.isAdmin
}

const mutations = {
  SET_AUTHENTICATION_ERROR(state, err) {
    state.authenticationStatus = {
      state: 'failed',
      message: err.message,
      variant: 'danger'
    }
  },
  CLEAR_AUTHENTICATION_STATUS(state) {
    state.authenticationStatus = null
  },
  SET_USER_AUTHENTICATED(state, user) {
    state.user = user
    state.isAuthenticated = true
  },
  SET_USER_ADMIN(state) {
    state.isAdmin = true
  },
  CLEAR_AUTHENTICATION(state) {
    state.user = null
    state.userId = null
    state.isAuthenticated = false
  }
}

const actions = {
  ClearAuthenticationStatus: context => {
    context.commit('CLEAR_AUTHENTICATION_STATUS', null)
  },
  SetUserAdmin: context => {
    context.commit('SET_USER_ADMIN')
  },
  async SignIn(context, params) {
    context.commit('auth/CLEAR_AUTHENTICATION_STATUS', null, { root: true })
    try {
      const user = await firebase
        .auth()
        .signInWithEmailAndPassword(params.email, params.password)
      if (user.user.emailVerified) {
        context.commit('SET_USER_AUTHENTICATED', user)
      } else {
        const err = { message: '이메일 승인 안됨' }
        context.commit('auth/SET_AUTHENTICATION_ERROR', err, { root: true })
      }
    } catch (err) {
      context.commit('auth/SET_AUTHENTICATION_ERROR', err, { root: true })
    }
  },
  async SignOut(context) {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // 로그아웃 성공
      })
      .catch(function(error) {
        // 에러 발생 시
        this.$alert('error =', error).then(() => {
          return
        })
      })
    context.commit('auth/CLEAR_AUTHENTICATION', null, { root: true })
  },
  async SignUp(context, params) {
    context.commit('auth/CLEAR_AUTHENTICATION_STATUS', null, { root: true })
    var user = null
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          params.attributes.email,
          params.password
        )
        .then(function() {
          user = firebase.auth().currentUser
          user.sendEmailVerification()
        })
        .then(function() {
          user.updateProfile({
            displayName: params.username
          })
        })
        .catch(err => {
          context.commit('auth/SET_AUTHENTICATION_ERROR', err, { root: true })
          this.$alert('error =', err).then(() => {
            return
          })
        })
      context.commit('auth/CLEAR_AUTHENTICATION', null, { root: true })
    } catch (err) {
      context.commit('auth/SET_AUTHENTICATION_ERROR', err, { root: true })
    }
  },
  async GoogleSignIn(context) {
    context.commit('auth/CLEAR_AUTHENTICATION_STATUS', null, { root: true })
    try {
      var provider = new firebase.auth.GoogleAuthProvider()
      const user = await firebase.auth().signInWithPopup(provider)
      if (user.user.emailVerified) {
        context.commit('SET_USER_AUTHENTICATED', user)
      }
    } catch (err) {
      context.commit('auth/SET_AUTHENTICATION_ERROR', err, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  strict: false
}
