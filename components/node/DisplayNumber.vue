<template>
    <NodeBase :title="number.toString()" :color="NODE_MATH" v-model:dirty="dirty" v-bind="$attrs">
        <SocketInput kind="number" ref="input" v-model="number" v-model:dirty="dirty" />
        <v-btn @click="calc">Calculate</v-btn>
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_MATH } from '~/lib/colors';

import { type Ref } from "vue";
import type { SocketInput } from '#build/components';

let number = ref("NO VALUE");
let dirty = ref(true);
let input: Ref<InstanceType<typeof SocketInput> | null> = ref(null);

async function calc(): Promise<void> {
    dirty.value = false;
    await input.value!.calc();
}
</script>
