<template>
    <div id="socket" @click="clicked" ref="socket"> </div>
</template>

<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue';
import { inject_key } from '~/lib/socket_click';

let props = defineProps<{
    kind: string,
    io: "input" | "output",
    get_value: (() => Promise<string>) | undefined,
    set_get_value: ((callback: () => Promise<string>) => void) | undefined,
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
        io: props.io,
        get_value: props.get_value,
        set_get_value: props.set_get_value

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
