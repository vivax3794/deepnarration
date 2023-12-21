<template>
    <div ref="socket" style="margin-left: -20px">
        <Socket :kind="kind" @click="clicked" />
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

function update(info: OutputToInput) {
    get_value = info.get_value;
}

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

function clicked() {
    console.log(socket.value!);
    socket_clicked!({
        element: socket.value!,
        kind: props.kind,
        io: "input",
        update_value: update,
        data: {
            make_dirty
        }
    });
}

defineExpose({
    calc,
})
</script>
