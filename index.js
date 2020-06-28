const discordWebhook = require("./functions/discord-webhook.function");
const log = require("./functions/log.function");

module.exports = (app) => {
    log(app, "Bot Started", "GitZero is Loaded!", 2219264);

    // Pull Request Event
    app.on("pull_request", require("./events/pull_request.js").bind(app));

    // Open issue
    app.on("issues.opened", async (context) => {
        // const issueComment = context.issue({
        //     body: "Thanks for opening this issue!",
        // });
        // return context.github.issues.createComment(issueComment);
    });
};
