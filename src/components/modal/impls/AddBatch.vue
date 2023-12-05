<template>
    <Modal
        :modalActive="modalActive"
        :valid="valid"
    >
        <div class="modal-custom">
            <h1 class="modal-title">Add Tranch</h1>
            <h3 class="new-batch-asset">Asset: {{ name }}</h3>

            <h5>Note: this will not immediately broadcast the assets.</h5>

            <div class="input-field-sm">
                <label class="input-label-sm">New Supply (Added Supply): </label>
                <input
                    :value="newSupply"
                    @input="event => newSupply = event.target.value"
                >
            </div>
        </div>
    </Modal>
    </template>
    
    <script>
    import Modal from "../Base.vue";
    import { ref, watch } from "vue"
    export default {
        components: {
            Modal,
        },
        props: {
            name       : { type: String, required: true },
            modalActive: { type: Boolean, default: () => false },
            valid      : { type: Boolean, default: () => false },
        },
        setup(props, { emit }) {
            const newSupply = ref(0);

            const updateAddBatch = () => {
                emit("update-add-batch", newSupply.value);
            };

            watch(newSupply, (newInput, oldInput) => {
                updateAddBatch();
            });

            return {
                newSupply,
            }
        },
    }
    </script>