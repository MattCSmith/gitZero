const makeComment = require("../functions/make-comment.function");
const addLabel = require("../functions/add-label.function");

module.exports = async (context) => {
    context.log("## CONFLICT CHECKING ##");

    await new Promise((resolve) => setTimeout(resolve, 5000));

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //                    REFETCH THE PULLREQUEST                    //
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // This will ensure we have the latest pr data
    // Often the mergeability key will be null on first call.
    const prObject = await context.github.pulls
        .get(context.issue())
        .then((data) => {
            return data;
        });

    // await new Promise((resolve) => setTimeout(resolve, 5000));

    // Extract labels names from their objects
    const labelsArray = context.payload.pull_request.labels;
    const labelNames = labelsArray.map((label) => label.name);

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //                    TEST IF CONFLICT FREE!                     //
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // If a the mergeable key is fale, we should infrom the user on
    // how to resolve the issue and add a Conflict label.
    context.log("MERGABLE", prObject.data.mergeable);
    if (prObject.data.mergeable === false) {
        addLabel(context, "Conflict Present");
        makeComment(context, "conflict");
    } else if (prObject.data.mergeable === null) {
        context.logMe(
            context,
            "MERGABLE STATE UNKNOWN",
            `The state of [this PR](${context.payload.pull_request.html_url}) is unknown!`,
            10028130
        );
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //                  IF PULL REQ CONFLICT FREE                    //
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // If the PR is mergable we should remove the conflict label and
    // on certain repos, auto merge
    else {
        // Removing a label will trigger an unlabel action causing this to double run

        if (context.payload.action !== "unlabeled") {
            if (labelNames.includes("Conflict Present")) {
                context.github.issues.removeLabel(
                    context.issue({
                        name: "Conflict Present",
                    })
                );
                context.logMe(
                    context,
                    "REMOVING LABEL",
                    `The \`Conflict Present\` label is being removed [this PR](${context.payload.pull_request.html_url})`,
                    10028130
                );
            }
        }

        // We only want to auto merge on the start here repo, return all others silently
        if (context.payload.repository.name !== "start-here-guidelines") return;

        // We now want to check a bunch of criteria, and comment any failures.

        // We need to fetch the files changed
        const filesChangedArray = await context.github.pulls
            .listFiles(context.issue())
            .then((data) => {
                return data;
            });

        const autoMergeChecks = {
            additions: prObject.data.additions,
            deletions: prObject.data.deletions,
            fileCount: filesChangedArray.data.length,
            fileNames: [],
            status: true,
        };

        await filesChangedArray.data.map((file) =>
            autoMergeChecks.fileNames.push(file.filename)
        );

        if (autoMergeChecks.additions > 2) autoMergeChecks.status = false;
        if (autoMergeChecks.deletions > 0) autoMergeChecks.status = false;
        if (autoMergeChecks.fileCount > 1) autoMergeChecks.status = false;
        if (!autoMergeChecks.fileNames.includes("CONTRIBUTORS.md"))
            autoMergeChecks.status = false;

        if (autoMergeChecks.status) {
            context.github.pulls.merge(context.issue());
            context.logMe(
                context,
                "Auto-Merged PR\n",
                `[This PR was successfully merged automatically!](${context.payload.pull_request.html_url}) \nAdditions: ${autoMergeChecks.additions} \nDeletions: ${autoMergeChecks.deletions} \nFile Count: ${autoMergeChecks.fileCount}, \nFile Names: ${autoMergeChecks.fileNames}`,
                56782
            );
        } else {
            // Check if the event action is "pr opened", since we only want to send the message when the PR was first opened

            context.logMe(
                context,
                "Unable To Auto-Merge PR\n",
                `[This PR did not pass the criteria to merged automatically!](${context.payload.pull_request.html_url}) \nAdditions: ${autoMergeChecks.additions} \nDeletions: ${autoMergeChecks.deletions} \nFile Count: ${autoMergeChecks.fileCount}, \nFile Names: ${autoMergeChecks.fileNames}`,
                14505216
            );
            if (context.action !== "opened") return;

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
        }
    }
};
