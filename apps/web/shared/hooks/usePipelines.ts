import { useCallback, useState } from "react";
import {
  createContract,
  createPipeline,
  createReview,
  getPipelineDetail,
  listPipelinesByProject,
  Pipeline,
  PipelineStage,
  TaskContract,
  updateContractStatus,
  updateStageStatus
} from "../../features/orchestrator/api";

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

  const addContract = useCallback(
    async (pipelineId: string, payload: { agent: string; objective: string; input: Record<string, unknown> }) => {
      const result = await createContract(pipelineId, payload);
      await loadDetail(pipelineId);
      return result.contract;
    },
    [loadDetail]
  );

  const updateContract = useCallback(
    async (contractId: string, status: TaskContract["status"], pipelineId: string) => {
      const result = await updateContractStatus(contractId, status);
      await loadDetail(pipelineId);
      return result.contract;
    },
    [loadDetail]
  );

  const addReview = useCallback(
    async (contractId: string, payload: { reviewer: string; notes: string; status: "requested" | "approved" | "changes_requested" }, pipelineId: string) => {
      await createReview(contractId, payload);
      await loadDetail(pipelineId);
    },
    [loadDetail]
  );

  const setStageStatus = useCallback(
    async (pipelineId: string, stageId: string, status: PipelineStage["status"]) => {
      await updateStageStatus(pipelineId, stageId, status);
      await loadDetail(pipelineId);
    },
    [loadDetail]
  );

  return { pipelines, detail, loading, error, load, create, loadDetail, addContract, updateContract, addReview, setStageStatus };
}
