<template>
    <NodeBase title="Add" :color="NODE_MATH">
        <SocketOutput kind="number" :value="value" name="" :calc="calc" :dirty="dirty" />
        <SocketInput kind="number" ref="input_a" v-model="a" v-model:dirty="dirty" />
        <SocketInput kind="number" ref="input_b" v-model="b" v-model:dirty="dirty" />
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_MATH } from '~/lib/colors';
import type SocketInputVue from '../SocketInput.vue';

let value = ref("");
let a = ref("");
let b = ref("");
let dirty = ref(true);

let input_a: Ref<InstanceType<typeof SocketInputVue> | null> = ref(null);
let input_b: Ref<InstanceType<typeof SocketInputVue> | null> = ref(null);

async function calc(): Promise<void> {
    await Promise.all([input_a.value!.calc(), input_b.value!.calc()]);

    let ap = Number.parseInt(a.value);
    let bp = Number.parseInt(b.value);

    value.value = (ap + bp).toString();
    dirty.value = false;
}
</script>
