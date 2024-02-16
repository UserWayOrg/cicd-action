import * as github from "@actions/github";

function findEmail(text: string): string | undefined {
  let position = text.indexOf('"email":"');

  while (position >= 0) {
    let email = text.substring(
      position + 9,
      position + 9 + text.substring(position + 9).indexOf('"')
    );

    if (email.indexOf("users.noreply.github.com") >= 0) {
      text = text.substring(position + 9);
      position = text.indexOf('"email":"');
    } else {
      return email;
    }
  }
}

export async function fetchEmail(
  githubToken: string,
  contributorName: string
): Promise<string | undefined> {
  const octokit = github.getOctokit(githubToken);

  const { data: user } = await octokit.rest.users.getByUsername({
    username: contributorName,
  });

  if (user.email) {
    return user.email;
  }

  const { data } = await octokit.rest.activity.listPublicEventsForUser({
    username: contributorName,
  });

  return findEmail(JSON.stringify(data));
}
