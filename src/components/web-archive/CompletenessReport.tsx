// @ts-nocheck 
"use client";

import type { AssessArchiveCompletenessOutput } from "@/ai/flows/assess-archive-completeness";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

interface CompletenessReportProps {
  completeness?: AssessArchiveCompletenessOutput;
  archivePath?: string;
}

export function CompletenessReport({ completeness, archivePath }: CompletenessReportProps) {
  if (!completeness) {
    return null;
  }

  const Icon = completeness.isComplete ? CheckCircle2 : AlertCircle;
  const alertVariant = completeness.isComplete ? "default" : "destructive"; 
  const badgeVariant = completeness.isComplete ? "default" : "destructive";


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <Icon className={`mr-2 h-6 w-6 ${completeness.isComplete ? 'text-accent' : 'text-destructive'}`} />
          Archive Completeness Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Overall Status:</span>
            <Badge variant={badgeVariant} className={completeness.isComplete ? 'bg-accent text-accent-foreground' : 'bg-destructive text-destructive-foreground'}>
              {completeness.isComplete ? "Archive Appears Complete" : "Archive May Be Incomplete"}
            </Badge>
        </div>
        
        {archivePath && (
            <Alert className="bg-secondary/50">
                <Info className="h-4 w-4 text-secondary-foreground" />
                <AlertTitle className="text-sm font-medium">Archive Location (Simulated)</AlertTitle>
                <AlertDescription className="text-xs text-muted-foreground">
                    Archived content is conceptually saved at: <code className="font-mono bg-muted px-1 py-0.5 rounded">{archivePath}</code>.
                    In a real application, you would be able to download or access this.
                </AlertDescription>
            </Alert>
        )}

        <Alert variant={alertVariant} className={completeness.isComplete ? "border-accent bg-accent/10" : "border-destructive bg-destructive/10"}>
          <AlertTitle className="font-medium">AI Analysis Details:</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap text-sm max-h-60 overflow-y-auto">
            {completeness.completenessReport || "No detailed report available."}
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
