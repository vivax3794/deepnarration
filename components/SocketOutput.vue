<template>
    <div v-if="name !== undefined" style="transform: translateY(15px)">{{ name }}</div>
    <div ref="socket" style="margin-left: calc(100% + 5px);">
        <Socket :kind="kind" @click="clicked" />
    </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import { inject_key, type InputToOutput } from '~/lib/socket_click';

let props = defineProps<{
    kind: string,
    name: string | undefined,
    calc: () => Promise<void>,
    value: string,
    dirty: boolean,
}>();

let working: Promise<void> | null = null;

async function get_value(): Promise<string> {
    if (props.dirty) {
        if (working === null) {
            working = props.calc();
        }
        console.log(working);
        await working;
        working = null;
    }
    return props.value;
}

const socket_clicked = inject(inject_key);
const socket: Ref<HTMLElement | null> = ref(null);

let make_inp_dirty: (() => void) | null = null;
watch(() => props.dirty, () => {
    console.log("DIRTY CHANGED", props.dirty);
    if (make_inp_dirty === null) return;
    if (props.dirty) make_inp_dirty();
})

function update(data: InputToOutput) {
    make_inp_dirty = data.make_dirty
}

function clicked() {
    socket_clicked!({
        element: socket.value!,
        kind: props.kind,
        io: "output",
        update_value: update,
        data: {
            get_value,
        }
    });
}
</script>
