<template>
    <div class="container">
        <div v-if="assetStats.success" class="success"> 
            <div class="container-middle card"> 
                <h1> 
                    Asset: {{ assetName }}
                </h1>
                <h4>
                    Total Supply: {{ assetStats.data.total_supply }}
                </h4>

                <h4>Total Proofs: {{ assetStats.data.total_proofs }}</h4>
                <h4>Genesis Point: {{ assetStats.data.genesis_point }}</h4>
                <h4>Group Key: {{ assetStats.data.group_key }}</h4>
                
            </div>
        </div>
        <div v-else-if="isError" class="error"> 
            An error occurred. Please contact support.
        </div>
        <div v-else-if="isLoading" class="loading"> 
            Loading please wait...
        </div>
        <!-- <div v-else class="failsafe">
            <h1>No data. Please try again or contact support.</h1>
        </div> -->
    </div>
</template>
<script>
import { Api } from "@/api.js";
import { useRoute } from 'vue-router';
import { watch, ref, reactive } from 'vue';
export default {
    setup() {
        const client = new Api();
        // TODO store route param in localStorage
        // TODO remove route param from localStorage on page leave (maybe better in router).
        const route = useRoute();
        const assetName = ref(null);
        const assetStats = reactive({
            success: null,
            data: null,
            name: null,
        });
        const isLoading = ref(true);
        const isError = ref(false);
        const errorMsg = ref("");
        // const isError = computed(() => {
        //     // TODO what is a better way for this?
        //     return assetStats.success !== null &&
        //         !assetStats.success;
        // });

        const queryAssetStats = async () => {
            // TODO improve handling of this and
            // all component api calls
            const res = await client.assetStats(assetName.value);
            if (res) {
                assetStats.success = res.success;
                assetStats.data = res.data;
                assetStats.name = res.name;
            } else {
                isError.value = true;
                errorMsg.value = "Failed to query asset stats."
            }
            // NOTE stops loading itself
            isLoading.value = false;
        };

       watch(route.params.id, async (newId) => {
        // TODO continue with the page hydration and localStorage management.
        console.log("Receiving asset name prop and loading page!", route.name, route.params)
        assetName.value = route.params.id;
        await queryAssetStats();
       }, { immediate: true });

       return {
        assetStats,
        assetName,
        isLoading,
        isError,
       }
    },
}
</script>
<style scoped>

.container-middle {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    margin: 8px;
}
.card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    border-radius: 5px;
    background-color: rgba(0, 255, 0, 0.1);
}
.success {
    display: flex;
    width: 100%;
}
</style>
