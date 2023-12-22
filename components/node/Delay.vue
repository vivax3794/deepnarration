
<template>
    <NodeBase title="Delay" :color="NODE_DEBUG" v-model:dirty="dirty" v-bind="$attrs" :working="loading">
        <SocketOutput kind="number" :value="value" name="" :calc="calc" :dirty="dirty" />
        <SocketInput kind="number" ref="input" v-model="value" v-model:dirty="dirty" />
    </NodeBase>
</template>

<script setup lang="ts">
import type { SocketInput } from '#build/components';
import { NODE_DEBUG } from '~/lib/colors';


let value = ref("");
let input: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

let loading = ref(false);
let dirty = ref(true);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function calc(): Promise<void> {
    dirty.value = false;
    await input.value!.calc();

    loading.value = true;
    await sleep(2000);
    loading.value = false;
}
</script>
