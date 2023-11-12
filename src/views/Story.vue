<template>
  <div id="page">
    <h1>Faq</h1>
    <v-expansion-panels multiple>
      <v-expansion-panel title="How to use">
        <v-expansion-panel-text>
          Add a few scenes and enter a story for them, a TTS will be speaking them back, for now no voice controls.

          Scene length is currently limited to 75 words

        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel title="Models Used">
        <v-expansion-panel-text>
          now using dreamsharperxl10alpha2 and SD XL 1.0 refined for the deforum run
          <br /><br />
          The system currently has only 1 node running the API with limited queing, so if someone else is using it the
          generation start after theirs is done
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-expand-transition>
      <v-card class="margin" v-if="show_result" :color="result_color()">
        <v-card-title>
          <v-btn icon="mdi-close" variant="plain" @click="close_results"></v-btn>
          Result - {{ our_job ? 'Yours' : `Queue: ${our_position}` }}
        </v-card-title>
        <v-progress-linear :model-value="time_remaing / max_time * 100" height="20" color="orange"
          :striped="time_remaing > max_time">
          Estimated Progress
        </v-progress-linear>
      </v-card>
    </v-expand-transition>

    <div id="scenes" class="margin">
      <v-form @submit.prevent="submit" ref="form">
        <v-container>
          <v-row>
            <v-col>
              <v-btn color="green" width="100%" @click="scenes.push(new Scene())"><v-icon>mdi-plus</v-icon></v-btn>
            </v-col>
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
              <v-btn color="blue" width="100%" type="submit">Submit</v-btn>
            </v-col>
          </v-row>
        </v-container>
        <transition-group name="list">
          <div v-for="(scene, index) in scenes" :key="scene.id" class="margin">
            <SceneView :scene="scene" @delete="scenes.splice(index, 1)">
            </SceneView>
          </div>
        </transition-group>
      </v-form>
    </div>
  </div>
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

const scenes = useStorage("Story-Scenes", [new Scene()]);

const show_result = ref(false);
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

  show_result.value = true;
  our_job.value = false;
  time_remaing.value = -1;
  max_time.value = -1;
  last_position = -1;
  our_position.value = -1;

  req_id = await api.submitImagesVideo(scenes.value);
  clearInterval(update_id);
  update_id = setInterval(update_job_status, 500);
}

async function update_job_status() {
  time_remaing.value += 0.5;
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
