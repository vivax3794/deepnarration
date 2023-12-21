<template>
    <NodeBase :title="number.toString()" :color="NODE_MATH">
        <SocketInput kind="number" ref="input" v-model="number" :dirty="true" />
        <v-btn @click="input!.calc()">Calculate</v-btn>
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_MATH } from '~/lib/colors';

import { type Ref } from "vue";
import type { SocketInput } from '#build/components';

let number = ref("NO VALUE");
let input: Ref<InstanceType<typeof SocketInput> | null> = ref(null);
</script>
