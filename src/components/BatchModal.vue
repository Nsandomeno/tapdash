<template>
<VueFinalModal
      class="flex justify-center items-center"
      content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
    >
      <h1 class="text-xl">
        Add Batch: {{  name  }}
      </h1>
      <div v-if="loading">
        Broadcasting batch...
      </div>
      <div v-else>
                <label>Amount</label>
                <input
                    :value="amt"
                    @input="event => amt = event.target.value"
                >
            </div>
      <slot />

      <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('confirm')">
        Confirm
      </button>
</VueFinalModal>
</template>

<script>
import { getCurrentInstance, toRef } from "vue";
export default {
    
    props: {
        name: {  type: String, required: true },
        loading,
    },
    setup(props) {
        const instance = getCurrentInstance();
        const amt = toRef("");

        const confirm = (e) => {
            instance.parent.emit("amt", amt);
            console.log("confirm")
        }

        return {
            confirm,
            amt,
        }
    },
}
</script>