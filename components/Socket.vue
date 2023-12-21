<template>
    <div id="socket"> </div>
</template>

<script setup lang="ts">
import { SOCKET_NUMBER } from "~/lib/colors";
import { computed } from 'vue';

let props = defineProps<{
    kind: string,
}>();

let color = computed(() => {
    switch (props.kind) {
        case "number": return SOCKET_NUMBER
        default: return "red"
    }
});

</script>

<style scoped>
#socket {
    width: 15px;
    height: 15px;
    background-color: v-bind(color);
}
</style>
