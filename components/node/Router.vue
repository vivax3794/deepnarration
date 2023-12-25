<template>
    <NodeBase title="" :color="NODE_CONTROL_FLOW" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput generic v-model:kind="kind" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput :kind="kind" :dirty="dirty" :value="input" :calc="calc" />

    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_CONTROL_FLOW } from '~/lib/colors';

let input = ref("");
let kind = ref("generic");
let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let dirty = ref(true);

async function calc() {
    dirty.value = false;
    await input_element.value?.calc();
}
</script>
