import pRetry from "p-retry";

const MODEL = "@cf/stabilityai/stable-diffusion-xl-base-1.0"

export default defineEventHandler(async (event) => {
    console.log("READING BODY?")
    const body = await readBody(event)
    const prompt: string = body.prompt;

    let account_id: string = process.env.CLOUDFLARE_ACCOUNT!;
    let token_ai: string = process.env.CLOUDFLARE_AI_TOKEN!;

    console.log("DOING AI")
    let ai_response: Blob = await pRetry(() => $fetch(
        `https://api.cloudflare.com/client/v4/accounts/${account_id}/ai/run/${MODEL}`,
        {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${token_ai}`,
            },
            body: {
                prompt
            }
        }
    ), { retries: 5 });

    return ai_response;
})
