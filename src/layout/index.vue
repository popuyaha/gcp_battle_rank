<template>
  <div class="container mx-auto flex flex-col h-screen">
    <service-header class="flex-none"></service-header>
    <div class="content min-h-0 p-2 flex-1">
      <router-view />
    </div>
    <service-footer class="flex-none"></service-footer>
  </div>
</template>

<script>
import ServiceHeader from '@/components/Header.vue'
import ServiceFooter from '@/components/Footer.vue'

export default {
  name: 'Layout',
  components: {
    ServiceHeader,
    ServiceFooter
  }
}
</script>
