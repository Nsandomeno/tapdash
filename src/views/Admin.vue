<template>
<div class="container">
    <div v-if="showData" class="success">
        <AddBatch
            @close="toggleNewBatch"
            @confirm="handleNewBatchConfirm"
            @update-add-batch="event => newBatchAddedSupply = event"
            
            :name="newBatchAssetName"
            :modalActive="newBatchModal"
            :valid="newBatchSupplyValid && !updateInProgress"
            :isLoading="updateInProgress"
            :lockClose="updateInProgress"
            :isError="reqError"
            :reqProcessed="hasNewBatchResponse"
            :resDetails="newBatchModalUpdate"
        />

        <div class="container-left">
            <h1>Available Balance: {{ balance }}</h1>
        </div>

        <div class="container-middle">
            <h1>Create Asset</h1>
            <CreateAsset
                @close="toggleNewAsset"
                @confirm="handleNewAssetConfirm"
                @update-new-asset="handleNewAssetData"

                :modalActive="newAssetModal"
                :valid="newAssetValid && !updateInProgress"
                :lockClose="updateInProgress"
                :isLoading="updateInProgress"
                :isError="reqError"   
                :reqProcessed="hasNewAssetResponse"
                :resDetails="newAssetModalUpdate"         
            />
            <Button @btn-click="toggleNewAsset" :text="'Create Asset'" />
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
import Button from "@/components/Button.vue";
export default { 
    components: {
        Table,
        AddBatch,
        Button,
        CreateAsset,
    },
    setup() {
        const client = new Api();
        // states
        const error     = ref(false);
        const reqError  = ref(false);
        const errorMsg  = ref("");
        const isLoading = ref(true);

        const updateInProgress = ref(false);
        const updateMsg        = ref("");
        // prereq. data
        const assets  = ref([]);
        const balance = ref(null);
        // new asset
        const newAssetModal = ref(false);
        const newAssetData  = reactive({
            name              : "",
            amount            : null,
            enable_emissions  : false,
            form_valid        : false,
        });
        const newAssetResponse = reactive({
            success : null,
            name    : null,
            amount  : null,
            txid    : null,
        });
        // add group / add supply to existing asset
        const newBatchModal       = ref(false);
        const newBatchAssetName   = ref("");
        const newBatchAddedSupply = ref(0);
        const newBatchResponse    = reactive({
            success : null,
            name    : null,
            amount  : null,
            txid    : null,
        });

        const showData = computed(() => {
            return !error.value && !isLoading.value;
        });

        const noData = computed(() => {
            return showData.value && assets.value.length < 1;
        });

        const showError = computed(() => {
            return error.value && !isLoading.value;
        });

        const hasNewAssetResponse = computed(() => {
            return newAssetResponse.success !== null;
        });

        const newAssetModalUpdate = computed(() => {
            // req and failure
            if (reqError.value) {
                return {
                    "headline": "Mint asset failed.",
                    "detail": "Contact support to find out more."
                }
            // req and success
            } else if (hasNewAssetResponse.value) {
                return {
                    "headline": `Minted ${newAssetResponse.name}!`,
                    "detail"  : `Initial supply: ${newAssetResponse.amount}.`
                }
            } else {
                // no request attempted yet
                return null;
            }
        });

        const hasNewBatchResponse = computed(() => {
            return newBatchResponse.success !== null;
        });

        const newBatchModalUpdate = computed(() => {
            // req and failure
            if (reqError.value) {
                return {
                    "headline": "New batch mint failed.",
                    "detail": "Contact support to find out more."
                }
            // req and success
            } else if (hasNewBatchResponse.value) {
                return {
                    "headline": `Minted new batch of ${newBatchResponse.name}`,
                    "detail": `New supply: ${newBatchResponse.amount}`
                }
            } else {
                // no request attempt
                null;
            }
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

        const reload = async () => {
            isLoading.value = true;

            await Promise.all([getWalletBalance(), getAssets()])
                .finally(() => {
                    clearNewBatchState();
                    clearNewAssetState();
                    isLoading.value = false;
                });
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
            let useError = true;

            updateInProgress.value = true;
            updateMsg.value = "Adding pending batch of new asset."
            
            const data = {
                "name": newAssetData.name,
                "amount": newAssetData.amount,
                "enable_emissions": newAssetData.enable_emissions
            }

            const res = await client.quickMintAsset(data);

            if (res) {

                if (res?.success) {
                    // TODO works for single asset mints/broadcasts
                    // only.
                    useError = false;
                    newAssetResponse.success = res.success;

                    let asset = res.data[0];

                    newAssetResponse.name = asset.name;
                    newAssetResponse.amount = asset.amount;
                    newAssetResponse.txid = asset.txid;
                }
            }

            if (useError) {
                errorMsg.value = "Failed to mint new asset.";
                reqError.value  = true;
            }

            updateMsg.value = "";
            updateInProgress.value = false;
        };

        const mintNewBatch = async () => {
            /**
             * @mintNewBatch
             */
            let useError = true;

            updateInProgress.value = true;
            updateMsg.value = "Adding pending batch of asset."

            const res = await client.quickMintNewGroup(
                newBatchAssetName.value, 
                newBatchAddedSupply.value
            );
            if (res) {
                console.log("confirm pending batch for existing asset: ", newBatchAssetName.value, "response: ", res);
                if (res?.success) {
                    // TODO works for single asset mints only.
                    useError = false;
                    newBatchResponse.success = res.success;

                    let asset = res.data[0];

                    newBatchResponse.name = asset.name;
                    newBatchResponse.txid = asset.txid;
                    newBatchResponse.amount = asset.amount;
                }
            }
            // handle error
            if (useError) {
                errorMsg.value = "";
                reqError.value = true;
            }
            updateMsg.value = "";
            updateInProgress.value = false;
        };

        const handleNewAssetData = (e) => {
            newAssetData.name = e.name;
            newAssetData.amount = e.amount;
            newAssetData.enable_emissions = e.enable_emissions;
            newAssetData.form_valid = e.form_valid;
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
             * 
             * @sanityCheckMode ON - maybe weird reactivity issue.
             */
            let formValid = newAssetData?.form_valid;
            if (formValid) {
                return true;

            } else if (formValid === false) {
                return false;
            }

            return false;
        });

        const openNewBatchModal = (e) => {
            /**
             * @mintNewBatch
             */
            console.log("Opening new batch modal: ", e);
            newBatchAssetName.value = e;
            newBatchModal.value = true;
        }

        const openNewAssetModal = (e) => {
            /**
             * @mintNewAsset
             */
            newAssetModal.value = true;
        };

        const toggleNewBatch = async () => {
            /**
             * @mintNewBatch
             */
            if (hasNewBatchResponse.value) {
                // close clicked after request
                // trigger refresh
                newBatchModal.value = false;
                await reload();
            } else {
                newBatchModal.value = !newBatchModal.value;
            }
        };

        const clearNewBatchState = () => {
            /**
             * @mintNewBatch
             */
            newBatchAddedSupply.value = 0;
            newBatchAssetName.value   = "";

            newBatchResponse.success = null;
            newBatchResponse.name    = null;
            newBatchResponse.amount  = null;

            updateMsg.value = "";
            reqError.value  = false;
        };

        const clearNewAssetState = () => {
            /**
             * @mintNewAsset
             */
            newAssetData.amount = null;
            newAssetData.name = "";
            newAssetData.enable_emissions = false;
            newAssetData.form_valid = false;

            newAssetResponse.success = null;
            newAssetResponse.amount = null;
            newAssetResponse.name = null;
            newAssetResponse.txid = null;

            updateMsg.value = "";
            reqError.value = false;
        };

        const toggleNewAsset = async () => {
            /**
             * @mintNewAsset
             */
            if (hasNewAssetResponse.value) {
                // close clicked after request
                // trigger refresh and reload
                newAssetModal.value = false;
                await reload();
            } else {
                newAssetModal.value = !newAssetModal.value;
            }
        };

        const handleNewAssetConfirm = async () => {
            /**
             * @mintNewAsset
             */
            if (hasNewAssetResponse.value) {
                // confirm clicked after request
                // trigger refresh and reload
                newAssetModal.value = false;
                await reload();
            } else {
                // mintAsset
                await mintNewAsset();
            }
        }

        const handleNewBatchConfirm = async () => {
            /**
             * @mintNewBatch
             */
            if (hasNewBatchResponse.value) {
                // confirm clicked after request
                // trigger refresh and reload
                newBatchModal.value = false;
                await reload();
            } else {
                // mintNewBatch
                await mintNewBatch();
            }
        };

        return {
            // request handling
            hasNewAssetResponse,
            hasNewBatchResponse,
            // state details
            error,
            reqError,
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
            newBatchModalUpdate,
            newAssetModalUpdate,
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
            handleNewAssetConfirm,
            handleNewBatchConfirm,
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
</style>
