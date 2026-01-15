import { Stethoscope } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
        <Stethoscope className="w-4 h-4 text-primary" />
      </div>
      <div className="bg-chat-bot text-chat-bot-foreground rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full typing-dot" />
        </div>
      </div>
    </div>
  );
}
