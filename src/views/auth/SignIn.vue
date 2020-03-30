<template>
  <section class="bg-grey-lighter h-screen w-screen">
    <div class="container mx-auto h-full flex justify-center items-center">
      <div class="w-1/3">
        <el-card
          ><h2>로그인하기</h2>
          <el-form
            class="border-teal p-8 border-t-4 bg-white mb-6 rounded-lg shadow-lg"
            :model="model"
            :rules="rules"
            ref="form"
            @submit.native.prevent="signIn"
            ><el-form-item prop="email">
              <el-input
                v-model="model.email"
                placeholder="이메일"
                prefix-icon="fas fa-user"
              ></el-input>
            </el-form-item>
            <el-form-item prop="pass">
              <el-input
                v-model="model.pass"
                placeholder="비밀번호"
                type="password"
                prefix-icon="fas fa-lock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                class="login-button"
                type="primary"
                native-type="submit"
                block
                >로그인</el-button
              >
              <el-button
                :loading="loading"
                class="login-button"
                type="primary"
                block
                @click="signUp"
                >회원가입</el-button
              >
            </el-form-item></el-form
          >
          <el-form
            class=""
            :model="model"
            :rules="rules"
            ref="form"
            @submit.native.prevent="googleSignIn"
          >
            <el-form-item>
              <el-button
                :loading="loading"
                type="primary"
                native-type="submit"
                block
                >구글 계정으로 로그인</el-button
              >
            </el-form-item>
          </el-form>
        </el-card>

        <v-alert />
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import router from '@/router'
import store from '@/store'

import Alert from '@/components/auth/Alert.vue'

Vue.component('v-alert', Alert)

export default {
  name: 'signIn',
  data() {
    return {
      validCredentials: {
        email: 'lightscope',
        pass: 'lightscope'
      },
      model: {
        email: '',
        pass: ''
      },
      loading: false,
      rules: {
        email: [
          {
            required: true,
            message: '이메일은 필수 입니다.',
            trigger: 'blur'
          },
          {
            min: 4,
            message: '이메일 길이는 적어도 4글자 이상입니다.',
            trigger: 'blur'
          }
        ],
        pass: [
          {
            required: true,
            message: '비밀번호를 입력해 주세요',
            trigger: 'blur'
          },
          {
            min: 5,
            message: '비밀번호 길이는 적어도 5글자 이상입니다.',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['hasAuthenticationStatus'])
  },
  methods: {
    async signIn() {
      console.log('로그인버튼')
      await store.dispatch('auth/SignIn', {
        email: this.model.email,
        password: this.model.pass
      })

      if (!this.hasAuthenticationStatus) {
        router.push('/')
      }
    },
    async googleSignIn() {
      await store.dispatch('auth/GoogleSignIn', {
        email: this.model.email,
        password: this.model.pass
      })

      if (!this.hasAuthenticationStatus) {
        router.push('/')
      }
    },
    signUp() {
      router.push('signUp')
    }
  }
}
</script>
