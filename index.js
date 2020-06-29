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

    // When a Repo is Created
    // app.on("repository.created", async (context) => {
    //     const team = await context.github.teams.getByName({
    //         org: "zeroDevs",
    //         team_slug: "Test",
    //     });
    //     console.log(team);
    //     try {
    //         context.github.teams.addOrUpdateRepo({
    //             team_id: 3784195,
    //             owner: "zeroDevs",
    //             repo: "Test",
    //             permission: "pull",
    //         });
    //     } catch (error) {
    //         console.log;
    //     }

    //     // console.log(context.github, context.repo());
    //     // return OpenIssueOnRepoCreation.analyze(context.github, context.repo(), context.payload, robot.log)
    // });
};
