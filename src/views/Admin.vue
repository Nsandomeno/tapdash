<template>
<div class="container">
    <div v-if="showData" class="success">
        <AddBatch
            @close="toggleNewBatch"
            @confirm="mintNewBatch"
            @update-add-batch="event => newBatchAddedSupply = event"
            
            :name="newBatchAssetName"
            :modalActive="newBatchModal"
            :valid="newBatchSupplyValid"
        />

        <div class="container-left">
            <h1>Available Balance: {{ balance }}</h1>
        </div>

        <div class="container-middle">
            <h1>Create Asset</h1>
            <CreateAsset
                @close="toggleNewAsset"
                @confirm="mintNewAsset"
                @update-new-asset="handleNewAssetData"
                :modalActive="newAssetModal"
                :valid="newAssetValid"
            />
            <button @click="toggleNewAsset" class="enabled">
                Create Asset
            </button>
        </div>

        <div class="container-right">
            <h1>Manage Assets</h1>
            <Table
                :data="assets"
                :assets="assets"
                :isUpdating="isLoading"
                @init-modal="openNewBatchModal"
            />
        </div>
    </div>
    <div v-else-if="showError" class="error">
        {{  errorMsg }}
    </div>
    <div v-else-if="isLoading" class="loading">
        Loading please wait.
    </div>
    <div v-else class="failsafe">
        <h1>No data. Please try again or contact support.</h1>
    </div>
</div>
</template>
<script>

import { ref, onBeforeMount, computed, reactive } from "vue";
import { Api } from "@/api.js";
import Table from "@/components/Table.vue";
import CreateAsset from "@/components/modal/impls/CreateAsset.vue";
import AddBatch from "@/components/modal/impls/AddBatch.vue";

export default { 
    components: {
        Table,
        AddBatch,
        CreateAsset,
    },
    setup() {
        const client = new Api();
        // states
        const error = ref(false);
        const errorMsg = ref("");
        const isLoading = ref(true);
        const addBatchSucceeded = ref(false);
        const updateInProgress = ref(false);
        const updateMsg = ref("");
        // prereq. data
        const assets = ref([]);
        const balance = ref(null);
        // new asset
        const newAssetModal = ref(false);
        const newAssetData = reactive({
            name: "",
            amount: null,
            enable_emissions: false,
            form_valid: false,
        });
        // add group / add supply to existing asset
        const newBatchModal = ref(false);
        const newBatchAssetName = ref("");
        const newBatchAddedSupply = ref(0);

        const showData = computed(() => {
            return !error.value && !isLoading.value;
        });

        const noData = computed(() => {
            return showData.value && assets.value.length < 1;
        });

        const showError = computed(() => {
            return error.value && !isLoading.value;
        });

        const getWalletBalance = async () => {
            /**
             * @initialLoad
             */
            const res = await client.walletBalance();
            if (res) {
                balance.value = res.confirmedBalance; 
            } else {
                error.value = true;
                errorMsg.value = "Failed to get balance."
            }
        };

        const getAssets = async () => {
            /**
             * @initialLoad
             */
            const res = await client.listAssets();
            if (res) {
                assets.value = res;
            } else {
                error.value = true;
                errorMsg.value = "Failed to get balance."                
            }
        };

        onBeforeMount(async () => {
            await Promise.all([getWalletBalance(), getAssets()])
                .finally(() => {
                    isLoading.value = false;
                })
        });

        const mintNewAsset = async () => {
            /**
             * @mintNewAsset
             */
            updateInProgress.value = true;
            updateMsg.value = "Adding pending batch of new asset."

            const data = {
                "name": newAssetData.value.name,
                "amount": newAssetData.value.amount,
                "enable_emissions": newAssetData.value.enable_emissions
            }
            const res = await client.mintAsset(data);
            if (res) {
                console.log("confirm pending batch for new asset: ", newName.value, "response: ", res);
                // TODO
                // happy path
            } else {
                // TODO
                // error handling
            }
        };

        const mintNewBatch = async () => {
            /**
             * @mintNewBatch
             */
            updateInProgress.value = true;
            updateMsg.value = "Adding pending batch of asset."

            const res = await client.mintNewGroup(
                newBatchAssetName.value, 
                newBatchAddedSupply.value
            );
            if (res) {
                console.log("confirm pending batch for existing asset: ", newBatchAssetName.value, "response: ", res);
                // TODO 
                // handle mint new batch existing asset
                
                //addBatchSucceeded.value = true;
            } else {
                // TODO
                //error handling
            }
        };

        const finalizeBatches = async () => {
            /**
             * @general
             * @TODO handle the finalize on the backend or frontend?
             */
            updateInProgress.value = true;
            updateMsg.value = "Broadcasting pending batches.";

            const res = await client.finalizeBatches();
            if (res) {
                console.log("finalizing batches response: ", res);
                // TODO
                // happy path
            } else {
                // TODO
                // error handling
            }
        };

        const handleNewAssetData = (e) => {
            newAssetData.value = e;
        };

        const newBatchSupplyValid = computed(() => {
            /**
             * @mintNewBatch
             */
            return newBatchAddedSupply.value > 0;
        });

        const newAssetValid = computed(() => {
            /**
             * @mintNewAsset
             */
            return newAssetData.value?.form_valid;

        });

        const openNewBatchModal = (e) => {
            /**
             * @mintNewBatch
             */
            newBatchAssetName.value = e;
            newBatchModal.value = true;
        }

        const openNewAssetModal = (e) => {
            /**
             * @mintNewAsset
             */
            newAssetModal.value = true;
        };

        const toggleNewBatch = () => {
            /**
             * @mintNewBatch
             */
            newBatchModal.value = !newBatchModal.value;
        };

        const toggleNewAsset = () => {
            /**
             * @mintNewAsset
             */
            newAssetModal.value = !newAssetModal.value;
        };

        return {
            // state details
            error,
            errorMsg,
            isLoading,
            showError,
            showData,
            noData,
            assets,
            balance,
            // modals
            newBatchModal,
            newAssetModal,
            openNewBatchModal,
            handleNewAssetData,
            newAssetValid,
            updateInProgress,
            newBatchAssetName,
            toggleNewBatch,
            toggleNewAsset,
            newBatchAddedSupply,
            mintNewBatch,
            mintNewAsset,
            newBatchSupplyValid,

        }
    }
}
</script>

<style scoped>
.container {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
}
.container-left {
    display: flex;
    width: 33%;
    flex-direction: column;
    justify-content: flex-start;
}
.container-middle {
    display: flex;
    width: 33%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}
.container-right {
    display: flex;
    width: 33%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
}
.success {
    display: flex;
    width: 100%;
}
/* TODO duplicated many places */
.disabled {
    background: grey;
    color: black;
    padding: 4px;
    border-radius: 4px;
}
/* TODO duplicated many places */
.enabled {
    background: green;
    color: black;
    padding: 4px;
    border-radius: 4px;
}
</style>
