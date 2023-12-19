
<template>
    <NodeBase title="Delay" color="red-darken-4">
        <div v-if="loading">SIMULATED API REQUEST</div>
        <SocketOutput kind="number" :value="value" name="Result" :calc="calc" />
        <SocketInput kind="number" ref="input" v-model="value" />
    </NodeBase>
</template>

<script setup lang="ts">
let value = ref("");
let input = ref(null);

let loading = ref(false);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function calc(): Promise<void> {
    await input.value.calc();

    loading.value = true;
    await sleep(2000);
    loading.value = false;
}
</script>
