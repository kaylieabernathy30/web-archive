// @ts-nocheck 
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ExternalLink } from "lucide-react";

interface ErrorReportProps {
  brokenLinks?: string[];
}

export function ErrorReport({ brokenLinks }: ErrorReportProps) {
  if (!brokenLinks || brokenLinks.length === 0) {
    return (
        <Alert variant="default" className="border-accent bg-accent/10">
            <CheckCircle2 className="h-5 w-5 text-accent"/>
            <AlertTitle className="font-semibold text-accent">No Broken Links Found</AlertTitle>
            <AlertDescription>
                The simulated crawl did not find any broken links.
            </AlertDescription>
        </Alert>
    );
  }

  return (
    <Alert variant="destructive" className="shadow">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="font-semibold">Broken Links Found</AlertTitle>
      <AlertDescription>
        <p className="mb-2">The following links could not be accessed during the archiving process. They may be missing or incorrect:</p>
        <ul className="list-disc list-inside space-y-1 text-sm max-h-32 overflow-y-auto bg-destructive/10 p-2 rounded">
          {brokenLinks.map((link, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="truncate mr-2">{link}</span>
              <a href={link} target="_blank" rel="noopener noreferrer" title="Try opening link" className="text-destructive-foreground/70 hover:text-destructive-foreground ml-auto">
                <ExternalLink className="h-3 w-3" />
              </a>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}
