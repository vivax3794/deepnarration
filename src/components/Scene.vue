<!-- <template>
  <div id="container">
    <v-btn id="delete" color="red" icon="mdi-delete" variant="plain" size="x-large" @click="$emit('delete')"></v-btn>
    <v-card>
      <v-tabs v-model="tab" bg-color="purple">
        <v-tab value="basic">Basic Settings</v-tab>
        <v-expand-transition>
          <v-tab value="image" v-if="!story.generate_images">
            Images Settings
          </v-tab>
        </v-expand-transition>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="basic">
            <v-textarea v-model="scene.text" label="Scene description" append-inner-icon="mdi-shuffle" clearable auto-grow
              rows="1" counter="75" :counter-value="(v) => v.split(' ').length" :rules="description_rules"
              @click:append-inner="scene.random()" @update:focused="(ev) => updateDurationBasedOnTts(ev)"></v-textarea>

            <v-tooltip location="right" :disabled="!story.tts">
              <template v-slot:activator="{ props }">
                <div v-bind="props">
                  <v-slider :label="scene.duration.toFixed(2) + ' S'" prepend-icon="mdi-clock" :disabled="story.tts"
                    v-model="scene.duration" :min="2" :max="60" :step="0.1"></v-slider>
                </div>
              </template>
              Disable tts to manually adjust scene duration!
            </v-tooltip>
            <v-expand-transition>
              <v-slider v-if="!story.peak_detection" thumb-label hint="How similar images are" :min="0.005" :max="0.995"
                v-model="scene.strength">
                <template v-slot:prepend>
                  Random
                </template>
                <template v-slot:append>
                  Exact
                </template>
              </v-slider>
            </v-expand-transition>
          </v-window-item>
          <v-window-item value="image">
            <div v-if="!story.generate_images">
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
                    <v-text-field clearable @click:clear="image.url = ''" prepend-inner-icon="mdi-web" label="Image url"
                      v-model="image.url" :rules="image_url_rules"></v-text-field>
                    <v-btn color="red" width="100%" @click="delete_image(index)"><v-icon>mdi-delete</v-icon></v-btn>
                    <br />
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
import { ref } from "vue";
import { useStoryStore } from "@/store/story";
import { computed } from "vue";

const description_rules = [
  (v: string) => v.split(' ').length <= 75 || 'Max 75 words',
  (v: string) => v != '' || 'Cant be empty'
];
const image_url_rules = [
  (v: string) => v.length > 0 || "Must not be empty",
];

const tab = ref("basic");
const story = useStoryStore();

let props = defineProps<{
  modelValue: Scene,
}>()

const emit = defineEmits<{
  (e: 'delete'): void,
  (e: "update:modelValue", value: Scene): void
}>();

const scene = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value)
});

watch(() => story.tts, () => updateDurationBasedOnTts(false));
watch(() => story.generate_images, () => {
  // If we are on the image tab when images get turn off switch back to basic
  if (story.generate_images && tab.value === "image") {
    tab.value = "basic";
  }
})

async function updateDurationBasedOnTts(focused: boolean) {
  if (!focused && story.tts) {
    let response = await fetch("https://deepnarrationapi.matissetec.dev/downloadTTSVoice", {
      method: "Post",
      body: JSON.stringify({
        promptDataString: scene.value.text
      })
    });
    scene.value.duration = Number.parseFloat(await response.text())
  }
}

function addImage() {
  if (scene.value.images.length < 5) {
    scene.value.images.push({
      url: "",
      id: Math.floor(Math.random() * 100)
    })
  }
}

function delete_image(index: number) {
  scene.value.images.splice(index, 1);
  if (scene.value.images.length == 0) {
    addImage();
  }
}
</script> -->
