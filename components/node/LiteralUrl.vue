<template>
    <NodeBase title="Url" :color="NODE_CONSTANT" v-model:dirty="dirty" v-bind="$attrs">
        <SocketOutput kind="url" :calc="async () => { dirty = false }" :value="input" v-model:dirty="dirty" />
        <div style="width: 500px"></div>
        <v-text-field v-model="input" @update:model-value="dirty = true" variant="outlined"></v-text-field>
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_CONSTANT } from '~/lib/colors';

let input = ref("");
let dirty = ref(true);
</script>
