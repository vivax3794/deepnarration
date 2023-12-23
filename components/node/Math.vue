<template>
    <NodeBase title="Math" :color="NODE_LOCAL" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput kind="number" v-model:dirty="dirty" v-model="input" ref="input_element" />
        <SocketOutput kind="number" :dirty="dirty" :value="output" :calc="calc" />

        <v-text-field v-model="formula" @update:model-value="dirty = true"></v-text-field>
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_LOCAL } from '~/lib/colors';

let input = ref(0);
let output = ref(0);
let formula = ref("");
let input_element: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let dirty = ref(true);

async function calc() {
    dirty.value = false;
    console.log(input_element.value);
    await input_element.value?.calc();

    let x = input.value;
    output.value = eval(formula.value);
}
</script>
