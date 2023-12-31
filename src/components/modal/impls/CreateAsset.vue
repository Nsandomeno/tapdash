<template>
<Base
    :modalActive="modalActive"
    :valid="valid"
    :lockClose="lockClose"
>
    <div class="modal-custom">
        <h1 class="modal-title">Create Asset</h1>
        <div v-if="isLoading">
            Loading... 
        </div>

        <div v-else-if="isError">
            Error occurred. Please try again.
        </div>

        <div v-else-if="displayForm"> 
            <h5 class="warning">NOTE: THIS ASSET WILL BE BROADCAST IMMEDIATELY.</h5>
            <div class="input-field-sm"> 
                <label class="input-label-sm">Asset Name: </label>
                <input
                    :value="assetName"
                    @input="event => assetName = event.target.value"
                >
            </div>
            <div class="input-field-sm">
                <label class="input-label-sm">Initial Supply: </label>
                <input
                    :value="initSupply"
                    @input="event => initSupply = event.target.value"
                >
            </div>
            <div>
                <label class="input-label-sm">Enable Emissions: </label>
                <select class="select-btn" v-model="enableEmissions">
                    <option value="true">true</option>
                    <option value="false">false</option>
                </select>
            </div>
        </div>
        <div v-else-if="displayResDetails"> 
            <h3>{{ fmtResponse.headline }}</h3>
            <span></span>
            <h5>{{ fmtResponse.detail }}</h5>
        </div>
    </div>
</Base>
</template>

<script>
import Base from "../index.vue"
import { ref, watch, computed, toRef } from "vue"

export default {
    components: {
        Base,
    },
    props: {
        lockClose   : { type: Boolean, default: () => false },
        modalActive : { type: Boolean, default: () => false },
        valid       : { type: Boolean, default: () => false },
        isLoading   : { type: Boolean, default: () => false },
        isError     : { type: Boolean, default: () => false },
        /**
         * @reqProcessed
         * @case2 false       : start point... Or, a request was attempted, and failed
         * @case3 true        : a request was attempted, and succeeded... response
         *                      details prop should be populated.
         */
        reqProcessed  : { type: Boolean, default: () => false }, 
        /**
         * @resDetails
         * @case1 null/default : no request has been attempted
         * @case2 {message: '', detail: ''} : a request failed, use isError for confirmation
         * @case3 {message: '', detail: ''} : a request succeeded, use reqProcessed for confirmation.
         * 
         */ 
        resDetails  : { type: Object, default : () => null },
    },
    setup(props, { emit }) {
        // new asset form values 
        const initSupply = ref(0);
        const assetName = ref("");
        const enableEmissions = ref(false);
        // make props reactive
        //const errorState  = toRef(props, "isError");
        //const loadingState = toRef(props, "isLoading");
        const isOpen = toRef(props, "modalActive");
        const reqStatus   = toRef(props, "reqProcessed");
        const response  = toRef(props, "resDetails");

        const validateSupply = () => {
            return initSupply.value > 0;
        };

        const validateName = () => {
            return assetName.value.length >= 3;
        };

        const updateNewAsset = () => {
            console.log("updating supply ", initSupply.value)
            emit("update-new-asset", newAssetData.value);
        };
        
        const isNewAssetReady = computed(() => {
            return validateName() && validateSupply();
        });

        const displayForm = computed(() => {
            return !reqStatus.value;
        });

        const displayResDetails = computed(() => {
            return reqStatus.value;
        });

        const fmtResponse = computed(() => {
            if (response.value) {
                return {
                    "headline": response.value?.headline ? response.value.headline : "Something went wrong...",
                    "detail": response.value?.detail ? response.value.detail : "Your request may have succeeded, despite this. Please contact support."
                }
            }
            return {
                "headline":  "Something went wrong...",
                "detail": "Your request failed. Contact support to see what went wrong.",
            }
        });

        const newAssetData = computed(() => {
            return {
                "name": assetName.value,
                "amount": initSupply.value,
                "enable_emissions": enableEmissions.value,
                "form_valid": isNewAssetReady.value,
            }
        });

        const reset = () => {
            // clear
            initSupply.value = 0;
            assetName.value  = "";
            enableEmissions.value = false;
        };
        // TODO requires more validation
        // TODO requires more updates after 
        //      initially validated state i.e. last zero on init supply
        watch(isNewAssetReady, (newVal, oldVal) => {
            if (newVal) {
                // reached validated state for the first time
                updateNewAsset();
            } else if (!newVal && oldVal) {
                // input receeded from valid to invalid state
                updateNewAsset();
            }
        });

        watch(isOpen, (newVal, oldVal) => {
            // reset if oldVal was open and newVal is closed
            if (oldVal && !newVal) {
                reset();
            }
        });

        return {
            initSupply,
            assetName,
            displayForm,
            fmtResponse,
            enableEmissions,
            displayResDetails,
        }
    },
}
</script>
<style scoped>
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
.warning {
    color: red;
}
</style>
