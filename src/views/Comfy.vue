<template>
  <div id="page">
    <v-card style="margin-top: 20px">
      <v-card-text>
        <v-text-field v-model="person_url" label="Image of a persons face" prepend-inner-icon="mdi-web">
        </v-text-field>
        <v-icon id="arrow" size="x-large">mdi-arrow-down</v-icon>
        <v-text-field v-model="target_url" label="Target image" prepend-inner-icon="mdi-web">
        </v-text-field>
        <v-text-field v-model="prompt" label="Guiding prompt">
        </v-text-field>
        <TimeoutButton color="blue" width="100%" @clicked="submit()">Submit</TimeoutButton>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
#page {
  margin-left: 20%;
  margin-right: 20%;
}

#arrow {
  margin-left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
}
</style>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';

import { useDiscordStore } from '@/store/discord';
import TimeoutButton from "@/components/TimeoutButton.vue";

const discord = useDiscordStore();

const target_url = useStorage("Comfy-Target", "");
const person_url = useStorage("Comfy-Person", "");
const prompt = useStorage("Comfy-Prompt", "");

function submit() {
  const url = "https://deepnarrationapi.matissetec.dev/startComfyPrompt"

  const body = {
    discordId: discord.user_id,
    discordUsername: discord.username,
    personPicture: person_url.value,
    targetPicture: target_url.value,
    prompt: prompt.value,
  }

  fetch(url, {
    method: "POST",
    body: JSON.stringify(body)
  })
}
</script>
