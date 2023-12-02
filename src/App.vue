<template>
  <h1 class="heading">tapDash</h1>
  <Admin />
</template>

<script>
import Admin from "@/views/Admin.vue"

export default {
  name: 'App',
  components: {
    Admin
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 12px;
}

.heading {
  margin-bottom: 20px;
  text-align: left;
  margin-left: 26px;
}
</style>