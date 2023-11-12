<template>
  <div id="container">
    <v-btn id="delete" color="red" icon="mdi-delete" variant="plain" size="x-large" @click="$emit('delete')"></v-btn>
    <v-card id="main">
      <v-textarea v-model="scene.text" label="Scene description" append-inner-icon="mdi-shuffle" clearable auto-grow
        rows="1" counter="75" :counter-value="(v) => v.split(' ').length"
        :rules="[(v) => v.split(' ').length <= 75 || 'Max 75 words', (v) => v != '' || 'Cant be empty']"
        @click:append-inner="scene.random()"></v-textarea>
    </v-card>
  </div>
</template>

<style scoped>
#container {
  position: relative;
}

#main {
  padding: 10px;
}

#delete {
  position: absolute;
  left: -60px;
}
</style>

<script setup lang="ts">
import { Scene } from "@/scene";

defineProps<{
  scene: Scene
}>()

defineEmits<{
  (e: 'delete'): void
}>();
</script>
