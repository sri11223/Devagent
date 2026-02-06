/**
 * Backend Agent
 * Generates actual backend code (Express routes, controllers, models)
 */

import { callAI } from '../llm/index.js';
import { saveToFile } from '../utils/fileWriter.js';
import type { TaskContract, AgentOutput } from './index.js';
import path from 'path';
import fs from 'fs-extra';

export class BackendAgent {
  static async execute(contract: TaskContract): Promise<AgentOutput> {
    console.log('⚙️  Backend Agent: Generating backend code...');

    const outputDir = path.join(
      process.env.OUTPUT_DIR!,
      `project-${contract.project_id}`,
      'backend'
    );

    // Read architecture if it exists
    const archPath = path.join(
      process.env.OUTPUT_DIR!,
      `project-${contract.project_id}`,
      'architecture/api-spec.json'
    );

    let apiSpec = [];
    if (await fs.pathExists(archPath)) {
      apiSpec = JSON.parse(await fs.readFile(archPath, 'utf-8'));
    }

    const filesGenerated: string[] = [];

    // Generate package.json
    const packageJson = await this.generatePackageJson(contract);
    filesGenerated.push(
      await saveToFile(outputDir, 'package.json', packageJson)
    );

    // Generate server.ts
    const serverCode = await this.generateServer(contract);
    filesGenerated.push(
      await saveToFile(outputDir, 'src/server.ts', serverCode)
    );

    // Generate routes for each API endpoint
    for (const endpoint of apiSpec.slice(0, 3)) {
      // Limit to 3 for demo
      const routeCode = await this.generateRoute(endpoint, contract);
      const routeName = endpoint.path.split('/')[2] || 'main';
      filesGenerated.push(
        await saveToFile(outputDir, `src/routes/${routeName}Routes.ts`, routeCode)
      );
    }

    // Generate .env.example
    const envExample = `PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key-here
NODE_ENV=development
`;
    filesGenerated.push(
      await saveToFile(outputDir, '.env.example', envExample)
    );

    return {
      success: true,
      filesGenerated,
      outputPath: outputDir,
      summary: `Backend generated: ${apiSpec.length} endpoints, Express + TypeScript`,
      metadata: { apiEndpoints: apiSpec.length },
    };
  }

  private static async generatePackageJson(contract: TaskContract): Promise<string> {
    return JSON.stringify(
      {
        name: 'generated-backend',
        version: '1.0.0',
        type: 'module',
        scripts: {
          dev: 'tsx watch src/server.ts',
          build: 'tsc',
          start: 'node dist/server.js',
        },
        dependencies: {
          express: '^4.19.2',
          pg: '^8.11.3',
          dotenv: '^16.4.5',
          jsonwebtoken: '^9.0.2',
          bcryptjs: '^2.4.3',
        },
        devDependencies: {
          '@types/express': '^4.17.21',
          '@types/node': '^20.11.19',
          typescript: '^5.4.5',
          tsx: '^4.19.2',
        },
      },
      null,
      2
    );
  }

  private static async generateServer(contract: TaskContract): Promise<string> {
    const prompt = `Generate an Express.js TypeScript server file with:
- Import express, dotenv
- Create Express app
- Add middleware (JSON parsing, CORS)
- Basic health check route at /health
- Listen on PORT from env

Objective: ${contract.objective}

Return ONLY the TypeScript code, no explanations.`;

    return await callAI([
      { role: 'system', content: 'You are an expert backend developer. Generate production-ready code.' },
      { role: 'user', content: prompt },
    ]);
  }

  private static async generateRoute(endpoint: any, contract: TaskContract): Promise<string> {
    const prompt = `Generate an Express router for this endpoint:
Method: ${endpoint.method}
Path: ${endpoint.path}
Description: ${endpoint.description}

Requirements:
- Use TypeScript
- Include proper error handling
- Add input validation
- Return appropriate status codes

Return ONLY the TypeScript code for the route file.`;

    return await callAI([
      { role: 'system', content: 'You are an expert backend developer.' },
      { role: 'user', content: prompt },
    ]);
  }
}
