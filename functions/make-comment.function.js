const conflictMessage = require("../languages/conflict.js");

module.exports = async (context, commentType) => {
    console.log(`## MAKING A COMMENT FUNCTION ## | ${commentType}`);
    context.logMe(
        context,
        `${commentType} Comment`,
        `A \`${commentType}\` message was left on [this PR](${context.payload.pull_request.html_url})`,
        4886754
    );
    if (commentType === "conflict") conflictMessage(context);
};
