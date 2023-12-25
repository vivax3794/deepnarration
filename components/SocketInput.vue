<template>
    <div ref="socket" style="margin-left: -20px; position: relative;">
        <Socket :kind="kind" @click="clicked" @contextmenu="right_click" />
        <div style="position: absolute; top: -5px; left: 20px">
            {{ name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import { inject_key, type OutputToInput } from '~/lib/socket_click';

let props = defineProps<{
    kind: string,
    modelValue: any,
    dirty: boolean,
    name?: string | undefined,
    generic?: boolean | undefined,
}>();
let emit = defineEmits<{
    (e: "update:modelValue", value: any): void
    (e: "update:dirty", value: boolean): void
    (e: "update:kind", value: string): void
}>();

let get_value: (() => Promise<any>) | null = null;
let reset_other: (() => void) | null = null;

let kill_connection: (() => void) | null = null;

function update(info: OutputToInput, kill: (() => void)) {
    get_value = info.get_value;
    reset_other = info.reset;
    kill_connection = kill;
}
function reset() {
    get_value = null;
    if (props.generic) emit("update:kind", "generic")
    emit("update:modelValue", undefined);
}
function reset_full() {
    if (reset_other !== null) reset_other()
    if (kill_connection !== null) kill_connection()

    reset()

    reset_other = null
    kill_connection = null
}
onUnmounted(() => {
    if (reset_other !== null) reset_other()
    if (kill_connection !== null) kill_connection()
});

async function calc(): Promise<void> {
    if (get_value === null) return;
    emit("update:modelValue", await get_value());
}

const socket_clicked = inject(inject_key);
const socket: Ref<HTMLElement | null> = ref(null);

function make_dirty() {
    emit("update:dirty", true);
}

function right_click(e: Event) {
    e.preventDefault()
    reset_full()
    emit("update:dirty", true)
}

function update_kind(kind: string) {
    emit("update:kind", kind);
}

function clicked() {
    reset_full();
    emit("update:dirty", true);

    socket_clicked!({
        element: socket.value!,
        kind: props.generic ? "generic" : props.kind,
        io: "input",
        update_value: update,
        data: {
            make_dirty,
            reset
        },
        update_kind
    });
}


defineExpose({
    calc,
})
</script>
