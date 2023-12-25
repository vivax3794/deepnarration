<template>
    <NodeBase title="Math" :color="NODE_LOCAL" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput name="x" kind="number" v-model:dirty="dirty" v-model="input_x" ref="input_element_x" />
        <SocketInput name="y" kind="number" v-model:dirty="dirty" v-model="input_y" ref="input_element_y" />
        <SocketInput name="z" kind="number" v-model:dirty="dirty" v-model="input_z" ref="input_element_z" />
        <SocketOutput kind="number" :dirty="dirty" :value="output" :calc="calc" />

        <div style="width: 200px"></div>
        <v-text-field v-model="formula" @update:model-value="dirty = true"></v-text-field>
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_LOCAL } from '~/lib/colors';

let output = ref(0);
let formula = ref("");

let dirty = ref(true);

let input_x = ref(0);
let input_element_x: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let input_y = ref(0);
let input_element_y: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
let input_z = ref(0);
let input_element_z: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

async function calc() {
    dirty.value = false;
    await Promise.all([
        input_element_x.value?.calc(),
        input_element_y.value?.calc(),
        input_element_z.value?.calc(),
    ]);

    let x = input_x.value;
    let y = input_y.value;
    let z = input_z.value;
    output.value = eval(formula.value);
    console.log("DID MATH", x);
}
</script>
