<template>
    <div id="socket"> </div>
</template>

<script setup lang="ts">
import { SOCKET_NUMBER, SOCKET_STRING, kind_to_color } from "~/lib/colors";
import { computed } from 'vue';

let props = defineProps<{
    kind: string,
}>();

let color = computed(() => kind_to_color(props.kind));
</script>

<style scoped>
#socket {
    width: 15px;
    height: 15px;
    background-color: v-bind(color);
}
</style>
