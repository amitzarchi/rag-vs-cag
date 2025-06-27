import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { z } from "zod";
import { findPlayerByName, PlayerSchema } from "../utils";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash-preview-04-17"),
    system: "You are a helpful assistant that can answer questions about NBA players. You have access to a tool that can look up player information by name. Use this tool to find specific player data when needed. You have access to a tool that can look up player stats by name. Use this tool to find specific player stats when needed.",
    messages,
    tools: {
      getPlayerInfo: {
        description: "Get information about an NBA player by their name",
        parameters: z.object({
          name: z.string().describe("The name of the player to look up"),
        }),
        execute: async ({ name }) => {
          const player = await findPlayerByName(name);
          if (!player) {
            return {
              found: false,
              message: `No player found with name containing "${name}"`,
            };
          }

          return {
            found: true,
            player: player,
          };
        },
      },
    },
  });

  return result.toDataStreamResponse();
} 