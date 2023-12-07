<template>
    <Base
        :modalActive="modalActive"
        :valid="valid"
        :lockClose="lockClose"
    >
        <div class="modal-custom">
            <h1 class="modal-title">Add Tranch</h1>
            <h3 class="new-batch-asset">Asset: {{ name }}</h3>
            <div v-if="isLoading"> Loading... </div>
            <div v-else-if="isError"> Error occurred. Please try again.</div>

            <div v-else-if="displayForm">
            
                <h5>Note: this will not immediately broadcast the assets.</h5>

                <div class="input-field-sm">
                    <label class="input-label-sm">New Supply (Added Supply): </label>
                    <input
                        :value="newSupply"
                        @input="event => newSupply = event.target.value"
                    >
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
            lockClose  : { type: Boolean, default: () => false },
            name       : { type: String, required: true },
            modalActive: { type: Boolean, default: () => false },
            valid      : { type: Boolean, default: () => false },
            isLoading  : { type: Boolean, default: () => false },
            isError    : { type: Boolean, default: () => false },
            /**
             * @TODO add documentation for reqProcessed and resDetails
             *       based on CreateAsset.vue
             */
            reqProcessed : { type: Boolean, default: () => false },
            resDetails   : { type: Object, default: () => null },
        },
        setup(props, { emit }) {
            const newSupply = ref(0);
            const isOpen    = toRef(props, "modalActive");
            const reqStatus = toRef(props, "reqProcessed");
            const response  = toRef(props, "resDetails");

            const updateAddBatch = () => {
                emit("update-add-batch", newSupply.value);
            };

            const displayForm = computed(() => {
                return !reqStatus.value;
            })

            const displayResDetails = computed(() => {
                return reqStatus.value;
            });

            const fmtResponse = computed(() => {
                if (response.value) {
                    return {
                        "headline": response.value?.headline ? response.value.headline : "Something went wrong...",
                        "detail": response.value?.detail ? response.value.detail : "Your request may have succeeded despite this. Please contact support.",
                    }
                }
                return {
                    "headline": "Something went wrong...",
                    "detail": "Your request failed. Contact support to see what went wrong.",
                }
            });

            watch(newSupply, (newVal, oldVal) => {
                updateAddBatch();
            });

            watch(isOpen, (newVal, oldVal) => {
                // reset if oldVal was open and newVal is closed
                if (oldVal && !newVal) {
                    newSupply.value = 0;
                }
            });

            return {
                newSupply,
                displayForm,
                displayResDetails,
                fmtResponse,
            }
        },
    }
    </script>