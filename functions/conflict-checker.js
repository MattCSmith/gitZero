const makeComment = require("../functions/make-comment.function");
const addLabel = require("../functions/add-label.function");
const prSuccess = require("../languages/thanks-for-the-pr");

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
    } else if (
        prObject.data.mergeable === null &&
        context.payload.action !== "labelled"
    ) {
        context.logMe(
            context,
            "MERGABLE STATE UNKNOWN",
            `The state of [this PR](${context.payload.pull_request.html_url}) is unknown!`,
            10028130
        );
    } else if (
        prObject.data.mergeable === null &&
        context.payload.action === "labelled"
    ) {
        context.logMe(
            context,
            "STALE LABELLED - MERGABLE STATE UNKNOWN",
            `The state of [this PR](${context.payload.pull_request.html_url}) is unknown!`,
            10028130
        );
    }

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    //                  IF PULL REQ CONFLICT FREE                    //
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ //
    // If the PR is mergable we should:
    //  1. Remove the conflict label
    //  3. Thank the user for their PR & Offer next steps
    //  2. Auto Merge PR, If criteria is met
    else {
        // 1. Lets remove the Conflict Label if one is present
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

        // Lets prevent certain actions from triggering the messages below.
        // We only really want to auto merge and send messages on
        // Syncronize || Open action events
        if (context.payload.action === "unlabelled") return;

        // 2. Check if we should auto merge
        // The criteria is:
        //  - No More than 3 line additions
        //  - No more than 1 line deletion
        //  - No more than 1 file can be changed
        //  - Files changed must be in the whitelist
        //  - Repo must be whitelisted

        // We need to fetch the files changed
        const filesChangedArray = await context.github.pulls
            .listFiles(context.issue())
            .then((data) => {
                return data;
            });

        // Create an object for the criteria and results
        const autoMergeChecks = {
            additions: prObject.data.additions,
            deletions: prObject.data.deletions,
            fileCount: filesChangedArray.data.length,
            repo: context.payload.repository.name,
            fileNames: [],
            status: true,
        };

        // Map out the file names and add them to the criteria Obj
        await filesChangedArray.data.map((file) =>
            autoMergeChecks.fileNames.push(file.filename)
        );

        // Run the criteria Checks
        if (autoMergeChecks.additions > 3) autoMergeChecks.status = false;
        if (autoMergeChecks.deletions > 1) autoMergeChecks.status = false;
        if (autoMergeChecks.fileCount > 1) autoMergeChecks.status = false;
        if (!autoMergeChecks.fileNames.includes("CONTRIBUTORS.md"))
            autoMergeChecks.status = false;
        if (!autoMergeChecks.repo.includes("start-here-guidelines"))
            autoMergeChecks.status = false;

        // If the checks pass, Log it and merge it
        if (autoMergeChecks.status) {
            context.github.pulls.merge(context.issue());
            context.logMe(
                context,
                `Auto-Merged PR #${context.payload.number}\n`,
                `[This PR was successfully merged automatically!](${context.payload.pull_request.html_url}) \n**Repo:** \` ${context.payload.pull_request.head.repo.name} \` \n**PR Title:** \` ${context.payload.pull_request.tile} \` \n**Additions:** \` ${autoMergeChecks.additions} \` | **Deletions:** \` ${autoMergeChecks.deletions} \` | **File Count:** \` ${autoMergeChecks.fileCount} \`, \n**File Names:** \` ${autoMergeChecks.fileNames} \` `,
                56782
            );
        } else {
            // Otherwise Log when a pull request cant be merged automatically
            context.logMe(
                context,
                `Unable To Auto-Merge PR #${context.payload.number}\n`,
                `[This PR did not pass the criteria to merged automatically!](${context.payload.pull_request.html_url}) \n**Repo:** \` ${context.payload.pull_request.head.repo.name} \` \n**PR Title:** \` ${context.payload.pull_request.tile} \` \n**Additions:** \` ${autoMergeChecks.additions} \` | **Deletions:** \` ${autoMergeChecks.deletions} \` | **File Count:** \` ${autoMergeChecks.fileCount} \`, \n**File Names:** \` ${autoMergeChecks.fileNames} \` `,
                14505216
            );
        }

        // 3. Thank the user for their PR and provide options
        prSuccess(context, prObject, autoMergeChecks);
    }
};
