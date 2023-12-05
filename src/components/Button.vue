<template>
    <button
        @click="buttonClick"
        :disabled="!enabled"
        :class="enabled ? 'enabled' : 'disabled'"
    >
        {{ text }}
    </button>
</template>

<script>
export default {
    props: {
        text: { type: String, default: () => "Primary Button" },
        enabled: { type: Boolean, default: () => true },
    },
    setup(_, { emit }) {
        
        const buttonClick = (e) => {
            emit("btn-click");
        };

        return {
            buttonClick,
        }
    },
}
</script>
<style scoped>
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
