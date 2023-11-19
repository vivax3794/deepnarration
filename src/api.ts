import { Scene } from "@/scene";
import { useDiscordStore } from "./store/discord";
import { useStoryStore } from "./store/story";

export async function submitImagesVideo(): Promise<number | null> {
  const url = "https://deepnarrationapi.matissetec.dev/getImagesVideo";

  let discord = useDiscordStore();
  let story = useStoryStore();

  let imagePrompts = [];
  let themes = [];
  let ttsTiming = [];
  let strengths = [];

  let time = 0;
  let last_strength = null;
  for (let scene of story.scenes) {
    imagePrompts.push({
      "prompt": scene.text.replaceAll("\n", ".")
    });
    themes.push("None");

    if (story.tts) {
      ttsTiming.push(-1);
    } else {
      ttsTiming.push(scene.duration);
    }

    if (!story.peak_detection) {
      if (last_strength !== null) {
        strengths.push(`${Math.floor(time * 10) - 1}:(${last_strength})`);
      }
      strengths.push(`${Math.floor(time * 10)}:(${scene.strength})`);
      last_strength = scene.strength;
    }

    time += scene.duration;
  }

  if (story.peak_detection) {
    strengths = story.peaks;
  }

  let request_id = Math.floor(Math.random() * 100);
  let body: any = {
    audioName: "",
    discordName: `<@${discord.user_id}>`,
    discordUsername: `${discord.username} - [NEW FRONTEND]`,
    strength: strengths.join(","),
    useTts: story.tts,

    imagePrompts: imagePrompts,
    themes: themes,
    ttsTimings: ttsTiming,

    id: request_id,
  };

  if (!story.generate_images) {
    body.images = story.scenes.map((scene) => scene.images.map((image) => image.url));
  }

  if (story.peak_detection) {
    body.audioName = await upload_audio(story.audio_file!);
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
  estimated_time_until_your_turn: number,
}

export async function upload_audio(file: File): Promise<string> {
  let url = "https://deepnarrationapi.matissetec.dev/uploadAudio";

  let id = Math.floor(Math.random() * 1000000);
  let name = `${id}.mp3`

  let data = new FormData();
  data.append("audioFile", file, name);

  await fetch(
    url,
    {
      method: "POST",
      body: data,
    }
  );
  return name;
}

export async function getJobsStatus(id: number): Promise<JobStatus> {
  let url = "https://deepnarrationapi.matissetec.dev/queue";
  let response = await fetch(url);
  let data = await response.text();

  let [jobs_raw, time_raw] = data.split("<br />");
  let jobs = JSON.parse(jobs_raw);
  let time = /current job is about (\d+) seconds/.exec(time_raw)![1];

  let position = null;
  let index = 0;
  let estimated_time_until_your_turn = 0;
  for (let job of jobs) {
    if (job.request_data.id == id) {
      position = index;
      break;
    }
    estimated_time_until_your_turn += job.cost;
    index++;
  }

  return {
    position,
    total_time: Number.parseInt(time),
    estimated_time_until_your_turn
  }
}
