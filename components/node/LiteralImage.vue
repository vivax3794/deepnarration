<template>
    <NodeBase title="Image" :color="NODE_CONSTANT" v-model:dirty="dirty" v-bind="$attrs">
        <SocketOutput kind="image" :calc="calc" :value="input" v-model:dirty="dirty" />
        <v-file-input variant="outlined" accept="image/*" v-model="file" @update:model-value="dirty = true"></v-file-input>
    </NodeBase>
</template>

<script setup lang="ts">
import { NODE_CONSTANT } from '~/lib/colors';

let input = ref(new Blob());
let file: Ref<File[]> = ref([]);
let dirty = ref(true);

async function calc() {
    dirty.value = false;
    if (file.value[0] !== undefined) {
        let the_file = file.value[0];
        input.value = the_file;
    }
}
</script>
