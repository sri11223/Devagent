/**
 * Testing Agent
 * Generates test files (Jest/Playwright)
 */

import { callAI } from '../llm/index.js';
import { saveToFile } from '../utils/fileWriter.js';
import type { TaskContract, AgentOutput } from './index.js';
import path from 'path';
import fs from 'fs-extra';

export class TestingAgent {
  static async execute(contract: TaskContract): Promise<AgentOutput> {
    console.log('🧪 Testing Agent: Generating tests...');

    const projectDir = path.join(
      process.env.OUTPUT_DIR!,
      `project-${contract.project_id}`
    );

    const filesGenerated: string[] = [];

    // Read backend code to generate tests for
    const backendDir = path.join(projectDir, 'backend/src');
    const routes = await this.findRouteFiles(backendDir);

    let testCount = 0;
    for (const routeFile of routes.slice(0, 3)) {
      const testCode = await this.generateTestForRoute(routeFile);
      const testPath = routeFile.replace('/src/', '/__tests__/').replace('.ts', '.test.ts');
      filesGenerated.push(
        await saveToFile(projectDir, `backend${testPath}`, testCode)
      );
      testCount++;
    }

    // Generate test config
    const jestConfig = this.generateJestConfig();
    filesGenerated.push(
      await saveToFile(projectDir, 'backend/jest.config.js', jestConfig)
    );

    return {
      success: true,
      filesGenerated,
      outputPath: projectDir,
      summary: `Tests generated: ${testCount} test files created`,
      metadata: { testFiles: testCount },
    };
  }

  private static async findRouteFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    
    if (!await fs.pathExists(dir)) {
      return files;
    }

    const routesDir = path.join(dir, 'routes');
    if (await fs.pathExists(routesDir)) {
      const entries = await fs.readdir(routesDir);
      for (const entry of entries) {
        if (entry.endsWith('.ts')) {
          files.push(`/src/routes/${entry}`);
        }
      }
    }

    return files;
  }

  private static async generateTestForRoute(routeFile: string): Promise<string> {
    const prompt = `Generate Jest + Supertest tests for Express route: ${routeFile}

Include:
- Import statements
- Describe block
- Test cases for success and error scenarios
- Mock database if needed
- Proper TypeScript typing

Return ONLY the test code.`;

    return await callAI([
      { role: 'system', content: 'You are an expert at writing tests.' },
      { role: 'user', content: prompt },
    ]);
  }

  private static generateJestConfig(): string {
    return `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ]
};
`;
  }
}
