<template>
    <div v-if="name !== undefined" style="transform: translateY(15px)">{{ name }}</div>
    <Socket style="margin-left: calc(100% + 5px);" io="output" :kind="kind" />
</template>

<script setup lang="ts">
defineProps<{
    kind: string,
    name: string | undefined,
}>();
</script>
