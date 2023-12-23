
<template>
    <NodeBase title="To Text" :color="NODE_LOCAL" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput kind="url" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput kind="string" :dirty="dirty" :value="input" :calc="calc" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_LOCAL } from '~/lib/colors';

let input = ref("");
let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let dirty = ref(true);

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();
}
</script>
