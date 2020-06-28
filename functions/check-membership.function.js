module.exports = async (context) => {
    context.log("## CHECKING MEMBERSHIP FUNCTION ##");

    const details = {
        username: context.payload.pull_request.user.login,
        org: context.payload.organization.login,
    };

    context.github.orgs
        .getMembership(details)
        .then((res) =>
            context.logMe(
                context,
                "Already A Member",
                `${res.data.user.login}'s membership is: ${res.data.state}, holding the role: ${res.data.role}`,
                14519040
            )
        )

        .catch((err) => {
            context.logMe(
                context,
                "Sending Invitation",
                `An invitation has been sent to ${details.username}!`,
                10511875
            );
            context.github.orgs.addOrUpdateMembership(details);
            const issueComment = context.issue({
                body:
                    "# 🥳 Congratulations 🎉\n" +
                    "Congrats on making your first Pull Request in the Zero To Mastery Organization!\n" +
                    "You have been sent an invitation to join the ZTM github organization, please check your emails for further details!\n\n" +
                    "### **ZTM Profile Badge** \nIf you'd like the ZTM Badge to show up on your profile, you will need to [follow this guide](https://help.github.com/en/github/setting-up-and-managing-your-github-user-account/publicizing-or-hiding-organization-membership)!",
            });
            return context.github.issues.createComment(issueComment);
        });
};
