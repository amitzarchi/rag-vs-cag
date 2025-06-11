import { Badge } from "@/components/ui/badge";
import {
  Search,
  CheckCircle2Icon,
} from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ToolAlertProps {
  toolInvocation: {
    toolCallId: string;
    state: "call" | "result" | "partial-call";
    args: Record<string, any>;
    result?: string;
  };
  loadingPrompt: string;
  successPrompt: string;
  loadingDescription?: string;
  successDescription?: string;
}

export function ToolAlert({
  toolInvocation,
  loadingPrompt,
  successPrompt,
  loadingDescription,
  successDescription,
}: ToolAlertProps) {
  const callId = toolInvocation.toolCallId;

  switch (toolInvocation.state) {
    case "partial-call":
    case "call":
      return (
        <Alert variant="destructive" className="mb-2">
          <Search className="w-4 h-4 animate-pulse" />
          <AlertTitle>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="text-xs"
              >
                Loading
              </Badge>
              {loadingPrompt}
            </div>
          </AlertTitle>
          {loadingDescription && (
            <AlertDescription>
              {loadingDescription}
            </AlertDescription>
          )}
        </Alert>
      );

    case "result":
      return (
        <Alert className="mb-2">
          <CheckCircle2Icon />
          <AlertTitle>
            {successPrompt}
          </AlertTitle>
        </Alert>
      );

    default:
      return null;
  }
}
