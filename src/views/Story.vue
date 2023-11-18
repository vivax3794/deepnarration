<template>
  <div id="page">
    <v-expand-transition>
      <v-card class="margin" v-if="show_result" :color="result_color()">
        <v-card-title>
          <v-btn icon="mdi-close" variant="plain" @click="close_results"></v-btn>
          Result - {{ our_job ? 'Yours' : `Queue: ${our_position}` }}
        </v-card-title>
        Results will be on discord, for now.
        <v-progress-linear :model-value="time_remaing / max_time * 100" height="20" color="orange"
          :striped="time_remaing > max_time">
          Estimated Progress - If inaccurate blame matisse
        </v-progress-linear>
      </v-card>
    </v-expand-transition>

    <div id="scenes" class="margin">
      <v-form @submit.prevent="submit" ref="form">
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
              <v-btn color="blue" width="100%" type="submit" :disabled="!can_submit">
                Submit -
                {{ story.total_time }}S
              </v-btn>
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
  </div>

  <v-dialog width="auto" v-model="error">
    <v-alert type="error" title="Error" :text="error_text"></v-alert>
  </v-dialog>
</template>

<style scoped>
#page {
  margin-left: 20%;
  margin-right: 20%;
}

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

const story = useStoryStore();

const can_submit = ref(true);

const show_result = ref(false);
const error = ref(false);
const error_text = ref("");

const our_job = ref(false);
const time_remaing = ref(-1);
const max_time = ref(-1);
const our_position = ref(-1);


let req_id = 0;
let update_id: ReturnType<typeof setInterval> | undefined = undefined;
let last_position: number | null = -1;

const form: Ref<VForm | null> = ref(null);

async function submit() {
  let { valid } = await form.value!.validate();
  if (valid !== true) {
    error_text.value = "Invalid form inputs";
    error.value = true;
    return;
  }

  can_submit.value = false;
  setTimeout(() => can_submit.value = true, 2000);

  let result = await api.submitImagesVideo();
  if (result === null) {
    error_text.value = "Error with request - you might have been ratelimited";
    error.value = true;
    return;
  } else {
    req_id = result;
  }

  show_result.value = true;
  our_job.value = false;
  time_remaing.value = -1;
  max_time.value = -1;
  last_position = -1;
  our_position.value = -1;

  clearInterval(update_id);
  update_job_status();
  update_id = setInterval(update_job_status, 2000);
}

async function update_job_status() {
  time_remaing.value += 2;
  let status = await api.getJobsStatus(req_id);

  if (status.position === null) {
    our_job.value = true;
  } else {
    our_job.value = false;
    our_position.value = status.position + 1;
  }

  if (status.position !== last_position) {
    last_position = status.position;
    time_remaing.value = 0;
  }
  max_time.value = status.total_time;

  if (time_remaing.value > max_time.value && our_job.value) {
    clearInterval(update_id);
  }
}

function result_color(): string {
  if (our_job.value) {
    if (time_remaing.value > max_time.value) {
      return "green";
    } else {
      return "teal";
    }
  } else {
    return "gray";
  }
}

function close_results() {
  show_result.value = false;
  clearInterval(update_id);
}

</script>
