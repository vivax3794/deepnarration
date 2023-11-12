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
                      <v-btn color="red" @click="isActive.value = false; scenes = [new Scene()]">Yes</v-btn>
                      <v-btn @click="isActive.value = false">No</v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
            <v-col>
              <v-btn color="blue" width="100%" type="submit" :disabled="!can_submit">
                Submit -
                {{ scenes.reduce((acc, sc) => acc + sc.duration, 0).toFixed(2) }}S
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn width="100%" :color="tts ? 'green' : 'red'" @click="tts = !tts">
                <v-icon>{{ tts ? "mdi-microphone" : "mdi-microphone-off" }}</v-icon>
                {{ tts ? "TTS" : "No Audio" }}
              </v-btn>
            </v-col>
            <v-col>
              <v-btn width="100%" :color="generate_images ? 'green' : 'red'" @click="generate_images = !generate_images">
                <v-icon>{{ generate_images ? "mdi-image-auto-adjust" : "mdi-web" }}</v-icon>
                {{ generate_images ? "100% AI Images" : "Inserted keyframe images" }}
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <transition-group name="list">
          <div v-for="(scene, index) in scenes" :key="scene.id" class="margin">
            <SceneView :scene="scene" :tts="tts" :generate_images="generate_images" @delete="scenes.splice(index, 1)">
            </SceneView>
          </div>
        </transition-group>
        <v-btn class="margin" style="margin-bottom: 100px;" color="green" width="100%"
          @click="scenes.push(new Scene())"><v-icon>mdi-plus</v-icon></v-btn>
      </v-form>
    </div>
  </div>

  <v-dialog width="auto" v-model="ratelimited">
    <v-alert type="error" title="Ratelimited" text="Wait for some of your jobs to finish"></v-alert>
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
import { useStorage } from "@vueuse/core";
import { Scene } from "@/scene";
import { ref, Ref } from "vue";
import SceneView from "@/components/Scene.vue";
import { VForm } from "vuetify/lib/components/index.mjs";

import * as api from "@/api";
import { watch } from "vue";

const scenes = useStorage("Story-Scenes", [new Scene()]);
scenes.value = scenes.value.map((scene) => Object.assign(new Scene(), scene));
const tts = useStorage("Story-Tts", true);
const generate_images = useStorage("Story-Images", true);

const can_submit = ref(true);

const show_result = ref(false);
const ratelimited = ref(false);

const our_job = ref(false);
const time_remaing = ref(-1);
const max_time = ref(-1);
const our_position = ref(-1);


let req_id = 0;
let update_id: ReturnType<typeof setInterval> | undefined = undefined;
let last_position: number | null = -1;

const form: Ref<VForm | null> = ref(null);

async function submit() {
  let { valid } = await form.value?.validate();
  if (valid !== true) {
    return;
  }

  can_submit.value = false;
  setTimeout(() => can_submit.value = true, 2000);

  let result = await api.submitImagesVideo(scenes.value, tts.value, generate_images.value);
  if (result === null) {
    ratelimited.value = true;
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
