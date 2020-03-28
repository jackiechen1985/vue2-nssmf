<template>
  <div>
    <header-top></header-top>
    <router-view></router-view>
    <footer-bottom></footer-bottom>
  </div>
</template>

<script>
// @ is an alias to /src
import headerTop from '@/components/header.vue'
import footerBottom from '@/components/footer.vue'
import N from '@/data/notification.js'

export default {
  components: {
    headerTop,
    footerBottom
  },
  data () {
    return {}
  },
  created () {
    N.startSSE()
  },
  destroyed () {
    N.stopSSE()
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
</style>
