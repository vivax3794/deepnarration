<template>
    <div id="socket" @click="clicked" ref="socket"> </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue';
import { inject_key } from '~/lib/socket_click';

let props = defineProps<{
    kind: string,
    io: "input" | "output"
}>();

let color = computed(() => {
    switch (props.kind) {
        case "number": return "orange"
        case "display": return "blue"
        default: return "red"
    }
});

const socket_clicked = inject(inject_key);
const socket: Ref<HTMLElement | null> = ref(null);

function clicked() {
    socket_clicked!({
        element: socket.value!,
        kind: props.kind,
        io: props.io
    });
}
</script>

<style scoped>
#socket {
    width: 15px;
    height: 15px;
    background-color: v-bind(color);
}
</style>
