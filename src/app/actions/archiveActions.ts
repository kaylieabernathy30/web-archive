// @ts-nocheck 
'use server';

import { assessArchiveCompleteness, type AssessArchiveCompletenessOutput } from '@/ai/flows/assess-archive-completeness';
import { z } from 'zod';
import { archiveWebsite } from '@/lib/playwrightArchive'; // Import the archiving function
import * as path from 'path';

const ArchiveInputSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)." }),
});

export interface ArchiveState {
  message?: string;
  error?: string;
  crawledPages?: string[];
  brokenLinks?: string[];
  archivePath?: string; 
  completeness?: AssessArchiveCompletenessOutput;
  status: 'idle' | 'processing' | 'success' | 'error';
  formKey?: string; // To reset form on success/error
}

export async function archiveWebsiteAction(_prevState: ArchiveState, formData: FormData): Promise<ArchiveState> {
  const validatedFields = ArchiveInputSchema.safeParse({
    url: formData.get('url'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      error: validatedFields.error.flatten().fieldErrors.url?.join(', ') || 'Invalid input.',
      formKey: Date.now().toString(),
    };
  }

  const { url } = validatedFields.data;
  let normalizedUrl = url;
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = `https://${normalizedUrl}`;
  }
  
  try {
    const urlObject = new URL(normalizedUrl);
    const timestamp = Date.now();
    const archivePath = path.join(process.cwd(), `archives/${urlObject.hostname}/${timestamp}`);

    // Use the actual Playwright archiving logic
    const { crawledPages, brokenLinks } = await archiveWebsite(normalizedUrl, archivePath);

    // Simulate AI completeness check (keep this part)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500)); 
    let completenessReport: AssessArchiveCompletenessOutput | undefined;
    try {
      completenessReport = await assessArchiveCompleteness({
        originalUrl: urlObject.toString(),
        archiveLocation: archivePath, // Use the actual archive path
      });
    } catch (aiError) {
      console.error("AI completeness check failed:", aiError);
      // Proceed with a successful archive but note the AI check failure.
      return {
        status: 'success', 
        message: 'Website archiving complete. AI completeness check failed.',
        crawledPages: crawledPages, // Use actual crawled pages
        brokenLinks: brokenLinks, // Use actual broken links
        archivePath: archivePath,
        completeness: {
          completenessReport: `AI check failed: ${aiError instanceof Error ? aiError.message : String(aiError)}`,
          isComplete: false, // Mark as not complete if AI fails
        },
        formKey: Date.now().toString(),
      };
    }

    return {
      status: 'success',
      message: 'Website archiving process completed successfully.',
      crawledPages: crawledPages, // Use actual crawled pages
      brokenLinks: brokenLinks, // Use actual broken links
      archivePath: archivePath,
      completeness: completenessReport,
      formKey: Date.now().toString(),
    };

  } catch (e) {
    // Catch errors from URL parsing or other synchronous issues, or from archiveWebsite
    const error = e instanceof Error ? e.message : "An unknown error occurred during the archiving process.";
     return {
      status: 'error',
      error: `Error processing URL ${normalizedUrl}: ${error}`,
      formKey: Date.now().toString(),
    };
  }
}
