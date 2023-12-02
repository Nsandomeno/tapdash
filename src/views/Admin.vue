<template>
<div class="container">
    <div v-if="showData" class="success">

        <Modal
            @close="toggle"
            @confirm="mintNewBatch"
            :modalActive="openModal"
            :valid="isBatchSupplyValid"
        >
            <div class="modal-custom">
                <h1 class="modal-title">Add Tranch</h1>
                <h3 class="new-batch-asset">Asset: {{ newBatch }}</h3>
                <h5>Note: this will not immediately broadcast the assets.</h5>
                <div class="input-field-sm">
                    <label class="input-label-sm">New Supply (Added Supply): </label>
                    <input
                        :value="addAmt"
                        @input="event => addAmt = event.target.value"
                    >
                </div>
            </div>
        </Modal>
        <div class="container-left">
            <h1>Available Balance: {{  balance }}</h1>
        </div>
        <div class="container-middle">
            <h1>Mint</h1>
            <div class="input-field">
                <label>Asset Name: </label>
                <input
                    :value="newName"
                    @input="event => newName = event.target.value"
                >
            </div>
            <div class="input-field">
                <label class="input-label">Initial Supply: </label>
                <input
                    :value="newAmount"
                    @input="event => newAmount = event.target.value"
                >
            </div>
            <div class="select-field">
                <select class="select-btn" v-model="enableEmissions">
                <option value="true">true</option>
                <option value="false">false</option>
            </select>
            </div>
                <button :disabled="!enableMint" :class="enableMint ? 'enabled' : 'disabled'">Mint New Asset</button>
        </div>
        <div class="container-right">
            <h1>Issued Assets</h1>
            <Table
                :data="assets"
                :assets="assets"
                :isUpdating="isLoading"
                @init-modal="popModal"
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

import { ref, onBeforeMount, computed } from "vue";
import { Api } from "@/api.js";
import Table from "@/components/Table.vue";
import Modal from "@/components/Modal.vue";

export default { 
    components: {
        Table,
        Modal,
    },
    setup() {
        const client = new Api();
        // form
        const newName = ref("");
        const newAmount = ref("");
        const enableEmissions = ref(null);

        const openModal = ref(false);

        const error = ref(false);
        const errorMsg = ref("");
        const isLoading = ref(true);

        const assets = ref([]);
        const balance = ref(null);
        // TODO implement modal and addBatch
        const updateInProgress = ref(false);
        const updateMsg = ref("");
        // the asset name
        const newBatch = ref("");
        // new supply addition
        const addAmt = ref("");
        // add batch successful?
        const addBatchSucceeded = ref(false);

        const showData = computed(() => {
            return !error.value && !isLoading.value;
        });

        const noData = computed(() => {
            return showData.value && assets.value.length < 1;
        });

        const enableMint = computed(() => {
            return newName.value.length > 0 && newAmount.value.length > 0 && enableEmissions.value;
        })

        const getWalletBalance = async () => {
            const res = await client.walletBalance();
            if (res) {
                //console.log(res)
                balance.value = res.confirmedBalance; 
            } else {
                error.value = true;
                errorMsg.value = "Failed to get balance."
            }
        };

        const getAssets = async () => {
            const res = await client.listAssets();
            if (res) {
                console.log(res)
                assets.value = res;
            } else {
                error.value = true;
                errorMsg.value = "Failed to get balance."                
            }
        };

        const mintNewBatch = async () => {
            updateInProgress.value = true;
            updateMsg.value = "Adding pending batch of asset."

            const res = await client.mintNewGroup(newBatch.value, addAmt.value);
            if (res) {
                console.log("confirm batch res: ", res);
                // TODO handle mint new batch existing asset

                //addBatchSucceeded.value = true;
            }
        }
        
        const showError = computed(() => {
            return error.value && !isLoading.value;
        });

        const isBatchSupplyValid = computed(() => {
            /**
             * @TODO validate value set by setAmt
             */
            return addAmt.value.length > 0;
        });

        const setAmt = (e) => {
            /**
             * @TODO clean how supply for a new group
             * of an existing asset is validated.
             */
            addAmt.value = e;
        }


        const popModal = (e) => {
            /**
             * @initModal Event
             * opens modal
             */
            newBatch.value = e;
            openModal.value = true;

            console.log("TODO addBatch and modal UI")
        }

        const toggle = () => {
            openModal.value = !openModal.value;
        };

        onBeforeMount(async () => {
            await Promise.all([getWalletBalance(), getAssets()])
                .finally(() => {
                    isLoading.value = false;
                })
        });

        return {
            error,
            errorMsg,
            isLoading,
            showError,
            showData,
            noData,
            assets,
            balance,
            openModal,
            popModal,
            newName,
            newAmount,
            enableMint,
            enableEmissions,
            updateInProgress,
            newBatch,
            setAmt,
            toggle,
            addAmt,
            mintNewBatch,
            isBatchSupplyValid,
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
.form {
    height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}
.select-field {
    margin-bottom: 60px;
    margin-top: 10px;
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
.modal-custom {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
}
.modal-title {
    margin-bottom: 4px;
}
.input-field {
    display: flex;
    width: 256px;
    margin-bottom: 12px;
    justify-content: space-between;
}
.input-field-sm {
    margin-bottom: 4px;
}
.select-field {
    width: 256px;
}
.select-btn {
    width: 100%;
}
</style>
