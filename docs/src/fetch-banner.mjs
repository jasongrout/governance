/**
 * Fetch the Jupyter-wide announcement banner from jupyter.org.
 *
 * The banner is managed centrally in the jupyter.org repository so that a
 * single pull request there updates the banner across subscribing Jupyter
 * sites. See:
 * https://github.com/jupyter/jupyter.github.io#site-wide-announcement-banner
 *
 * This script writes the banner content to _site/banner.md, which myst.yml
 * uses as the site banner part. If the banner is empty or cannot be fetched,
 * an empty file is written so the build still succeeds and no banner is shown.
 */
import fs from 'fs';
import path from 'path';

const BANNER_URL = 'https://jupyter.org/assets/banner.html';
const OUTPUT_FILE = path.join(process.cwd(), '_site', 'banner.md');

let banner = '';
try {
  const response = await fetch(BANNER_URL, { signal: AbortSignal.timeout(30000) });
  if (response.ok) {
    banner = (await response.text()).trim();
  } else {
    console.warn(`Warning: could not fetch banner from ${BANNER_URL}: HTTP ${response.status}`);
  }
} catch (error) {
  console.warn(`Warning: could not fetch banner from ${BANNER_URL}: ${error.message}`);
}

fs.writeFileSync(OUTPUT_FILE, banner ? `${banner}\n` : '', 'utf8');
console.log(
  banner
    ? `Wrote banner content to ${OUTPUT_FILE}`
    : `No banner content; wrote empty ${OUTPUT_FILE}`
);
