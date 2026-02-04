import { useCallback, useState } from "react";
import { createPipeline, getPipelineDetail, listPipelinesByProject, Pipeline, PipelineStage, TaskContract } from "../../features/orchestrator/api";

export function usePipelines(projectId?: string) {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [detail, setDetail] = useState<{
    pipeline: Pipeline;
    stages: PipelineStage[];
    contracts: TaskContract[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!projectId) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await listPipelinesByProject(projectId);
      setPipelines(result.pipelines);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const create = useCallback(async () => {
    if (!projectId) {
      throw new Error("Project is required");
    }
    setLoading(true);
    setError(null);
    try {
      const result = await createPipeline(projectId);
      setPipelines((prev) => [result.pipeline, ...prev]);
      return result.pipeline;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const loadDetail = useCallback(async (pipelineId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPipelineDetail(pipelineId);
      setDetail(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { pipelines, detail, loading, error, load, create, loadDetail };
}
