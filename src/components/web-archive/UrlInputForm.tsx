// @ts-nocheck 
"use client";

import type {ArchiveState} from "@/app/actions/archiveActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DownloadCloud, Link2, Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

interface UrlInputFormProps {
  formAction: (payload: FormData) => void;
  state: ArchiveState;
  formRef: React.RefObject<HTMLFormElement>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <DownloadCloud className="mr-2 h-4 w-4" />
      )}
      {pending ? "Archiving..." : "Start Archiving"}
    </Button>
  );
}

export function UrlInputForm({ formAction, state, formRef }: UrlInputFormProps) {
  return (
    <form action={formAction} ref={formRef} className="space-y-6">
      <div>
        <Label htmlFor="url" className="text-lg font-medium flex items-center mb-2">
          <Link2 className="mr-2 h-5 w-5 text-primary" />
          Enter Website URL
        </Label>
        <p className="text-sm text-muted-foreground mb-2">
          Enter the full URL of the website you want to archive (e.g., https://example.com).
        </p>
        <Input
          id="url"
          name="url"
          type="url"
          placeholder="https://example.com"
          required
          className={cn(
            "text-base",
            state.status === 'error' && state.error?.toLowerCase().includes('url') && "border-destructive focus-visible:ring-destructive"
          )}
          aria-describedby="url-error"
        />
        {state.status === 'error' && state.error?.toLowerCase().includes('url') && (
          <p id="url-error" className="text-sm text-destructive mt-1">{state.error}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
