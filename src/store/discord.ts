import { defineStore } from "pinia";
import { Ref, ref } from "vue";

export const useDiscordStore = defineStore("discord", () => {
  const username: Ref<string | undefined> = ref(undefined);
  const user_id: Ref<number | undefined> = ref(undefined);
  const avatar: Ref<string | undefined> = ref(undefined);
  const token: Ref<string | undefined> = ref(undefined);

  return { user_id, username, avatar, token }
})
