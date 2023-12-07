<template>
    <div class="container">
        <div class="success"> 
            Coming Soon!
        </div>
        <div class="error"> 

        </div>
        <div class="loading"> 

        </div>
        <!-- <div v-else class="failsafe">
            <h1>No data. Please try again or contact support.</h1>
        </div> -->
    </div>
</template>
<script>
import { useRoute } from 'vue-router';
import { watch, ref } from 'vue';
export default {
    setup() {
        // TODO store route param in localStorage
        // TODO remove route param from localStorage on page leave (maybe better in router).
        const route = useRoute();
        const assetName = ref(null);

       watch(route.params.id, (newId) => {
        // TODO continue with the page hydration and localStorage management.
        console.log("Receiving asset name prop and loading page!", route.name, route.params)
       }, { immediate: true });
    },
}
</script>
<style scoped>

</style>
