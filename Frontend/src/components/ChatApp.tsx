import { useState, useEffect } from 'react';
import { useChat } from '@/hooks/useChat';
import { Sidebar } from './sidebar/Sidebar';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessages } from './chat/ChatMessages';
import { ChatComposer } from './chat/ChatComposer';

export function ChatApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  const {
    conversations,
    activeConversation,
    activeConversationId,
    isTyping,
    createNewChat,
    selectConversation,
    deleteConversation,
    clearConversation,
    sendMessage,
  } = useChat();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleClearChat = () => {
    if (activeConversationId) {
      clearConversation(activeConversationId);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={createNewChat}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          title={activeConversation?.title || 'New chat'}
          onToggleSidebar={() => setSidebarOpen(true)}
          onClearChat={handleClearChat}
        />

        <ChatMessages
          messages={activeConversation?.messages || []}
          isTyping={isTyping}
        />

        <ChatComposer onSend={sendMessage} disabled={isTyping} />
      </main>
    </div>
  );
}
