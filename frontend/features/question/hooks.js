/**
 * 질문 관련 커스텀 훅
 */

import { useState, useEffect } from 'react';
import * as questionApi from './api';

/**
 * 질문 목록 조회 훅
 */
export function useQuestions(params = {}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await questionApi.getQuestions(params);
        setQuestions(Array.isArray(data) ? data : data.questions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [JSON.stringify(params)]);

  return { questions, loading, error, refetch: () => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await questionApi.getQuestions(params);
        setQuestions(Array.isArray(data) ? data : data.questions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }};
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

