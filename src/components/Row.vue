<template>
    <tr>
        <th scope="row">{{ row.name }}</th>
        <td>{{ row.supply }}</td>
        <td>
                <Button
                    @btn-click="initModal"
                    :enabled="enableAdd"
                    :text="'Add Tranche'"
                />

        </td>
    </tr>
</template>
<script>
import Button from "./Button.vue";
import { ref, toRef, computed, onBeforeMount, getCurrentInstance } from "vue";
export default {
    components: {
        Button,
    },
    props: {
        row: {  type: Object, required: true },
        assets: { type: Array, required: true },
        isUpdating: { type: Boolean, default: () => false },
    },
    setup(props) {
        const instance = getCurrentInstance();
        const data = toRef(props, "row");
        /**
         * @note updateInProgress is an unused controller for handling the
         * state where at least one update is in progress.
         */
        const updateInProgress = toRef(props, "isUpdating");

        const selectedAsset = ref("");

        const enableAdd = computed(() => {
            /**
             * @TODO if the asset already has a pending batch it should be disabled
             */
            return true;
        });

        const initModal = () => {
            /**
             * @event
             * 
             */
            instance.parent.emit("init-modal", selectedAsset.value)
        };

        onBeforeMount(() => {
            selectedAsset.value = data.value.name;
        });

        return {
            initModal,
            enableAdd,
            updateInProgress,
        }
    },
}
</script>
<style scoped>
.container-row {
    width: 100%;
    height: 100%;
}
.disabled {
    background: grey;
    color: black;
    padding: 4px;
    border-radius: 4px;
}
.enabled {
    background: green;
    color: black;
    padding: 4px;
    border-radius: 4px;
}
</style>
