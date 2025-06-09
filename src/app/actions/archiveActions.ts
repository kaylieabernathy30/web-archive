// @ts-nocheck 
'use server';

import { assessArchiveCompleteness, type AssessArchiveCompletenessOutput } from '@/ai/flows/assess-archive-completeness';
import { z } from 'zod';

// IMPORTANT: The actual Playwright crawling logic is complex and not implemented here.
// This is a simulation. In a real application, you would integrate Playwright
// to perform the BFS crawl, download resources, and manage files.

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

// initialArchiveState is removed from here

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
    // Validate if URL is reachable (basic check)
    // In a real scenario, Playwright would handle this more robustly
    const urlObject = new URL(normalizedUrl);

    // Simulate crawling (replace with actual Playwright logic)
    // This simulation includes delays to mimic real processing time.
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000)); 
    
    const mockCrawledPages = [
      `${urlObject.origin}/`,
      `${urlObject.origin}/about`,
      `${urlObject.origin}/contact`,
      `${urlObject.origin}/products/item1`,
      `${urlObject.origin}/blog/post-example`,
      `${urlObject.origin}/terms-of-service`,
    ];
    const mockBrokenLinks = [
      `${urlObject.origin}/non-existent-page`,
      `${urlObject.origin}/another-broken-link.php`,
      `${urlObject.origin}/old-feature/removed.html`,
    ];
    const simulatedArchivePath = `/server/archives/${urlObject.hostname}/${Date.now()}`;

    // Simulate AI completeness check
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1500)); 
    let completenessReport: AssessArchiveCompletenessOutput | undefined;
    try {
      // Ensure the AI can handle potentially "fake" paths for simulation.
      // The AI prompt implies it understands what 'archiveLocation' means conceptually.
      completenessReport = await assessArchiveCompleteness({
        originalUrl: urlObject.toString(),
        archiveLocation: simulatedArchivePath, // This path is on the server conceptually
      });
    } catch (aiError) {
      console.error("AI completeness check failed:", aiError);
      // Proceed with a successful archive but note the AI check failure.
      return {
        status: 'success', // Still success because crawling part (simulated) finished
        message: 'Website archiving (simulated) complete. AI completeness check failed.',
        crawledPages: mockCrawledPages,
        brokenLinks: mockBrokenLinks,
        archivePath: simulatedArchivePath,
        completeness: {
          completenessReport: `AI check failed: ${aiError instanceof Error ? aiError.message : String(aiError)}`,
          isComplete: false, // Mark as not complete if AI fails
        },
        formKey: Date.now().toString(),
      };
    }

    return {
      status: 'success',
      message: 'Website archiving process completed successfully (simulated).',
      crawledPages: mockCrawledPages,
      brokenLinks: mockBrokenLinks,
      archivePath: simulatedArchivePath,
      completeness: completenessReport,
      formKey: Date.now().toString(),
    };

  } catch (e) {
    // Catch errors from URL parsing or other synchronous issues
    const error = e instanceof Error ? e.message : "An unknown error occurred during URL processing.";
     return {
      status: 'error',
      error: `Error processing URL ${normalizedUrl}: ${error}`,
      formKey: Date.now().toString(),
    };
  }
}
