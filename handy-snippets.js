const owner = "zeroDevs",
    repo = "GithubBot-Testing",
    path = "test",
    message = "testing",
    content = btoa("HEY"),
    committerName = "",
    committerEmail = "",
    authorName = "",
    authorEmail = "";

context.github.repos.createOrUpdateFile({
    owner,
    repo,
    path,
    message,
    content,
    committerName,
    committerEmail,
    authorName,
    authorEmail,
});
