const discordWebhook = require("./discord-webhook.function");

module.exports = async (context, title, desc, color) => {
    const action = context.action ? context.action : "Unknown";
    discordWebhook({
        title: title,
        desc: desc,
        color: color,
        footer: `Triggered by: ${action}`,
    });

    context.log(`${title} | ${desc}`);
};
