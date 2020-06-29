module.exports = async (context, prObject, autoMergeChecks) => {
    const issueComment = context.issue({
        body:
            `🙏 Thanks for your pull request @${prObject.data.user.login}, The team will now review and merge this request. In the mean time why not check out some of the other opensource projects available, contributions are greatly appreciated!\n\n` +
            `Some of the most popular are \n- [Student Resources](https://github.com/zero-to-mastery/resources) \n- [ZTM Job Board](https://github.com/zero-to-mastery/ZtM-Job-Board) \n- [Complete Web Developer Manual](https://github.com/zero-to-mastery/complete-web-developer-manual)\n\n` +
            "--- \n### PR Statistics \n" +
            `| #️⃣ **PR Number:** | ➕ **Line Additions:** |🗑️ **Line Deletions:** |\n` +
            `| :---: | :---: | :---: | \n` +
            `| ${prObject.data.number} |  ${autoMergeChecks.additions} | ${autoMergeChecks.deletions} | \n\n` +
            `| 📑 **Files Changed:** |   ⭐ **Repo Stars:**   | 🔱 **Total Forks:** |\n` +
            `| :---: | :---: | :---: |\n` +
            `| ${autoMergeChecks.fileCount} | ${prObject.data.base.repo.stargazers_count} | ${prObject.data.base.repo.forks} | `,
    });

    return context.github.issues.createComment(issueComment);
};
