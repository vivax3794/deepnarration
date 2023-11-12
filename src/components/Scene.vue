<template>
  <div id="container">
    <v-btn id="delete" color="red" icon="mdi-delete" variant="plain" size="x-large" @click="$emit('delete')"></v-btn>
    <v-card>
      <v-tabs v-model="tab" bg-color="purple">
        <v-tab value="basic">Basic</v-tab>
        <v-expand-transition>
          <v-tab value="image" v-if="!generate_images">
            Images
            <v-icon color="red" v-if="scene.images.length === 0">mdi-alert-minus</v-icon>
          </v-tab>
        </v-expand-transition>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="basic">
            <v-textarea v-model="scene.text" label="Scene description" append-inner-icon="mdi-shuffle" clearable auto-grow
              rows="1" counter="75" :counter-value="(v) => v.split(' ').length"
              :rules="[(v) => v.split(' ').length <= 75 || 'Max 75 words', (v) => v != '' || 'Cant be empty']"
              @click:append-inner="scene.random()" @update:focused="(ev) => getTts(ev)"></v-textarea>

            <v-tooltip location="right" :disabled="!tts">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-slider :label="scene.duration.toFixed(2) + ' S'" prepend-icon="mdi-clock" :disabled="tts"
                    v-model="scene.duration" :min="2" :max="60" :step="0.1"></v-slider>
                </div>
              </template>
              Disable tts to manually adjust scene duration!
            </v-tooltip>
            <v-slider thumb-label hint="How similar images are" :min="0.005" :max="0.995" v-model="scene.strength">
              <template v-slot:prepend>
                Random
              </template>
              <template v-slot:append>
                Exact
              </template>
            </v-slider>
          </v-window-item>
          <v-window-item value="image">
            <div v-if="!generate_images">
              <v-btn color="green" width="100%" @click="addImage">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-expansion-panels variant="popout" style="margin-top: 10px" multiple color="blue-grey-darken-4">
                <v-expansion-panel v-for="(image, index) of scene.images" :key="image.id" :value="image.id"
                  bg-color="blue-grey-darken-4">
                  <v-expansion-panel-title>
                    {{ image.url.slice(0, 100) + "..." }}

                    <template v-slot:actions>
                      <img style="height:100px" :src="image.url" />
                    </template>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-text-field clearable prepend-inner-icon="mdi-web" label="Image url"
                      v-model="image.url"></v-text-field>
                    <v-btn color="red" width="100%"
                      @click="scene.images.splice(index, 1)"><v-icon>mdi-delete</v-icon></v-btn> <br />
                    <img :src="image.url" />
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>

    </v-card>
  </div>
</template>

<style scoped>
#container {
  position: relative;
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

const tab = ref("basic");

let props = defineProps<{
  scene: Scene,
  tts: boolean,
  generate_images: boolean,
}>()

defineEmits<{
  (e: 'delete'): void
}>();

watch(() => props.tts, () => getTts(false));
watch(() => props.generate_images, () => {
  if (props.generate_images && tab.value === "image") {
    tab.value = "basic";
  }
})

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

function addImage() {
  if (props.scene.images.length < 5) {
    props.scene.images.push({
      url: "",
      id: Math.floor(Math.random() * 100)
    })
  }
}
</script>
