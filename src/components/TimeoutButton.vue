<template>
  <v-btn :disabled="timeout" @click="click()">
    <slot></slot>
  </v-btn>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VBtn } from 'vuetify/lib/components/index.mjs';

const emit = defineEmits<{
  (e: "clicked"): void,
}>();

const timeout = ref(false);

function click() {
  if (timeout.value) return;

  timeout.value = true;
  setTimeout(() => timeout.value = false, 2000);

  console.log(timeout.value);

  emit("clicked");
}
</script>
