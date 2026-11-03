import test from 'node:test';
import assert from 'node:assert/strict';
import {mainHash, validateMarker, validatePage} from './verify-release.mjs';
const article = '<link rel="canonical" href="https://barefootopiniones.com/es-lejan-fiable/"><main><h1>Artículo aprobado</h1><p>Contenido.</p></main>';
test('rejects a stale revision even when the endpoint is successful', () => {
 assert.throws(() => validateMarker({commit: 'a'.repeat(40)}, 'b'.repeat(40)));
 validateMarker({commit: 'a'.repeat(40)}, 'a'.repeat(40));
});
test('rejects a homepage fallback at an article URL', () => {
 assert.throws(() => validatePage(article.replace('/es-lejan-fiable/', '/'), article, '/es-lejan-fiable/'));
});
test('rejects a matching canonical with incorrect article content', () => {
 assert.throws(() => validatePage(article.replace('Contenido.', 'Otra revisión.'), article, '/es-lejan-fiable/'));
 validatePage(article, article, '/es-lejan-fiable/');
});
test('ignores whitespace compression but requires main content', () => {
 assert.equal(mainHash('<main>one  two</main>'), mainHash('<main>one two</main>'));
 assert.throws(() => mainHash('<h1>error page</h1>'));
});
