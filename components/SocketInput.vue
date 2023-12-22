<template>
    <div ref="socket" style="margin-left: -20px">
        <Socket :kind="kind" @click="clicked" @contextmenu="right_click" />
    </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import { inject_key, type OutputToInput } from '~/lib/socket_click';

let props = defineProps<{
    kind: string,
    modelValue: string,
    dirty: boolean,
}>();
let emit = defineEmits<{
    (e: "update:modelValue", value: string): void
    (e: "update:dirty", value: boolean): void
}>();

let get_value: (() => Promise<string>) | null = null;
let reset_other: (() => void) | null = null;

let kill_connection: (() => void) | null = null;

function update(info: OutputToInput, kill: (() => void)) {
    get_value = info.get_value;
    reset_other = info.reset;
    kill_connection = kill;
}
function reset() {
    console.log("CLEARING OUT INPUT SOCKET!");
    get_value = null;
}
function reset_full() {
    if (reset_other !== null) reset_other()
    if (kill_connection !== null) kill_connection()

    reset()

    reset_other = null
    kill_connection = null
}
onUnmounted(reset_full);

async function calc(): Promise<void> {
    if (get_value === null) return;
    emit("update:modelValue", await get_value());
}

const socket_clicked = inject(inject_key);
const socket: Ref<HTMLElement | null> = ref(null);

function make_dirty() {
    console.log("Marking input as dirty")
    emit("update:dirty", true);
}

function right_click(e: Event) {
    e.preventDefault()
    reset_full()
}

function clicked() {
    console.log(socket.value!);

    reset_full();
    emit("update:dirty", true);

    socket_clicked!({
        element: socket.value!,
        kind: props.kind,
        io: "input",
        update_value: update,
        data: {
            make_dirty,
            reset
        }
    });
}


defineExpose({
    calc,
})
</script>
