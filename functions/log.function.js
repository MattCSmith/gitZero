const discordWebhook = require("./discord-webhook.function");

module.exports = async (context, title, desc, color) => {
    discordWebhook({
        title: title,
        desc: desc,
        color: color,
    });

    context.log(`${title} | ${desc}`);
};
