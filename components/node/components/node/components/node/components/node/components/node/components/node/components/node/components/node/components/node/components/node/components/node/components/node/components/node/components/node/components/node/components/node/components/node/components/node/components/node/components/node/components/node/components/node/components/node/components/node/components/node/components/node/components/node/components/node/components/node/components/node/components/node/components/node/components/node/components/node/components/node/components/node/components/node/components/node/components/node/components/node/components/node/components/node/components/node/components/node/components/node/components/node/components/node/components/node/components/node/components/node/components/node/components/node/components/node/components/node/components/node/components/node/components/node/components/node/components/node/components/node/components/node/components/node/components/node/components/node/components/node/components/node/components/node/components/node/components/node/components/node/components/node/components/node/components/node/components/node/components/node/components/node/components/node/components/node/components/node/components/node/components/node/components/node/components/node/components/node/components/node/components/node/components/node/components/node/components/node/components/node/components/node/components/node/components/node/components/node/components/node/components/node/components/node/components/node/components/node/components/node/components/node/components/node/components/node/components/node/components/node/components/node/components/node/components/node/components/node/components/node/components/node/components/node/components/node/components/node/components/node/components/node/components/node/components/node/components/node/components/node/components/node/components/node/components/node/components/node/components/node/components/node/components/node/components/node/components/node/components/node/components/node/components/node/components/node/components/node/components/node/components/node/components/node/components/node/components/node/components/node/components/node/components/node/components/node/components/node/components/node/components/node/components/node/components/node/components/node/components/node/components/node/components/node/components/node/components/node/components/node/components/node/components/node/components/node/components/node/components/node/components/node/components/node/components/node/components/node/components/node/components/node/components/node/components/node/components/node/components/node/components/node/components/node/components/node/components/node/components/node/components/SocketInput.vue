<template>
    <Socket style="margin-left: -20px" io="input" :kind="kind" />
</template>

<script setup lang="ts">
defineProps<{
    kind: string,
}>();
</script>
