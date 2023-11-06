import { defineStore } from "pinia";
import { ref } from "vue";

export const useDiscordStore = defineStore("discord", () => {
  const username = ref("");
  const user_id = ref(1);
  const avatar = ref("");

  return { user_id, username, avatar }
})
