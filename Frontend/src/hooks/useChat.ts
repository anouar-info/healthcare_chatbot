import { useState, useEffect, useCallback } from 'react';
import { Conversation, Message } from '@/types/chat';
import { getRandomMockResponse, generateConversationTitle } from '@/data/mockResponses';

const STORAGE_KEY = 'health-chatbot-conversations';
const ACTIVE_CHAT_KEY = 'health-chatbot-active';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

function loadConversations(): Conversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

function loadActiveChat(): string | null {
  return localStorage.getItem(ACTIVE_CHAT_KEY);
}

function saveActiveChat(id: string | null) {
  if (id) {
    localStorage.setItem(ACTIVE_CHAT_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_CHAT_KEY);
  }
}

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(loadActiveChat);
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  // Save to localStorage when conversations change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  // Save active chat ID when it changes
  useEffect(() => {
    saveActiveChat(activeConversationId);
  }, [activeConversationId]);

  const createNewChat = useCallback(() => {
    const newConversation: Conversation = {
      id: generateId(),
      title: 'New chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    return newConversation.id;
  }, []);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  }, [activeConversationId]);

  const clearConversation = useCallback((id: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, messages: [], title: 'New chat', updatedAt: Date.now() }
          : c
      )
    );
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    let currentConversationId = activeConversationId;

    // Create new conversation if none active
    if (!currentConversationId) {
      const newConversation: Conversation = {
        id: generateId(),
        title: 'New chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setConversations(prev => [newConversation, ...prev]);
      currentConversationId = newConversation.id;
      setActiveConversationId(currentConversationId);
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    // Add user message and update title if first message
    setConversations(prev =>
      prev.map(c => {
        if (c.id === currentConversationId) {
          const isFirstMessage = c.messages.length === 0;
          return {
            ...c,
            messages: [...c.messages, userMessage],
            title: isFirstMessage ? generateConversationTitle(content) : c.title,
            updatedAt: Date.now(),
          };
        }
        return c;
      })
    );

    // Simulate typing delay
    setIsTyping(true);
    const typingDelay = 600 + Math.random() * 600;

    await new Promise(resolve => setTimeout(resolve, typingDelay));

    const botMessage: Message = {
      id: generateId(),
      role: 'bot',
      content: getRandomMockResponse(),
      timestamp: Date.now(),
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === currentConversationId
          ? { ...c, messages: [...c.messages, botMessage], updatedAt: Date.now() }
          : c
      )
    );

    setIsTyping(false);
  }, [activeConversationId]);

  return {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping,
    createNewChat,
    selectConversation,
    deleteConversation,
    clearConversation,
    sendMessage,
  };
}
