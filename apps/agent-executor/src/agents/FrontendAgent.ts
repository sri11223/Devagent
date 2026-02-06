/**
 * Frontend Agent
 * Generates React/Next.js UI components
 */

import { callAI } from '../llm/index.js';
import { saveToFile } from '../utils/fileWriter.js';
import type { TaskContract, AgentOutput } from './index.js';
import path from 'path';

export class FrontendAgent {
  static async execute(contract: TaskContract): Promise<AgentOutput> {
    console.log('🎨 Frontend Agent: Generating frontend code...');

    const outputDir = path.join(
      process.env.OUTPUT_DIR!,
      `project-${contract.project_id}`,
      'frontend'
    );

    const filesGenerated: string[] = [];

    // Generate package.json
    const packageJson = this.generatePackageJson();
    filesGenerated.push(
      await saveToFile(outputDir, 'package.json', packageJson)
    );

    // Generate main page
    const homePage = await this.generatePage('Home', contract);
    filesGenerated.push(
      await saveToFile(outputDir, 'app/page.tsx', homePage)
    );

    // Generate layout
    const layout = await this.generateLayout(contract);
    filesGenerated.push(
      await saveToFile(outputDir, 'app/layout.tsx', layout)
    );

    // Generate components based on input
    const components = contract.input.components?.split(',') || ['Header', 'Footer'];
    for (const comp of components.slice(0, 3)) {
      const componentCode = await this.generateComponent(comp.trim(), contract);
      filesGenerated.push(
        await saveToFile(outputDir, `components/${comp.trim()}.tsx`, componentCode)
      );
    }

    return {
      success: true,
      filesGenerated,
      outputPath: outputDir,
      summary: `Frontend generated: ${components.length} components, Next.js + TypeScript`,
      metadata: { components: components.length },
    };
  }

  private static generatePackageJson(): string {
    return JSON.stringify(
      {
        name: 'generated-frontend',
        version: '1.0.0',
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
        },
        dependencies: {
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          next: '^14.2.3',
        },
        devDependencies: {
          '@types/node': '^20.11.19',
          '@types/react': '^18.2.55',
          typescript: '^5.4.5',
        },
      },
      null,
      2
    );
  }

  private static async generatePage(name: string, contract: TaskContract): Promise<string> {
    const prompt = `Generate a Next.js 14 App Router page component for: ${name}

Requirements from objective: ${contract.objective}

Use TypeScript, modern React (hooks), and include:
- Proper typing
- Client-side state if needed
- Clean, semantic HTML
- Comments explaining key parts

Return ONLY the TSX code.`;

    return await callAI([
      { role: 'system', content: 'You are an expert React/Next.js developer.' },
      { role: 'user', content: prompt },
    ]);
  }

  private static async generateLayout(contract: TaskContract): Promise<string> {
    const prompt = `Generate a Next.js 14 root layout component.

Include:
- Metadata export
- Clean HTML structure
- Provider wrapping if needed

Return ONLY the TSX code.`;

    return await callAI([
      { role: 'system', content: 'You are an expert Next.js developer.' },
      { role: 'user', content: prompt },
    ]);
  }

  private static async generateComponent(name: string, contract: TaskContract): Promise<string> {
    const prompt = `Generate a React component: ${name}

Context: ${contract.objective}

Use TypeScript, props interface, clean code.

Return ONLY the TSX code.`;

    return await callAI([
      { role: 'system', content: 'You are an expert React developer.' },
      { role: 'user', content: prompt },
    ]);
  }
}
