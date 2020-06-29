const axios = require("axios");

module.exports = async (data) => {
    const { title, desc, color, footer } = data;

    axios
        .post(process.env.DISCORD_WEBHOOK, {
            crossdomain: true,
            embeds: [
                {
                    title: title.toUpperCase(),
                    description: desc,
                    color: color,
                    thumbnail: {
                        url:
                            "https://github.githubassets.com/images/modules/logos_page/Octocat.png",
                    },
                    footer: {
                        text: footer,
                    },
                },
            ],
        })
        .then((result) => {
            console.log(`SUCCESSFULLY SENT DISCORD WEBHOOK | "${title}"`);
        })
        .catch((err) => {
            console.log(`DISCORD WEBHOOK ERROR | ${err} | Title: ${title}`);
        });
};
