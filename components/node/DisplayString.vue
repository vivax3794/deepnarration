<template>
    <NodeBase title="Show String" :color="NODE_DISPLAY" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput kind="string" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput kind="string" :dirty="dirty" :value="input" :calc="calc" />

        <v-btn @click="calc" :disabled="!dirty">Get newest value</v-btn>
        <div style="width: 500px"></div>
        <v-textarea v-model="input" @update:model-value="dirty = true" variant="outlined" auto-grow readonly></v-textarea>
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_DISPLAY } from '~/lib/colors';

let input = ref("");
let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let dirty = ref(true);

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();
}
</script>
