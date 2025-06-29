import { ToolAlert } from "./tool-alert";

interface ToolInvocationProps {
  toolInvocation: {
    toolCallId: string;
    toolName: string;
    state: "call" | "result" | "partial-call";
    args: any;
    result?: string;
  };
}

export function ToolInvocation({ toolInvocation }: ToolInvocationProps) {
  switch (toolInvocation.toolName) {
    case "getUserFavoriteFood":
      return (
        <ToolAlert
          toolInvocation={toolInvocation}
          loadingPrompt="Fetching user's favorite food"
          successPrompt={`Success! User's favorite food retrieved!`}
          loadingDescription={`Retrieving user's favorite food"}`}
          successDescription={`User's favorite food retrieved!`}
        />
      );
    case "getPlayerInfo":
      return (
        <ToolAlert
          toolInvocation={toolInvocation}
          loadingPrompt="Fetching player stats"
          successPrompt={`Success! Player stats retrieved!`}
          loadingDescription={`Retrieving player stats"}`}
          successDescription={`Player stats retrieved!`}
        />
      );
    default:
      return null;
  }
}
