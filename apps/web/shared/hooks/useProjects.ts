import { useCallback, useState } from "react";
import { createProject, listProjects, Project } from "../../features/projects/api";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listProjects();
      setProjects(result.projects);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload: { name: string; description?: string | null; status: Project["status"] }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createProject(payload);
      setProjects((prev) => [result.project, ...prev]);
      return result.project;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { projects, loading, error, load, create };
}
