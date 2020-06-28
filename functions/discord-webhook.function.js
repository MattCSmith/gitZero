const axios = require("axios");

module.exports = async (data) => {
    const { title, desc, color } = data;

    axios
        .post(
            "https://discordapp.com/api/webhooks/719734752319373383/7qLEXYgd9w42ejbST4efbm1nKbSukpqf19tL3ze17rEywc9maVgZ--yYrqioqBQUGt5D",
            {
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
            }
        )
        .then((result) => {
            console.log(`SUCCESSFULLY SENT DISCORD WEBHOOK | "${title}"`);
        })
        .catch((err) => {
            console.log(`DISCORD WEBHOOK ERROR | ${err} | Title: ${title}`);
        });
};
