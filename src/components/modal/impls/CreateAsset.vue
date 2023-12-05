<template>
<Modal
    :modalActive="modalActive"
    :valid="valid"
>
    <div class="modal-custom">
        <h1 class="modal-title">Create Asset</h1>

        <h5>Note: this will not immediately broadcast the assets.</h5>
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
                type="number"
                @input="event => initSupply = event.target.value"
            >
        </div>
        <div> 
            <select class="select-btn" v-model="enableEmissions">
                <option value="true">true</option>
                <option value="false">false</option>
            </select>
        </div>
    </div>
</Modal>
</template>

<script>
import Modal from "../Base.vue";
import { ref, watch, computed } from "vue"

export default {
    components: {
        Modal,
    },
    props: {
        modalActive: { type: Boolean, default: () => false },
        valid: { type: Boolean, default: () => false },
    },
    setup(props, { emit }) {
        // new asset form values 
        const initSupply = ref(0);
        const assetName = ref("");
        const enableEmissions = ref(false);

        const validateSupply = () => {
            return parseInt(initSupply.value) > 0;
        };

        const validateName = () => {
            return assetName.value.length >= 3;
        };

        const updateNewAsset = () => {
            emit("update-new-asset", newAssetData.value);
        };
        
        const isNewAssetReady = computed(() => {
            return validateName() && validateSupply();
        });

        const newAssetData = computed(() => {
            return {
                "name": assetName.value,
                "amount": parseInt(initSupply.value),
                "enable_emissions": enableEmissions.value,
                "form_valid": isNewAssetReady.value,
            }
        });

        watch(isNewAssetReady, (newVal, oldVal) => {
            if (newVal) {
                updateNewAsset();
            } else if (!newVal && oldVal) {
                updateNewAsset();
            }
        });

        return {
            initSupply,
            assetName,
            enableEmissions,
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
</style>