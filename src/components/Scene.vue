<template>
  <div id="container">
    <v-btn id="delete" color="red" icon="mdi-delete" variant="plain" size="x-large" @click="$emit('delete')"></v-btn>
    <v-card id="main">
      <v-textarea v-model="scene.text" label="Scene description" append-inner-icon="mdi-shuffle" clearable auto-grow
        rows="1" counter="75" :counter-value="(v) => v.split(' ').length"
        :rules="[(v) => v.split(' ').length <= 75 || 'Max 75 words', (v) => v != '' || 'Cant be empty']"
        @click:append-inner="scene.random()" @update:focused="(ev) => getTts(ev)"></v-textarea>


      <v-tooltip location="right" :disabled="!tts">
        <template v-slot:activator="{ props }">
          <div v-bind="props">
            <v-slider :label="scene.duration.toFixed(2) + ' S'" prepend-icon="mdi-clock" :disabled="tts"
              v-model="scene.duration" :min="2" :max="60"></v-slider>
          </div>
        </template>
        Disable tts to manually adjust scene duration!
      </v-tooltip>
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
import { watch } from "vue";
import { Scene } from "@/scene";
import { ref, Ref } from "vue";

const duration_slider: Ref<Element | undefined> = ref(undefined);

let props = defineProps<{
  scene: Scene,
  tts: boolean,
}>()

defineEmits<{
  (e: 'delete'): void
}>();

watch(() => props.tts, () => getTts(false));

async function getTts(focused: boolean) {
  if (!focused && props.tts) {
    let response = await fetch("https://deepnarrationapi.matissetec.dev/downloadTTSVoice", {
      method: "Post",
      body: JSON.stringify({
        promptDataString: props.scene.text
      })
    });
    props.scene.duration = Number.parseFloat(await response.text())
  }
}
</script>
