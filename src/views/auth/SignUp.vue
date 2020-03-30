<template>
  <section class="bg-grey-lighter ">
    <div class="container mx-auto h-full flex justify-center items-center">
      <div class="w-1/3">
        <el-card>
          <div class="p-2">
            <h2>회원 가입</h2>
          </div>
          <el-form
            class="border-teal p-8 border-t-4 bg-white mb-6 rounded-lg shadow-lg"
            @submit.native.prevent="signUp"
          >
            <el-form-item label="사용자 명" label-for="usernameInput">
              <el-input
                id="usernameInput"
                type="text"
                v-model="username"
                required
                placeholder="사용자 명"
              />
            </el-form-item>
            <!-- <b-form-group label="이름" label-for="nameInput">
              <b-form-input
                id="nameInput"
                type="text"
                v-model="name"
                required
                placeholder="이름을 적어주세요"
              />
            </b-form-group>-->
            <el-form-item label="Email" label-for="emailInput">
              <el-input
                id="emailInput"
                type="email"
                v-model="email"
                required
                placeholder="Email을 적어주세요"
              />
            </el-form-item>
            <el-form-item label="비밀번호" label-for="passwordInput">
              <el-input
                id="passwordInput"
                type="password"
                v-model="pass"
                required
                placeholder="비밀번호를 입력해 주세요"
              />
            </el-form-item>
            <el-button native-type="submit" variant="primary">가입</el-button>
          </el-form>
        </el-card>
      </div>
    </div>

    <v-alert />
  </section>
</template>

<script>
import Vue from 'vue'
import router from '@/router'
import { mapGetters } from 'vuex'
import Alert from '@/components/auth/Alert.vue'

// import Amplify from "@aws-amplify/core";

// const Logger = Amplify.Logger;

Vue.component('v-alert', Alert)

// const logger = new Logger("SignUpPage");

export default {
  data() {
    return {
      username: '',
      email: '',
      name: '',
      pass: ''
    }
  },
  mounted() {
    // 인증상태 초기화
    this.$store.dispatch('auth/ClearAuthenticationStatus')
  },
  computed: {
    ...mapGetters('auth', ['hasAuthenticationStatus'])
  },
  methods: {
    async signUp() {
      // logger.debug("sign-up");
      await this.$store.dispatch('auth/SignUp', {
        username: this.username,
        password: this.pass,
        attributes: {
          name: this.name,
          email: this.email
        }
      })

      if (!this.hasAuthenticationStatus) {
        // router.push("confirmSignUp");
        router.push('signIn')
      }
    }
  }
}
</script>
