export default defineEventHandler(async (event) => {
    let body = await readBody(event);
    let token = process.env.STABLE_TOKEN;

    let response: any = await $fetch("https://modelslab.com/api/v3/text2img", {
        method: "POST",
        body: {
            key: token,
            prompt: body.prompt,
        }
    });

    console.log(response);

    return response.output[0];
})
