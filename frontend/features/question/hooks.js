/**
 * 질문 관련 커스텀 훅
 */

import { useState, useEffect, useCallback } from 'react';
import * as questionApi from './api';

/**
 * 질문 목록 조회 훅
 * Spring Data Page 응답 구조 처리
 */
export function useQuestions(params = {}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    size: 10,
    first: true,
    last: true,
  });

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await questionApi.getQuestions(params);
      
      // Spring Data Page 응답 구조 처리
      if (data && data.content) {
        setQuestions(data.content);
        setPageInfo({
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
          currentPage: data.number || 0,
          size: data.size || 10,
          first: data.first ?? true,
          last: data.last ?? true,
        });
      } else if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return { questions, loading, error, pageInfo, refetch: fetchQuestions };
}

/**
 * 질문 상세 조회 훅
 */
export function useQuestion(id) {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await questionApi.getQuestion(id);
        setQuestion(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  return { question, loading, error };
}

/**
 * 질문 생성 훅
 */
export function useCreateQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createQuestion = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const response = await questionApi.createQuestion(data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createQuestion, loading, error };
}

