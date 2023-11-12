<template>
  <div id="container">
    <v-btn id="delete" color="red" icon="mdi-delete" variant="plain" size="x-large" @click="$emit('delete')"></v-btn>
    <v-card id="main">
      <v-text-field v-model="scene.text" placeholder="Scene description" append-inner-icon="mdi-shuffle"
        @click:append-inner="scene.random()"></v-text-field>
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
