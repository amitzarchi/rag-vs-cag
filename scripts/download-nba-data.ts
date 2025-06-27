import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function downloadDataset() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = join(process.cwd(), 'data');
    await mkdir(dataDir, { recursive: true });

    // Download the dataset using kaggle CLI
    console.log('Downloading NBA player dataset...');
    await execAsync('kaggle datasets download flynn28/v2-nba-player-database -p data --unzip');

    console.log('Dataset downloaded successfully!');
  } catch (error) {
    console.error('Error downloading dataset:', error);
    process.exit(1);
  }
}

downloadDataset(); 