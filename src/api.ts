import { Scene } from "@/scene";
import { useDiscordStore } from "./store/discord";

export async function submitImagesVideo(scenes: Scene[]) {
  const url = "https://deepnarrationapi.matissetec.dev/getImagesVideo";

  let discord = useDiscordStore();

  let imagePrompts = [];
  let themes = [];
  let ttsTiming = [];

  for (let scene of scenes) {
    imagePrompts.push({
      "prompt": scene.text
    });
    themes.push("None");
    ttsTiming.push(-1);
  }

  await fetch(url, {
    method: "Post",
    body: JSON.stringify({
      audioName: "",
      discordName: `<@${discord.user_id}>`,
      discordUsername: discord.username,
      strength: "0:(0.70)", // WTF IS THIS
      useTts: true,

      imagePrompts: imagePrompts,
      themes: themes,
      ttsTiming: ttsTiming
    })
  });
}
