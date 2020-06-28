module.exports = async (context, labelName) => {
    context.logMe(
        context,
        "ADDING LABEL",
        `The \`${labelName}\` label is being applied to [this PR](${context.payload.pull_request.html_url})`,
        14483595
    );

    const params = context.issue({ labels: [labelName] });
    params.issue_number = params.number;
    delete params["number"];

    context.github.issues.addLabels(params);
};
