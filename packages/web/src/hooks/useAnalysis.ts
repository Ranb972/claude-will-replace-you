import { useState, useCallback } from "react";
import {
  submitAnalysis,
  getErrorMessage,
  getErrorCode,
  type ProfilePayload,
  type AnalysisResult,
  type ApiErrorCode,
} from "../lib/api";

interface UseAnalysisReturn {
  result: AnalysisResult | null;
  error: string | null;
  errorCode: ApiErrorCode | null;
  isLoading: boolean;
  analyze: (payload: ProfilePayload) => Promise<AnalysisResult | null>;
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<ApiErrorCode | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = useCallback(
    async (payload: ProfilePayload): Promise<AnalysisResult | null> => {
      setIsLoading(true);
      setError(null);
      setErrorCode(null);
      try {
        const data = await submitAnalysis(payload);
        setResult(data);
        return data;
      } catch (err) {
        setError(getErrorMessage(err));
        setErrorCode(getErrorCode(err));
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { result, error, errorCode, isLoading, analyze };
}
