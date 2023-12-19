<template>
    <Socket style="margin-left: -20px" io="input" :kind="kind" :get_value="undefined" :set_get_value="set_get_value" />
</template>

<script setup lang="ts">
let props = defineProps<{
    kind: string,
    modelValue: string,
}>();
let emit = defineEmits<{
    (e: "update:modelValue", value: string): void
}>();

let get_value = null;

function set_get_value(callback: () => Promise<string>) {
    get_value = callback;
}

async function calc(): Promise<void> {
    emit("update:modelValue", await get_value());
}

defineExpose({
    calc
})
</script>
