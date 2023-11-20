<template>
  <ResultQueue :request_id="req_id" v-model="show_result"></ResultQueue>
  <div id="scenes" class="margin">
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col>
            <v-dialog :width="500">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" width="100%" color="red"><v-icon>mdi-restart</v-icon></v-btn>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card title="Delete all scenes?">
                  <v-card-actions>
                    <v-btn color="red" @click="isActive.value = false; story.reset()">Yes</v-btn>
                    <v-btn @click="isActive.value = false">No</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
          <v-col>
            <TimeoutButton color="blue" width="100%" @clicked="submit()">
              Submit -
              {{ story.total_time }}S
            </TimeoutButton>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn width="100%" :color="story.tts ? 'green' : 'red'" @click="story.tts = !story.tts">
              <v-icon>{{ story.tts ? "mdi-microphone" : "mdi-microphone-off" }}</v-icon>
              {{ story.tts ? "TTS" : "No Audio" }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn width="100%" :color="story.generate_images ? 'green' : 'red'"
              @click="story.generate_images = !story.generate_images">
              <v-icon>{{ story.generate_images ? "mdi-image-auto-adjust" : "mdi-web" }}</v-icon>
              {{ story.generate_images ? "100% AI Images" : "Inserted keyframe images" }}
            </v-btn>
          </v-col>
          <v-col>
            <v-btn width="100%" :color="story.peak_detection ? 'green' : 'red'"
              @click="story.peak_detection = !story.peak_detection">
              <v-icon>{{ story.peak_detection ? "mdi-music" : "mdi-pen" }}</v-icon>
              {{ story.peak_detection ? "Peak Detection" : "Manual Strength Values" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-expand-transition>
        <PeakDetection v-if="story.peak_detection"></PeakDetection>
      </v-expand-transition>
      <transition-group name="list">
        <div v-for="(scene, index) in story.scenes" :key="scene.id" class="margin">
          <SceneView :scene="scene" @delete="story.delete_scene(index)">
          </SceneView>
        </div>
      </transition-group>
      <v-btn class="margin" style="margin-bottom: 100px;" color="green" width="100%"
        @click="story.new_scene()"><v-icon>mdi-plus</v-icon></v-btn>
    </v-form>
  </div>

  <v-dialog width="auto" v-model="error">
    <v-alert type="error" title="Error" :text="error_text"></v-alert>
  </v-dialog>
</template>

<style scoped>
.margin {
  margin-top: 20px;
}

#loader {
  margin: 10px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
  width: 100%;
  overflow: hidden;
}

.list-enter-from,
.list-leave-to {
  width: 0px;
}
</style>

<script setup lang="ts">
import { ref, Ref } from "vue";
import SceneView from "@/components/Scene.vue";
import PeakDetection from "@/components/PeakDetection.vue"
import { VForm } from "vuetify/lib/components/index.mjs";

import * as api from "@/api";
import { useStoryStore } from "@/store/story";
import TimeoutButton from "@/components/TimeoutButton.vue";
import ResultQueue from "@/components/ResultQueue.vue";

const story = useStoryStore();

const error = ref(false);
const error_text = ref("");

const show_result = ref(false);
let req_id = ref(0);

const form: Ref<VForm | null> = ref(null);

async function submit() {
  let { valid } = await form.value!.validate();
  if (valid !== true) {
    error_text.value = "Invalid form inputs";
    error.value = true;
    return;
  }

  let result = await api.submitImagesVideo();
  if (result === null) {
    error_text.value = "Error with request - you might have been ratelimited";
    error.value = true;
    return;
  } else {
    req_id.value = result;
    show_result.value = true;
  }
}

</script>
