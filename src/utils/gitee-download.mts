import downloadUrl from 'download';
import gitclone from 'git-clone';

import fs from 'fs-extra';

export const DEFAULT_REPO = 'gitee';
export const DEFAULT_ORIGION = 'gitee.com';
export const DEFAULT_CHECKOUT = 'master';

/**
 * Normalize a repo string.
 *
 * @param {String} repo
 */

function normalize(repo: string) {
  let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/;
  let match = regex.exec(repo);

  if (match) {
    const url = match[2];
    let directCheckout = match[3] || DEFAULT_CHECKOUT;

    return { type: 'direct', url, checkout: directCheckout };
  } else {
    regex = /^(?:(github|gitlab|bitbucket|gitee):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/;
    match = regex.exec(repo);

    if (!match) return null;

    let type = match[1] || DEFAULT_REPO;
    let origin = match[2] || null;
    const owner = match[3];
    const name = match[4];
    let checkout = match[5] || DEFAULT_CHECKOUT;

    if (origin == null) {
      if (type === 'github') {
        origin = 'github.com';
      } else if (type === 'gitlab') {
        origin = 'gitlab.com';
      } else if (type === 'bitbucket') {
        origin = 'bitbucket.org';
      } else if (type === 'gitee') {
        origin = 'gitee.com';
      }
    }

    return { type, origin, owner, name, checkout };
  }
}

/**
 * Adds protocol to url in none specified
 * @param {String} url
 */

function addProtocol(origin: string, clone: boolean) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone) {
      origin = 'git@' + origin;
    } else {
      origin = 'https://' + origin;
    }
  }

  return origin;
}

/**
 * Return a zip or git url for a given `repo`.
 *
 * @param {Object} repo
 * @return {String}
 */

function getUrl(repo: any, clone: boolean) {
  let url: string = '';

  // Get origin with protocol and add trailing slash or colon (for ssh)
  let origin = addProtocol(repo.origin, clone);
  if (/^git@/i.test(origin)) {
    origin = origin + ':';
  } else {
    origin = origin + '/';
  }

  // Build url
  if (clone) {
    url = origin + repo.owner + '/' + repo.name + '.git';
  } else {
    if (repo.type === 'github') {
      url = origin + repo.owner + '/' + repo.name + '/archive/' + repo.checkout + '.zip';
    } else if (repo.type === 'gitlab') {
      url = origin + repo.owner + '/' + repo.name + '/repository/archive.zip?ref=' + repo.checkout;
    } else if (repo.type === 'bitbucket') {
      url = origin + repo.owner + '/' + repo.name + '/get/' + repo.checkout + '.zip';
    }
  }

  return url;
}

interface Opts {
  headers?: object;
  clone: boolean;
}

/**
 * @example
 * ```js
 * import giteeDownload from "gitee-download";
 * const repo = `gitee:cps-cli-template/git#master`;
 * const dest = "test/output";
 *
 * giteeDownload(repo, dest, { clone: true }).then(res => {
 *   console.log(res);
 * });
 * ```
 */
export function giteeDownload(
  repo: string,
  dest: string,
  opts: Opts = { clone: false, headers: {} }
): Promise<{ success: boolean; err?: any }> {
  return new Promise((resolve, reject) => {
    const repoInfo = normalize(repo);
    if (!repoInfo) return;

    const url = repo || getUrl(repo, opts.clone);

    if (opts.clone) {
      const cloneOptions = {
        checkout: repoInfo.checkout,
        shallow: false,
        ...opts,
      };

      gitclone(url, dest, cloneOptions, err => {
        fs.removeSync(dest + '/.git');

        if (err === undefined) {
          resolve({ success: true });
        } else {
          reject({ success: false, err });
        }
      });
    } else {
      const downloadOptions = {
        extract: true,
        strip: 1,
        mode: '666',
        ...opts,
        headers: {
          accept: 'application/zip',
          ...(opts.headers || {}),
        },
      };

      downloadUrl(url, dest, downloadOptions)
        .then(() => {
          resolve({ success: true });
        })
        .catch(err => {
          reject({ success: false, err });
        });
    }
  });
}

export default giteeDownload;
