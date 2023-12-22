<template>
    <NodeBase title="Number" :color="NODE_MATH" v-model:dirty="dirty" v-bind="$attrs">
        <SocketOutput kind="number" name="" :calc="async () => { dirty = false }" :value="number.toString()"
            v-model:dirty="dirty" />
        <v-text-field type="number" v-model="number" @update:model-value="dirty = true"></v-text-field>
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_MATH } from '~/lib/colors';

let number = ref(0);
let dirty = ref(true);
</script>
