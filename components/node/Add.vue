<template>
    <NodeBase title="Add" color="teal-darken-4">
        <SocketOutput kind="number" :value="value" name="Result" :calc="calc" />
        <SocketInput kind="number" ref="input_a" v-model="a" />
        <SocketInput kind="number" ref="input_b" v-model="b" />
    </NodeBase>
</template>

<script setup lang="ts">
let value = ref("");
let a = ref("");
let b = ref("");

let input_a = ref(null);
let input_b = ref(null);

async function calc(): Promise<void> {
    await Promise.all([input_a.value.calc(), input_b.value.calc()]);

    let ap = Number.parseInt(a.value);
    let bp = Number.parseInt(b.value);

    value.value = (ap + bp).toString();
}
</script>
