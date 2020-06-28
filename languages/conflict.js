module.exports = async (context) => {
    const issueComment = context.issue({
        body:
            "## ⚠️ **MERGE CONFLICT DETECTED!** \n" +
            `@${context.data.user.login} A possible conflict has been detected, you will need to resolve this before your pull request can be merged. The most common reason conflicts occur, is when the contributor does not run \`git pull origin master\` before pushing their new changes. \n\nBefore we can merge the code, you will need to resolve the conflict, there are tons of guides on Google and Youtube to help you out. If you get stuck ask over on Discord.`,
    });

    return context.github.issues.createComment(issueComment);
};
