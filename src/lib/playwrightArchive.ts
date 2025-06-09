import { chromium } from 'playwright';
import * as fs from 'fs/promises';
import * as path from 'path';

export async function archiveWebsite(url: string, savePath: string): Promise<{ crawledPages: string[], brokenLinks: string[] }> {
  let browser;
  const crawledPages: string[] = [];
  const brokenLinks: string[] = [];

  try {
    browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the page
    const response = await page.goto(url, { waitUntil: 'networkidle' });

    if (!response || !response.ok()) {
      console.error(`Failed to load URL: ${url}`);
      brokenLinks.push(url);
      return { crawledPages, brokenLinks };
    }

    crawledPages.push(url);

    // Create directory for saving
    await fs.mkdir(savePath, { recursive: true });

    // Save the main HTML content
    const htmlContent = await page.content();
    const htmlFilePath = path.join(savePath, 'index.html');
    await fs.writeFile(htmlFilePath, htmlContent);

    console.log(`Saved ${url} to ${htmlFilePath}`);

    // TODO: Implement logic to find and save resources (CSS, JS, images)
    // TODO: Implement logic to rewrite URLs in the saved HTML

  } catch (error) {
    console.error(`Error archiving ${url}:`, error);
    brokenLinks.push(url);
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return { crawledPages, brokenLinks };
}
