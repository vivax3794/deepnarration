<template>
    <NodeBase title="Number" :color="NODE_CONSTANT" v-model:dirty="dirty" v-bind="$attrs">
        <SocketOutput kind="number" :calc="async () => { dirty = false }" :value="number" v-model:dirty="dirty" />
        <v-text-field variant="outlined" type="number" v-model="number" @update:model-value="dirty = true"></v-text-field>
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_CONSTANT } from '~/lib/colors';

let number = ref(0);
let dirty = ref(true);
</script>
