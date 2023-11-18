import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

import { Scene } from "@/scene";
import { computed } from "vue";
import { ref } from "vue";
import { Ref } from "vue";

export const useStoryStore = defineStore("story", () => {
  const scenes = useStorage("Story-Scenes", [new Scene()]);
  scenes.value = scenes.value.map((scene) => Object.assign(new Scene(), scene));
  const tts = useStorage("Story-Tts", true);
  const generate_images = useStorage("Story-Images", true);
  const peak_detection = useStorage("Story-Peak", false);
  const peaks: Ref<string[]> = ref([]);
  const audio_file: Ref<File | null> = ref(null);

  const total_time = computed(() => scenes.value.reduce((acc, scene) => acc + scene.duration, 0))

  function reset() {
    scenes.value = [new Scene()];
    tts.value = true;
    generate_images.value = true;
    peak_detection.value = false;
    peaks.value = [];
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

  return { scenes, tts, generate_images, peak_detection, audio_file, peaks, total_time, new_scene, delete_scene, reset }
})
