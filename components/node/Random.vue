<template>
    <NodeBase title="Random" :color="NODE_MATH" v-model:dirty="dirty" v-bind="$attrs">
        <SocketOutput kind="number" name="" :calc="calc" :value="number.toString()" v-model:dirty="dirty" />
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_MATH } from '~/lib/colors';

let number = ref(0);
let dirty = ref(true);

async function calc() {
    dirty.value = false;
    number.value = Math.random();
}
</script>
