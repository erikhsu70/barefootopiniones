import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

const origin = 'https://barefootopiniones.com';
const markerPath = '/.well-known/pbns-release.json';
export function mainHash(html) {
  const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)?.[0];
  assert.ok(main, 'Missing main content');
  return createHash('sha256').update(main.replace(/\s+/g, ' ').trim()).digest('hex');
}
export function validateMarker(actual, expected) {
  assert.match(expected, /^[a-f0-9]{40}$/);
  assert.equal(actual.commit, expected, 'Production is serving another revision');
}
export function validatePage(actual, expected, route) {
  const canonical = actual.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1];
  assert.equal(canonical, origin + route, 'Wrong canonical or homepage fallback');
  assert.equal(mainHash(actual), mainHash(expected), 'Production content differs from the build');
}
export async function verify(commit, directory = 'dist', request = fetch) {
  const get = async route => {
    const response = await request(origin + route, {cache: 'no-store', signal: AbortSignal.timeout(20000)});
    assert.equal(response.status, 200, route + ' is not HTTP 200');
    return response;
  };
  validateMarker(await (await get(markerPath + '?revision=' + commit)).json(), commit);
  // These cover the index, an approved article, and the sitemap used by that article.
  for (const route of ['/', '/es-lejan-fiable/']) {
    const expected = fs.readFileSync(path.join(directory, route, 'index.html'), 'utf8');
    validatePage(await (await get(route)).text(), expected, route);
  }
  const sitemap = await (await get('/current-sitemap.xml')).text();
  assert.ok(sitemap.includes(origin + '/es-lejan-fiable/'), 'Article is absent from the production sitemap');
  return {commit, origin, state: 'live_verified', checkedAt: new Date().toISOString(), checks: ['exact revision marker', 'homepage content', 'Lejan article content and canonical', 'article sitemap']};
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const commit = process.env.GITHUB_SHA;
  assert.match(commit ?? '', /^[a-f0-9]{40}$/, 'GITHUB_SHA must be an exact source commit');
  if (process.argv[2] === 'stamp') {
    fs.mkdirSync('dist/.well-known', {recursive: true});
    fs.writeFileSync('dist' + markerPath, JSON.stringify({commit}) + '\n');
  } else if (process.argv[2] === 'verify') {
    let receipt, error;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {receipt = await verify(commit); break;} catch (e) {error = e; if (attempt < 5) await new Promise(resolve => setTimeout(resolve, 10000));}
    }
    fs.writeFileSync('release-verification.json', JSON.stringify(receipt ?? {commit, state: 'verification_failed', error: error.message, checkedAt: new Date().toISOString()}, null, 2) + '\n');
    if (!receipt) throw error;
    console.log('Verified live revision ' + commit);
  } else throw Error('Use stamp or verify');
}
