import { Scene } from "@/scene";
import { useDiscordStore } from "./store/discord";

export async function submitImagesVideo(scenes: Scene[], tts: boolean, generate_images: boolean): Promise<number | null> {
  const url = "https://deepnarrationapi.matissetec.dev/getImagesVideo";

  let discord = useDiscordStore();

  let imagePrompts = [];
  let themes = [];
  let ttsTiming = [];
  let strengths = [];

  let time = 0;
  let last_strength = null;
  for (let scene of scenes) {
    imagePrompts.push({
      "prompt": scene.text.replaceAll("\n", ".")
    });
    themes.push("None");
    if (tts) {
      ttsTiming.push(-1);
    } else {
      ttsTiming.push(scene.duration);
    }
    if (last_strength !== null) {
      strengths.push(`${Math.floor(time * 10) - 1}:(${last_strength})`);
    }
    strengths.push(`${Math.floor(time * 10)}:(${scene.strength})`);
    last_strength = scene.strength;
    time += scene.duration;
  }

  let request_id = Math.floor(Math.random() * 100);
  let body: any = {
    audioName: "",
    discordName: `<@${discord.user_id}>`,
    discordUsername: `${discord.username} - [NEW FRONTEND]`,
    strength: strengths.join(","),
    useTts: tts,

    imagePrompts: imagePrompts,
    themes: themes,
    ttsTimings: ttsTiming,

    id: request_id,
  };

  if (!generate_images) {
    body.images = scenes.map((scene) => scene.images.map((image) => image.url));
  }

  let response = await fetch(url, {
    method: "Post",
    body: JSON.stringify(body)
  });

  if (response.status === 200) {
    return request_id;
  } else {
    return null;
  }
}

interface JobStatus {
  position: number | null,
  total_time: number,
}

export async function getJobsStatus(id: number): Promise<JobStatus> {
  let url = "https://deepnarrationapi.matissetec.dev/queue";
  let response = await fetch(url);
  let data = await response.text();

  let [jobs_raw, time_raw] = data.split("<br />");
  let jobs = JSON.parse(jobs_raw);
  let time = /current job is about (\d+) seconds/.exec(time_raw)[1];

  let position = null;
  let index = 0;
  for (let job of jobs) {
    if (job.request_data.id == id) {
      position = index;
    }
    index++;
  }

  return {
    position: position,
    total_time: Number.parseInt(time)
  }
}
