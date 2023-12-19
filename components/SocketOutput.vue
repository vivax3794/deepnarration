<template>
    <div v-if="name !== undefined" style="transform: translateY(15px)">{{ name }}</div>
    <Socket style="margin-left: calc(100% + 5px);" io="output" :kind="kind" :get_value="get_value"
        :set_get_value="undefined" />
</template>

<script setup lang="ts">
let props = defineProps<{
    kind: string,
    name: string | undefined,
    calc: () => Promise<void>,
    value: string,
}>();

async function get_value(): Promise<string> {
    await props.calc();
    return props.value;
}
</script>
