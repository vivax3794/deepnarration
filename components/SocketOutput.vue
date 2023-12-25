<template>
    <div style="position: relative;">
        <div ref="socket" style="margin-left: calc(100% + 5px);">
            <Socket :kind="kind" @click="clicked" />
        </div>
        <div style="position: absolute; top: -5px; left: 100%; white-space: nowrap; transform: translateX(-100%);">{{ name
        }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import { inject_key, type InputToOutput } from '~/lib/socket_click';

let props = defineProps<{
    kind: string,
    name?: string | undefined,
    calc: () => Promise<void>,
    value: any,
    dirty: boolean,
    working?: boolean | undefined,
}>();

let working: Promise<void> | null = null;

async function get_value(): Promise<any> {
    if (props.dirty || working !== null || props.working === true) {
        if (working === null) {
            working = props.calc();
        }
        await working;
        working = null;
    }
    return props.value;
}

const socket_clicked = inject(inject_key);
const socket: Ref<HTMLElement | null> = ref(null);

let make_inp_dirty: (() => void)[] = [];
let reset_other: (() => void)[] = [];
let kill_connection: (() => void)[] = [];
watch(() => props.dirty, () => {
    if (make_inp_dirty === null) return;
    if (props.dirty) make_inp_dirty.forEach((f) => f());
})

function update(data: InputToOutput, kill: () => void) {
    make_inp_dirty.push(data.make_dirty);
    reset_other.push(data.reset);
    kill_connection.push(kill)
}
function reset() {
    // TODO: clear out stuff?
}
function reset_full() {
    reset_other.forEach((f) => f())
    kill_connection.forEach((f) => f())

    reset_other = [];
    kill_connection = [];
}
onUnmounted(reset_full);

function clicked() {
    socket_clicked!({
        element: socket.value!,
        kind: props.kind,
        io: "output",
        update_value: update,
        data: {
            get_value,
            reset,
        }
    });
}
</script>
