import { markRaw } from "vue";

import { NODE_AI, NODE_DISPLAY, NODE_CONSTANT, NODE_ACTION, NODE_LOCAL, NODE_CONTROL_FLOW } from "~/lib/colors";
import NodeLiteralString from "~/components/node/LiteralString.vue";
import NodeSystemPresets from "~/components/node/SystemPresets.vue";
import NodeDisplayString from "~/components/node/DisplayString.vue";
import NodeInputImage from "~/components/node/LiteralImage.vue";
import NodeDisplayImage from "~/components/node/DisplayImage.vue";
import NodeTextGeneration from "~/components/node/TextGeneration.vue";
import NodeImageGenerationCloudflare from "~/components/node/ImageGenerationCloudflare.vue";
import NodeImageGenerationDeepnarration from "~/components/node/ImageGenerationDeepnarration.vue";
import NodeReTheme from "~/components/node/ReTheme.vue";
// import NodeImageGenerationStable from "~/components/node/ImageGenerationStable.vue";
import NodeDiscordWebhook from "~/components/node/DiscordWebhook.vue"
import NodeLiteralUrl from "~/components/node/LiteralUrl.vue"
import NodeLoadImage from "~/components/node/LoadImage.vue"
import NodeUploadImage from "~/components/node/UploadImage.vue"
import NodeUrlToText from "~/components/node/UrlToText.vue"
import NodeTts from "~/components/node/Tts.vue"
import NodeDisplayAudio from "~/components/node/DisplayAudio.vue"
import NodeImageToVideo from "~/components/node/ImageToVideo.vue"
import NodeCombineVideo from "~/components/node/CombineVideos.vue"
import NodeAddAudio from "~/components/node/AddAudio.vue"
import NodeDisplayVideo from "~/components/node/DisplayVideo.vue"
import NodeLiteralNumber from "~/components/node/LiteralNumber.vue"
import NodeDuration from "~/components/node/AudioDuration.vue"
import NodeMath from "~/components/node/Math.vue"
import NodeRouter from "~/components/node/Router.vue"
import NodeRepeat from "~/components/node/Repeat.vue"
import NodeRepeatEnd from "~/components/node/RepeatEnd.vue"
import NodeEmptyVideo from "~/components/node/EmptyVideo.vue"

interface NodeItem {
    type: Component,
    color: string,
    name: string,
    divider?: boolean,
    tip: string,
    healthcheck?: () => Promise<string | undefined>
}

async function cloudflare(): Promise<string | undefined> {
    let healthy = await $fetch("/api/cloudflare_health");
    if (healthy) return undefined
    return "Missing CLOUDFLARE_AI_TOKEN or CLOUDFLARE_ACCOUNT env vars."
}

async function stable(): Promise<string | undefined> {
    let healthy = await $fetch("/api/stable/health");
    if (healthy) return undefined
    return "Missing STABLE_TOKEN env var."
}
async function deepnarration(): Promise<string | undefined> {
    try {
        await $fetch("https://deepnarration.matissetec.dev/queue");
        return undefined;
    } catch {
        return "Could not reach deepnarration.matissetec.dev"
    }
}

export let possible_nodes: NodeItem[] = [
    {
        type: markRaw(NodeTextGeneration),
        color: NODE_AI,
        name: "Text Generation",
        tip: "Use a LLM to generate text output based on inputs",
        healthcheck: cloudflare
    },
    {
        type: markRaw(NodeLiteralString),
        color: NODE_CONSTANT,
        name: "Text",
        tip: "Constant text",
    },
    {
        type: markRaw(NodeSystemPresets),
        color: NODE_CONSTANT,
        name: "System Prompts",
        tip: "Predefined system prompts for common tasks."
    },
    {
        type: markRaw(NodeDisplayString),
        color: NODE_DISPLAY,
        name: "Show String",
        tip: "Show the input string and pass it along, also allows you to trigger the flow."
    },
    {
        divider: true,
        type: markRaw(NodeImageGenerationCloudflare),
        color: NODE_AI,
        name: "Image Generation (Cloudflare)",
        tip: "Use a AI to generate image output based on inputs using workers ai (quite slow)",
        healthcheck: cloudflare
    },
    // {
    //     type: markRaw(NodeImageGenerationStable),
    //     color: NODE_AI,
    //     name: "Image Generation (Stablediffusion)",
    //     tip: "Use a AI to generate image output based on inputs using stable difussion ai",
    //     healthcheck: stable
    // },
    {
        type: markRaw(NodeImageGenerationDeepnarration),
        color: NODE_AI,
        name: "Image Generation (Deepnarration)",
        tip: "Use a AI to generate image output based on inputs using matisses gpu (quite fast)",
        healthcheck: deepnarration,
    },
    {
        type: markRaw(NodeReTheme),
        color: NODE_AI,
        name: "Image Retheme (Deepnarration)",
        tip: "Retheme a image based on a prompt.",
        healthcheck: deepnarration,
    },
    {
        type: markRaw(NodeInputImage),
        color: NODE_CONSTANT,
        name: "Image File",
        tip: "Load a image file from your computer!"
    },
    {
        type: markRaw(NodeDisplayImage),
        color: NODE_DISPLAY,
        name: "Show Image",
        tip: "Show the input image and pass it along, also allows you to trigger the flow."
    },
    {
        divider: true,
        type: markRaw(NodeLiteralUrl),
        color: NODE_CONSTANT,
        name: "Url",
        tip: "Constant url for a image"
    },
    {
        type: markRaw(NodeLoadImage),
        color: NODE_ACTION,
        name: "Load Image",
        tip: "Load image from a url"
    },
    {
        type: markRaw(NodeUploadImage),
        color: NODE_ACTION,
        name: "Upload Image",
        tip: "Upload image to imgbb.com as to get a url",
        healthcheck:
            async () => {
                let healthy = await $fetch("/api/imgbb_health");
                if (healthy) return undefined
                return "Missing IMGBB_TOKEN env var."
            }
    },
    {
        type: markRaw(NodeUrlToText),
        color: NODE_LOCAL,
        name: "Url To Text",
        tip: "Convert a url to text, this is simply a type cast."
    },
    {
        divider: true,
        type: markRaw(NodeTts),
        color: NODE_AI,
        name: "Tts",
        tip: "Convert text to spoken sound"
    },
    {
        type: markRaw(NodeDisplayAudio),
        color: NODE_DISPLAY,
        name: "Listen to Aduio",
        tip: "Lets you listen to your audio"
    },
    {
        type: markRaw(NodeDuration),
        color: NODE_LOCAL,
        name: "Aduio Duration",
        tip: "Get duration of aduio in seconds"
    },
    {
        divider: true,
        type: markRaw(NodeImageToVideo),
        color: NODE_LOCAL,
        name: "Static Video",
        tip: "Generate a video of a static image"
    },
    {
        type: markRaw(NodeCombineVideo),
        color: NODE_LOCAL,
        name: "Chain Video",
        tip: "Chain together two videos"
    },
    {
        type: markRaw(NodeEmptyVideo),
        color: NODE_CONSTANT,
        name: "Empty Video",
        tip: "A empty video, usefull as the init value of a fold."
    },
    {
        type: markRaw(NodeAddAudio),
        color: NODE_LOCAL,
        name: "Add audio",
        tip: "Add audio to a video"
    },
    {
        type: markRaw(NodeDisplayVideo),
        color: NODE_DISPLAY,
        name: "Watch Video",
        tip: "Watch your video"
    },
    {
        divider: true,
        type: markRaw(NodeLiteralNumber),
        color: NODE_CONSTANT,
        name: "Number",
        tip: "Constant number"
    },
    {
        type: markRaw(NodeMath),
        color: NODE_LOCAL,
        name: "Math",
        tip: "Evaluate any js expression with 'x' being your input"
    },
    {
        divider: true,
        type: markRaw(NodeDiscordWebhook),
        color: NODE_ACTION,
        name: "Discord Webhook",
        tip: "Send a discord webhook with your results."
    },
    {
        divider: true,
        type: markRaw(NodeRouter),
        color: NODE_CONTROL_FLOW,
        name: "Route",
        tip: "Route your connections for a nicer graph!"
    },
    {
        type: markRaw(NodeRepeat),
        color: NODE_CONTROL_FLOW,
        name: "Repeat",
        tip: "Repeat a action on a set of values."
    },
    {
        type: markRaw(NodeRepeatEnd),
        color: NODE_CONTROL_FLOW,
        name: "Repeat End",
        tip: "Second half of the Repeat construct"
    },
]

