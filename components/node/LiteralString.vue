<template>
    <NodeBase title="Text" :color="NODE_CONSTANT" v-model:dirty="dirty" v-bind="$attrs">
        <SocketOutput kind="string" :calc="async () => { dirty = false }" :value="input" v-model:dirty="dirty" />
        <div style="width: 500px"></div>
        <v-textarea v-model="input" @update:model-value="dirty = true" variant="outlined" auto-grow></v-textarea>
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_CONSTANT } from '~/lib/colors';

let input = ref("");
let dirty = ref(true);
</script>
