<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click.stop="navdraw = !navdraw"></v-app-bar-nav-icon>
      <v-app-bar-title>Deepnarration</v-app-bar-title>

      <v-avatar id="avatar"
        :image="`https://cdn.discordapp.com/avatars/${discord_info.user_id}/${discord_info.avatar}.png`" alt="Avatar">

      </v-avatar>
      <div id="username">{{ discord_info.username }}</div>
    </v-app-bar>
    <v-navigation-drawer expand-on-hover rail v-model="navdraw">
      <v-list nav>
        <v-list-item title="About" prepend-icon="mdi-information" to="/about"></v-list-item>
        <v-list-item title="Face Swap" prepend-icon="mdi-face-recognition" to="/FaceSwap"></v-list-item>
        <v-list-item title="Similar Images" prepend-icon="mdi-image-multiple" to="/SimilarImages"></v-list-item>
        <v-list-item title="Outpaint Image" prepend-icon="mdi-vector-rectangle" to="/OutpaintImage"></v-list-item>
        <v-list-item title="Parallax" prepend-icon="mdi-image-frame" to="/parallax"></v-list-item>
        <v-list-item title="Hologram" prepend-icon="mdi-hololens" to="/hologram"></v-list-item>
        <v-list-item title="LogoEmerge" prepend-icon="mdi-dropbox" to="/logoEmerge"></v-list-item>
        <v-list-item title="TransparentGif" prepend-icon="mdi-square-opacity" to="/transparentGif"></v-list-item>
        <v-list-item title="Story" prepend-icon="mdi-book" to="/story"></v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <div id="page">
        <router-view />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
#page {
  margin-top: 20px;
  margin-left: 20%;
  margin-right: 20%;
}

#avatar {
  height: 60%;
}

#username {
  font-size: 1rem;
  margin-right: 30px;
}
</style>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { onBeforeMount } from "vue";

import { useDiscordStore } from "@/store/discord"
import { ref } from "vue";


const discord_token = useStorage("discord", "");
const discord_info = useDiscordStore();
const navdraw = ref(true);

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

