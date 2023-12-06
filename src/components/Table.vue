<template>
    <div class="table-container">
        <table class="table table-bordered">
            <thead class="thead-dark">
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Supply</th>
                <th scope="col">Actions</th>
                </tr>
            </thead>

            <tbody>
                <Row
                    class="tbl-row" 
                    v-for="(row, i) in data" 
                    :key="i" 
                    :row="row" 
                    :assets="assets" 
                    :isUpdating="updateInProgress"
                />
            </tbody>
        </table>
    </div>
</template>
<script>

import Row from "./Row.vue";
    
export default {
    emits: ["init-modal"],
    components: {
        Row,
    },
    props: {
        data: { type: Array, required: true },
        assets: { type: Array, required: true },
        isUpdating: { type: Boolean, default: () => false },
    },
    setup() {}
}
</script>
<style scoped>
    .table-container {
        width: 100%;
        height: 200px;
        overflow-y: auto;
    }
    th {
        border-bottom: 2px solid black;
    }
    .tbl-row {
        border-bottom: 2px solid black;
    }
    .table {
        width: 100%;
    }
</style>
