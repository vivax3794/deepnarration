<template>
  <v-app>
    <v-app-bar>
      <img id="avatar" :src="`https://cdn.discordapp.com/avatars/${discord_info.user_id}/${discord_info.avatar}.png`"
        alt="Avatar">
      <div id="username">{{ discord_info.username }}</div>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
#avatar {
  height: 100%;
}

#username {
  font-size: 2rem;
}
</style>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { onBeforeMount } from "vue";

import { useDiscordStore } from "@/store/discord"

const discord_token = useStorage("discord", "");
const discord_info = useDiscordStore();

onBeforeMount(() => {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const [access_token, token_type] = [fragment.get('access_token'), fragment.get('token_type')];

  if (access_token !== null) {
    discord_token.value = `${token_type} ${access_token}`;
    setTimeout(() => document.location.hash = "", 100)
  }

  if (discord_token.value === "" && document.location.pathname !== "/login") {
    document.location.replace("/login");
    return;
  } else if (document.location.pathname !== "/login") {
    load_discord_data();
  }
})

async function load_discord_data() {
  let response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: discord_token.value,
    }
  });

  if (response.status != 200) {
    document.location.replace("/login");
    return;
  }

  let data = await response.json();

  discord_info.$patch({
    user_id: data.id,
    username: data.username,
    avatar: data.avatar,
  })
}

</script>

