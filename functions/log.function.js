const discordWebhook = require("./discord-webhook.function");

module.exports = async (context, title, desc, color) => {
    const event = context.event ? context.event : "Unknown";
    const action = context.payload.action ? context.payload.action : "Unknown";
    discordWebhook({
        title: title,
        desc: desc,
        color: color,
        footer: `Triggered by ➡️ Event: ${event} | Action: ${action}`,
    });

    context.log(`${title} | ${desc}`);
};
