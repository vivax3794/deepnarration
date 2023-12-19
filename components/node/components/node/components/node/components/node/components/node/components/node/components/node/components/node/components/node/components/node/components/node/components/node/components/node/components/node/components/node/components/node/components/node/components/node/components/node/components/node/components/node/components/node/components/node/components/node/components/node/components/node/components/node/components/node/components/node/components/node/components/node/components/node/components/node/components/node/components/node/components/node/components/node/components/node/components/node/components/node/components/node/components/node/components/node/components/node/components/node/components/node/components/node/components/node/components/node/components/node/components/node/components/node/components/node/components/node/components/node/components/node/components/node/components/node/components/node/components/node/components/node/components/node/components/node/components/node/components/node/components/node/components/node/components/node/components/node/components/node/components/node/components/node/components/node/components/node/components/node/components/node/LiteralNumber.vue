<template>
    <NodeBase title="Number" color="teal-darken-4">
        <SocketOutput kind="number" />
        <v-text-field type="number" v-model="number"></v-text-field>
    </NodeBase>
</template>

<script setup lang="ts">
let number = ref(0);
</script>
