<template>
  <el-alert
    :show="hasAuthenticationStatus"
    :variant="authenticationStatus.variant"
    >{{ authenticationStatus.message }}.</el-alert
  >
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  mounted() {
    // clear existing status message
    this.$store.dispatch('auth/ClearAuthenticationStatus')
  },
  // watch: {
  //   value: function(newVal) {
  //     this.rankUserList.filter(data => {
  //       if (data.name === newVal) {
  //         this.rankPoint = data.point
  //         this.rankUserKey = data.sort
  //       }
  //     })
  //   }
  // },
  computed: {
    ...mapGetters('auth', ['authenticationStatus', 'hasAuthenticationStatus'])
  }
}
</script>
