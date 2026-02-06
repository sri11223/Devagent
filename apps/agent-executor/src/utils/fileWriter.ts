/**
 * File Writer Utility
 * Safely writes generated code to disk
 */

import fs from 'fs-extra';
import path from 'path';

export async function saveToFile(
  baseDir: string,
  relativePath: string,
  content: string
): Promise<string> {
  const fullPath = path.join(baseDir, relativePath);
  const dir = path.dirname(fullPath);

  // Ensure directory exists
  await fs.ensureDir(dir);

  // Write file
  await fs.writeFile(fullPath, content, 'utf-8');

  console.log(`   ✅ Created: ${relativePath}`);
  return fullPath;
}

export async function readFile(baseDir: string, relativePath: string): Promise<string | null> {
  const fullPath = path.join(baseDir, relativePath);
  
  if (await fs.pathExists(fullPath)) {
    return await fs.readFile(fullPath, 'utf-8');
  }
  
  return null;
}
