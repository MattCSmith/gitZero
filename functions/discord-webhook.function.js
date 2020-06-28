const axios = require("axios");

module.exports = async (data) => {
    const { title, desc, color } = data;

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
