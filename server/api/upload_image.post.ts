export default defineEventHandler(async (event) => {
    const body = await readFormData(event)
    let file = body.get("file")!;

    let token: string = process.env.IMGBB_TOKEN!;

    let formData = new FormData();
    formData.append("image", file);
    let response: any = await $fetch(`https://api.imgbb.com/1/upload?expiration=3600&key=${token}`, {
        method: "POST",
        body: formData
    })

    let url: string = response.data.url;
    console.log(url);

    return url;
})
