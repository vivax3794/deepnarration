<template>
    <NodeBase title="Show Image" :color="NODE_DISPLAY" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput kind="image" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput kind="image" :dirty="dirty" :value="input" :calc="calc" />

        <v-btn @click="calc" :disabled="!dirty">Get newest value</v-btn>
        <br />
        <img :src="url" alt="">
        <br />
        (To save hold shift + right click)
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
    URL.revokeObjectURL(url.value);
    if (input.value === undefined) return;
    url.value = URL.createObjectURL(input.value)
})

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();
}
</script>
