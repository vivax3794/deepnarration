import { Scene } from "@/scene";
import { useDiscordStore } from "./store/discord";

export async function submitImagesVideo(scenes: Scene[]): Promise<number | null> {
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

  let request_id = Math.floor(Math.random() * 100);
  let response = await fetch(url, {
    method: "Post",
    body: JSON.stringify({
      audioName: "",
      discordName: `<@${discord.user_id}>`,
      discordUsername: discord.username,
      strength: "0:(0.70)", // WTF IS THIS
      useTts: true,

      imagePrompts: imagePrompts,
      themes: themes,
      ttsTimings: ttsTiming,

      id: request_id,
    })
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
