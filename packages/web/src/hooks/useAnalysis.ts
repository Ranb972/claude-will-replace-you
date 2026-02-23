import { useState, useCallback } from "react";
import { submitAnalysis, type ProfilePayload, type AnalysisResult } from "../lib/api";

interface UseAnalysisReturn {
  result: AnalysisResult | null;
  error: string | null;
  isLoading: boolean;
  analyze: (payload: ProfilePayload) => Promise<AnalysisResult | null>;
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = useCallback(async (payload: ProfilePayload): Promise<AnalysisResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await submitAnalysis(payload);
      setResult(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, error, isLoading, analyze };
}
