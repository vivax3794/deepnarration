<template>
  <div id="page" title="FAQ">
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

    <div id="scenes">
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
        </v-row>
        <v-row v-for="(scene, index) in scenes">
          <v-col>
            <SceneView :scene="scene" @delete="scenes.splice(index, 1)">
            </SceneView>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
#page {
  margin-left: 20%;
  margin-right: 20%;
}

#scenes {
  margin-top: 20px;
}
</style>

<script setup lang="ts">
import { Scene } from "@/scene";
import { ref } from "vue";
import SceneView from "@/components/Scene.vue";

const scenes = ref([new Scene()]);
</script>
