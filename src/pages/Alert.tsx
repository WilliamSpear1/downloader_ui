import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export function DownloadAlert() {
  return (
    <div className="flex items-center max-w-sm flex-col justify-center p-6 bg-zinc-50">
      <Alert className="shadow-xl border border-green-400">
        <CheckCircle2Icon />
        <AlertTitle>Download Submitted</AlertTitle>
        <AlertDescription>
          Your download has been submitted for processing.
        </AlertDescription>
      </Alert>
    </div>
  );
}
