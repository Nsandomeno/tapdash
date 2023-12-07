<template>
  <div class="nav-container">
    <div class="left-half"> 
      <h1 class="heading">tapDash</h1>
    </div>
    <div class="right-half"> 
      <div class="link-container" :class="activeRoute === '/' ? 'active' : ''">
        <router-link class="link" to="/">Home</router-link>
      </div>
      <div class="link-container" :class="activeRoute === '/universe' ? 'active' : ''">
        <router-link class="link" to="/universe">Manage Universe</router-link>
      </div>
    </div>
  </div>
</template>
<script>
import Button from "./Button.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  components: {
    Button,
  },
  setup() {
    const route = useRoute();

    const activeRoute = computed(() => {
      return route.path;
    });

    return {
      activeRoute,
    }
  },
}
</script>
<style scoped>
.active {
  background-color: rgba(0, 255, 0, 0.1);;
}
.nav-container {
  width: 100%;

  display: flex;
  justify-content: space-evenly;
  align-content: baseline;
}
.left-half {
  width: 50%;
}
.right-half {
  width: 50%;
  display: flex;
  justify-content: space-evenly;

  display: flex;
  align-items: baseline;

  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  border-radius: 5px;
  background-color: white;

}
.heading {
  margin-bottom: 20px;
  text-align: left;
  margin-left: 26px;
}
.link-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.link {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>