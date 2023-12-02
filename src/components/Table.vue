<template>
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
                v-for="(row, i) in data" 
                :key="i" 
                :row="row" 
                :assets="assets" 
                :isUpdating="updateInProgress"
            />
        </tbody>
    </table>
    </template>
    <script>
    import { toRef } from "vue";
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
        setup(props) {
            // const reactData = toRef(props, "data");
            // const reactAssets = toRef(props, "assets");
            // const updateInProgress = toRef(props, "isUpdating");
    
            // return {
            //     reactData,
            //     reactAssets,
            //     updateInProgress,
            // }
        }
    }
    </script>