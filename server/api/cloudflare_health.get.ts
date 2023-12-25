export default defineEventHandler(async (_event) => {
    let account_id = process.env.CLOUDFLARE_ACCOUNT;
    let token_ai = process.env.CLOUDFLARE_AI_TOKEN;

    return account_id !== undefined && token_ai !== undefined;
})
