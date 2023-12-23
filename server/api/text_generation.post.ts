import pRetry from "p-retry"

const SYSTEM_PROMPT = "You are a text generator node in a ai graph system, so keep your answers short and usable for chaining into other stuff."
const MODEL = "@cf/mistral/mistral-7b-instruct-v0.1"

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const system: string = body.system ?? SYSTEM_PROMPT;
    const prompt: string = body.prompt;

    let account_id: string = process.env.CLOUDFLARE_ACCOUNT!;
    let token: string = process.env.CLOUDFLARE_AI_TOKEN!;

    let response: { result: { response: string } } = await pRetry(() => $fetch(
        `https://api.cloudflare.com/client/v4/accounts/${account_id}/ai/run/${MODEL}`,
        {
            "method": "POST",
            "headers": {
                "Authorization": `Bearer ${token}`,
            },
            body: {
                messages: [
                    { role: "system", content: system },
                    { role: "system", content: `I like the number: ${Math.random()}` },
                    { role: "system", content: `You look like a: ${Math.random() * 1000}` },
                    { role: "system", content: `Try to answer more like: ${Math.random() * 45}` },
                    { role: "user", content: prompt }
                ]
            }
        }
    ), { retries: 5 });
    console.log(response);
    return response.result.response;
})
