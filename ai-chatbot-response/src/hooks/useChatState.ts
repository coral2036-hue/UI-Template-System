import { useState, useCallback } from 'react';
import type { Category, Message, Model } from '../types';
import { matchSceneByKeyword, buildAIResponse, buildSceneMessages, type SceneKey } from '../data/mockScenes';
import { DEFAULT_MODEL } from '../constants/models';

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('general');
  const [selectedModel, setSelectedModel] = useState<Model>(DEFAULT_MODEL);

  const sendMessage = useCallback((text: string) => {
    const userMsg: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Keyword matching → auto-detect scene
    const matchedScene = matchSceneByKeyword(text);
    setSelectedCategory((matchedScene === 'report' || matchedScene === 'no-data') ? 'general' : matchedScene as Category);

    // Simulate progressive loading
    setTimeout(() => {
      const aiMsg = buildAIResponse(matchedScene);
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 800 + Math.random() * 800); // 0.8~1.6s realistic delay
  }, []);

  const selectCategory = useCallback((cat: Category) => {
    setSelectedCategory(cat);
  }, []);

  const loadScene = useCallback((sceneKey: SceneKey) => {
    setLoading(true);
    const sceneMessages = buildSceneMessages(sceneKey);
    setSelectedCategory((sceneKey === 'report' || sceneKey === 'no-data') ? 'general' : sceneKey as Category);
    setTimeout(() => {
      setMessages(sceneMessages);
      setLoading(false);
    }, 600);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    loading,
    selectedCategory,
    selectedModel,
    sendMessage,
    selectCategory,
    selectModel: setSelectedModel,
    loadScene,
    clearMessages,
  };
}
