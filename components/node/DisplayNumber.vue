<template>
    <NodeBase :title="number.toString()" color="teal-darken-4">
        <SocketInput kind="number" ref="input" v-model="number" />
        <v-btn @click="input.calc()">Calculate</v-btn>
    </NodeBase>
</template>

<script setup lang="ts">
import { type Ref } from "vue";
import type { SocketInput } from '#build/components';

let number = ref("NO VALUE");
let input: Ref<InstanceType<typeof SocketInput>> = ref(null);
</script>
