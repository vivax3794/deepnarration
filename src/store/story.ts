import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { Scene } from "@/scene";
import { computed } from "vue";

export const useStoryStore = defineStore("story", () => {
  const scenes = useStorage("Story-Scenes", [new Scene()]);
  scenes.value = scenes.value.map((scene) => Object.assign(new Scene(), scene));
  const tts = useStorage("Story-Tts", true);
  const generate_images = useStorage("Story-Images", true);

  const total_time = computed(() => scenes.value.reduce((acc, scene) => acc + scene.duration, 0))

  function reset() {
    scenes.value = [new Scene()];
    tts.value = true;
    generate_images.value = true;
  }

  function new_scene() {
    scenes.value.push(new Scene());
  }

  function delete_scene(index: number) {
    scenes.value.splice(index, 1);

    if (scenes.value.length == 0) {
      new_scene();
    }
  }

  return { scenes, tts, generate_images, total_time, new_scene, delete_scene, reset }
})
