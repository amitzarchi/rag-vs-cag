import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// Define the player schema
export const PlayerSchema = z.object({
  Name: z.string(),
  Debut: z.number(),
  Final: z.number(),
  Position: z.string(),
  Height: z.number(),
  Weight: z.number(),
  Birthday: z.string(),
  School: z.string(),
  HOF: z.boolean(),
  Active: z.boolean(),
  G: z.number(),
  PTS: z.number(),
  TRB: z.number(),
  AST: z.number(),
  'FG%': z.number(),
  'FG3%': z.number(),
  'FT%': z.number(),
  'eFG%': z.number(),
  PER: z.number(),
  WS: z.number(),
});

export type Player = z.infer<typeof PlayerSchema>;

let playersCache: Player[] | null = null;
let lastLoadTime: number | null = null;

export async function loadPlayers(): Promise<Player[]> {
  if (playersCache) {
    console.log(`Using cached players data (loaded in ${lastLoadTime}ms)`);
    return playersCache;
  }

  console.time('loadPlayers');
  const startTime = performance.now();

  const filePath = path.join(process.cwd(), 'data', 'NBA_PLAYERS.csv');
  const fileContent = await fs.promises.readFile(filePath, 'utf-8');
  
  // Parse CSV and convert to Player objects
  const lines = fileContent.split('\n').slice(1); // Skip header
  playersCache = lines
    .filter(line => line.trim())
    .map(line => {
      const [
        Name, Debut, Final, Position, Height, Weight, Birthday,
        School, HOF, Active, G, PTS, TRB, AST, FG, FG3, FT, eFG, PER, WS
      ] = line.split(',');

      return {
        Name,
        Debut: parseInt(Debut),
        Final: parseInt(Final),
        Position,
        Height: parseInt(Height),
        Weight: parseInt(Weight),
        Birthday,
        School,
        HOF: HOF.toLowerCase() === 'true',
        Active: Active.toLowerCase() === 'true',
        G: parseInt(G),
        PTS: parseFloat(PTS),
        TRB: parseFloat(TRB),
        AST: parseFloat(AST),
        'FG%': parseFloat(FG),
        'FG3%': parseFloat(FG3),
        'FT%': parseFloat(FT),
        'eFG%': parseFloat(eFG),
        PER: parseFloat(PER),
        WS: parseFloat(WS),
      };
    });

  const endTime = performance.now();
  lastLoadTime = Math.round(endTime - startTime);
  console.timeEnd('loadPlayers');
  console.log(`Loaded ${playersCache.length} players in ${lastLoadTime}ms`);

  return playersCache;
}

export async function findPlayerByName(name: string): Promise<Player | null> {
  const players = await loadPlayers();
  const normalizedName = name.toLowerCase().trim();
  
  return players.find(player => 
    player.Name.toLowerCase().includes(normalizedName)
  ) || null;
}

export async function generateSystemPrompt(): Promise<string> {
  if (!playersCache) {
    await loadPlayers();
  }
  const players = playersCache || [];
  const playersInfo = players.map(player => {
    
    return `
Player: ${player.Name}
Career: ${player.Debut}-${player.Final}
Position: ${player.Position}
Height: ${player.Height} inches
Weight: ${player.Weight} lbs
Birthday: ${player.Birthday}
School: ${player.School}
Hall of Fame: ${player.HOF ? 'Yes' : 'No'}
Active: ${player.Active ? 'Yes' : 'No'}
Games Played: ${player.G}
Per Game Stats:
- Points: ${player.PTS.toFixed(1)}
- Rebounds: ${player.TRB.toFixed(1)}
- Assists: ${player.AST.toFixed(1)}
- FG%: ${player['FG%'].toFixed(1)}%
- 3P%: ${player['FG3%'].toFixed(1)}%
- FT%: ${player['FT%'].toFixed(1)}%
- eFG%: ${player['eFG%'].toFixed(1)}%
- PER: ${player.PER.toFixed(1)}
- Win Shares: ${player.WS.toFixed(1)}
---`;
  }).join('\n');

  const prompt = `You are a helpful assistant with comprehensive knowledge of NBA players. You have access to detailed statistics for ${players.length} NBA players from 1947 to 2025. Here is the complete dataset:\n\n${playersInfo}\n\nYou can answer questions about any player's career, statistics, achievements, and more. When comparing players, you can analyze their stats, longevity, and impact on the game. for example, if the user asks "what was avg rebound for arvydas sabonis?" look up arvydas sabonis and then use the tool to get the average rebound for him.



`;

  return prompt;
} 