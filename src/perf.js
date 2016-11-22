import Router from 'koa-router';
import GitHubApi from 'github';

export const router = new Router();
const gh = new GitHubApi();

gh.authenticate({
  type: 'oauth',
  token: '0d762cbc855c11db20a0e410a5a13c928a1d2ef3',
  headers: {
    Accept: 'application/vnd.github.v3.raw',
  },
});

router

  .get('/e10s/hangs', async (ctx) => {
    const beta = await gh.repos.getContent({
      owner: 'mozilla',
      repo: 'e10s_analyses',
      path: '',
    });
    const tree = (await gh.gitdata.getTree({
      owner: 'mozilla',
      repo: 'e10s_analyses',
      sha: beta.find(({ path }) => path === 'beta').sha,
      recursive: 1,
    })).tree.filter(({ path }) => {
      return /e10s_experiment\.ipynb/.test(path);
    });
    const blobs = await Promise.all(
      tree.map(({ sha }) => {
        return gh.gitdata.getBlob({
          owner: 'mozilla',
          repo: 'e10s_analyses',
          sha: sha,
        });
      }),
    );

    // const commits = await Promise.all(
    //   tree.map(({ path }) => {
    //     return gh.repos.getCommits({
    //       owner: 'mozilla',
    //       repo: 'e10s_analyses',
    //       path: `beta/${path}`,
    //     });
    //   })
    // );

    const hangs = blobs
      .map((blob, idx) => {
        const re = /Median difference in hangs over 100ms per minute \(parent\)[^(]+\(([^)]+)/;
        const str = Buffer.from(blob.content, 'base64').toString('utf8');
        const bits = str.match(re);
        const path = tree[idx].path;
        if (bits) {
          return [path].concat(bits[1].split(', ').map(Number));
        }
        return null;
      })
      .filter(data => data);

    ctx.body = hangs;
  });
