<template>
    <NodeBase :title="`Triggered: ${count}`" :color="NODE_DEBUG" v-bind:dirty="dirty" v-bind="$attrs">
        <SocketOutput kind="number" :value="value" name="" :calc="calc" :dirty="dirty" />
        <SocketInput kind="number" ref="input" v-model="value" v-model:dirty="dirty" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_DEBUG } from '~/lib/colors';

let value = ref("");
let input: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let count = ref(0);
let dirty = ref(true);

async function calc(): Promise<void> {
    count.value += 1;
    await input.value!.calc();

    dirty.value = false;
}
</script>
