<template>

    <tr>
        
        <td @click="goToAssetHistory" scope="row">{{ row.name }}</td>
        <td class="mid-col">{{ row.supply }}</td>
        <td>
                <Button
                    @btn-click="initAddBatchModal"
                    :enabled="enableAdd"
                    :text="'Add Tranche'"
                />

        </td>
        <td>
                <Button
                    @btn-click="console.log('TODO implement!')"
                    :enabled="false"
                    :text="'Connect Price Oracle'"
                />

        </td>
        <td>
                <Button
                    @btn-click="console.log('TODO implement!')"
                    :enabled="false"
                    :text="'Distribute'"
                />

        </td>
    </tr>

</template>
<script>
import Button from "./Button.vue";
import { useRouter } from "vue-router";
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
        const router = useRouter();
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

        const initAddBatchModal = () => {
            /**
             * @event
             * 
             */
            instance.parent.emit("init-modal", selectedAsset.value)
        };

        const goToAssetHistory = () => {
            router.push({ name: "asset", params: { id: data.value.name }})
        };

        onBeforeMount(() => {
            selectedAsset.value = data.value.name;
        });

        return {
            initAddBatchModal,
            enableAdd,
            updateInProgress,
            goToAssetHistory,
        }
    },
}
</script>
<style scoped>
    td {
        border-bottom: 1px grey solid;
    }
</style>
