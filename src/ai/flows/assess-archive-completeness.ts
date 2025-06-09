'use server';

/**
 * @fileOverview Uses generative AI to assess the completeness of a saved website archive.
 *
 * - assessArchiveCompleteness - A function that assesses the completeness of a website archive.
 * - AssessArchiveCompletenessInput - The input type for the assessArchiveCompleteness function.
 * - AssessArchiveCompletenessOutput - The return type for the assessArchiveCompleteness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessArchiveCompletenessInputSchema = z.object({
  originalUrl: z.string().describe('The URL of the original website.'),
  archiveLocation: z.string().describe('The local directory where the website archive is saved.'),
});
export type AssessArchiveCompletenessInput = z.infer<typeof AssessArchiveCompletenessInputSchema>;

const AssessArchiveCompletenessOutputSchema = z.object({
  completenessReport: z.string().describe('A report detailing any missing resources, layout discrepancies, or functional errors found in the archive.'),
  isComplete: z.boolean().describe('A boolean value indicating whether the archive is considered complete based on the analysis.'),
});
export type AssessArchiveCompletenessOutput = z.infer<typeof AssessArchiveCompletenessOutputSchema>;

export async function assessArchiveCompleteness(input: AssessArchiveCompletenessInput): Promise<AssessArchiveCompletenessOutput> {
  return assessArchiveCompletenessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessArchiveCompletenessPrompt',
  input: {schema: AssessArchiveCompletenessInputSchema},
  output: {schema: AssessArchiveCompletenessOutputSchema},
  prompt: `You are an expert web archive quality assurance engineer.

You are provided with the URL of the original website and the location of the saved website archive.
Your task is to assess the completeness of the saved archive by comparing it to the original website and identifying any missing resources, layout discrepancies, or functional errors.

Original Website URL: {{{originalUrl}}}
Archive Location: {{{archiveLocation}}}

Based on your analysis, provide a detailed completeness report and indicate whether the archive is considered complete.
Make sure to set the isComplete output field appropriately.

Include specific information about:
- Missing images, stylesheets, or scripts.
- Layout differences between the original and archived website.
- Any broken links or functionality in the archived website.
`,
});

const assessArchiveCompletenessFlow = ai.defineFlow(
  {
    name: 'assessArchiveCompletenessFlow',
    inputSchema: AssessArchiveCompletenessInputSchema,
    outputSchema: AssessArchiveCompletenessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
