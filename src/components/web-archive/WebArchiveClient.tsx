// @ts-nocheck 
"use client";

import { archiveWebsiteAction, type ArchiveState } from "@/app/actions/archiveActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Archive, Frown, ListChecks, FileText, CheckCircle2 } from "lucide-react";
import React, { useEffect, useRef, useState, useActionState } from "react";
// useFormState was previously imported from 'react-dom', now useActionState is from 'react'
import { CompletenessReport } from "./CompletenessReport";
import { ErrorReport } from "./ErrorReport";
import { ProgressDisplay } from "./ProgressDisplay";
import { UrlInputForm } from "./UrlInputForm";

const initialArchiveState: ArchiveState = { status: 'idle' };

export function WebArchiveClient() {
  const [state, formAction] = useActionState(archiveWebsiteAction, initialArchiveState);
  
  const formRef = useRef<HTMLFormElement>(null);
  const [isProcessing, setIsProcessing] = useState(false); 
  const [currentStatusMessage, setCurrentStatusMessage] = useState("Enter a URL to begin archiving.");


  const wrappedFormAction = async (formData: FormData) => {
    setIsProcessing(true);
    setCurrentStatusMessage("Initializing archiving process...");
    // @ts-ignore TODO: figure out the correct type for formAction with useActionState
    await formAction(formData); 
  };


  useEffect(() => {
    if (state.status === 'success' || state.status === 'error') {
      setIsProcessing(false); 
      if (state.formKey) { 
        formRef.current?.reset();
      }
    }

    if (state.status === 'success') {
      setCurrentStatusMessage(state.message || "Process completed successfully.");
    } else if (state.status === 'error') {
      setCurrentStatusMessage(state.error || "An error occurred.");
    } else if (state.status === 'idle' && !isProcessing) {
      setCurrentStatusMessage("Enter a URL to begin archiving.");
    }
  }, [state, isProcessing]);


  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Archive className="h-10 w-10 text-primary mr-3" />
          <h1 className="text-4xl font-headline font-bold">Web Archive</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Clone and save entire websites for offline viewing and analysis.
        </p>
      </header>

      <Card className="shadow-xl mb-8">
        <CardHeader>
          <CardTitle>Archive a Website</CardTitle>
          <CardDescription>
            Input a URL below to start the archiving process. All linked pages and assets will be (simulated) saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UrlInputForm formAction={wrappedFormAction} state={state} formRef={formRef} />
        </CardContent>
      </Card>
      
      {(isProcessing || state.status === 'success' || (state.status === 'error' && state.error && !state.error.toLowerCase().includes('url'))) && (
        <ProgressDisplay 
          isProcessing={isProcessing} 
          statusMessage={currentStatusMessage}
          processCompleted={state.status === 'success' || state.status === 'error'}
        />
      )}

      {state.status === 'error' && state.error && !state.error.toLowerCase().includes('url') && !isProcessing && (
         <Alert variant="destructive" className="mt-6">
            <Frown className="h-5 w-5" />
            <AlertTitle>Process Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      {state.status === 'success' && !isProcessing && (
        <div className="mt-8 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center"><ListChecks className="mr-2 h-6 w-6 text-primary"/>Crawling Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {state.crawledPages && state.crawledPages.length > 0 && (
                    <div className="mb-4">
                        <h3 className="font-semibold mb-1 text-sm">Pages Archived (Simulated):</h3>
                        <ul className="list-disc list-inside text-xs text-muted-foreground max-h-40 overflow-y-auto bg-secondary/30 p-3 rounded-md shadow-inner">
                            {state.crawledPages.map(page => <li key={page} className="truncate">{page}</li>)}
                        </ul>
                    </div>
                )}
                <ErrorReport brokenLinks={state.brokenLinks} />
            </CardContent>
          </Card>
          
          <CompletenessReport completeness={state.completeness} archivePath={state.archivePath} />
        </div>
      )}
    </div>
  );
}
