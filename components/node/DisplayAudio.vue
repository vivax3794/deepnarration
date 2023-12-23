<template>
    <NodeBase title="Listen to audio" :color="NODE_DISPLAY" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput kind="audio" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput kind="audio" :dirty="dirty" :value="input" :calc="calc" />

        <v-btn @click="calc" :disabled="!dirty">Get newest value</v-btn>
        <div style="width: 500px"></div>
        <audio :src="url" controls></audio>
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_DISPLAY } from '~/lib/colors';

let input = ref(new Blob());
let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let dirty = ref(true);

let url = ref("");
watch(() => input.value, () => {
    console.log(input.value);
    URL.revokeObjectURL(url.value);
    if (input.value !== undefined && input.value.size !== 0) url.value = URL.createObjectURL(input.value)
})

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();
}
</script>
