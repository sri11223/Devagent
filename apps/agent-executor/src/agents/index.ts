/**
 * Agent Router
 * Routes task contracts to the appropriate AI agent
 */

import { ArchitectAgent } from './ArchitectAgent.js';
import { BackendAgent } from './BackendAgent.js';
import { FrontendAgent } from './FrontendAgent.js';
import { SecurityAgent } from './SecurityAgent.js';
import { TestingAgent } from './TestingAgent.js';
import { DeploymentAgent } from './DeploymentAgent.js';

export interface TaskContract {
  id: string;
  agent: string;
  objective: string;
  input: any;
  project_id: string;
  pipeline_id: string;
}

export interface AgentOutput {
  success: boolean;
  filesGenerated: string[];
  outputPath: string;
  summary: string;
  metadata: any;
}

export async function executeAgent(contract: TaskContract): Promise<AgentOutput> {
  const agentName = contract.agent.toLowerCase();

  if (agentName.includes('architect')) {
    return await ArchitectAgent.execute(contract);
  } else if (agentName.includes('backend')) {
    return await BackendAgent.execute(contract);
  } else if (agentName.includes('frontend')) {
    return await FrontendAgent.execute(contract);
  } else if (agentName.includes('security')) {
    return await SecurityAgent.execute(contract);
  } else if (agentName.includes('testing') || agentName.includes('test')) {
    return await TestingAgent.execute(contract);
  } else if (agentName.includes('deploy') || agentName.includes('devops')) {
    return await DeploymentAgent.execute(contract);
  } else {
    throw new Error(`Unknown agent type: ${contract.agent}`);
  }
}
