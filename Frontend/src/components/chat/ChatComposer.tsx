import { useState, useRef, useEffect, KeyboardEvent, ChangeEvent } from 'react';
import { Send, Mic, MicOff, Paperclip, X, File, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface ChatComposerProps {
  onSend: (message: string, files?: UploadedFile[]) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if ((message.trim() || uploadedFiles.length > 0) && !disabled) {
      onSend(message, uploadedFiles.length > 0 ? uploadedFiles : undefined);
      setMessage('');
      setUploadedFiles([]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      // Stop recording - simulate transcription
      setIsRecording(false);
      const mockTranscriptions = [
        "I've been having headaches lately",
        "My throat feels sore since yesterday",
        "I feel tired all the time",
        "I have a slight fever and cough",
      ];
      const randomText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
      setMessage(prev => prev + (prev ? ' ' : '') + randomText);
      toast.success('Demo: Voice transcribed!');
    } else {
      // Start recording
      setIsRecording(true);
      toast.info('Demo: Recording... (click again to stop)');
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: UploadedFile[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`Demo: ${files.length} file(s) attached`);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImageFile = (type: string) => type.startsWith('image/');

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-3xl mx-auto">
        {/* Uploaded files preview */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {uploadedFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm"
              >
                {isImageFile(file.type) ? (
                  <Image className="w-4 h-4 text-primary" />
                ) : (
                  <File className="w-4 h-4 text-primary" />
                )}
                <span className="max-w-[150px] truncate">{file.name}</span>
                <span className="text-muted-foreground text-xs">
                  {formatFileSize(file.size)}
                </span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-0.5 hover:bg-background rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-muted rounded-2xl border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
          {/* File upload button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className={cn(
              'flex-shrink-0 p-2.5 m-1.5 rounded-xl transition-all hover:bg-background',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            title="Attach files"
          >
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your symptoms..."
            disabled={disabled}
            rows={1}
            className={cn(
              'flex-1 bg-transparent resize-none py-3 text-sm focus:outline-none placeholder:text-muted-foreground min-h-[48px] max-h-[200px]',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          />

          {/* Voice input button */}
          <button
            onClick={handleVoiceToggle}
            disabled={disabled}
            className={cn(
              'flex-shrink-0 p-2.5 m-1.5 rounded-xl transition-all',
              isRecording
                ? 'bg-red-500/20 text-red-500 animate-pulse'
                : 'hover:bg-background text-muted-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            {isRecording ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Send button */}
          <button
            onClick={handleSubmit}
            disabled={(!message.trim() && uploadedFiles.length === 0) || disabled}
            className={cn(
              'flex-shrink-0 p-2.5 m-1.5 rounded-xl transition-all',
              (message.trim() || uploadedFiles.length > 0) && !disabled
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted-foreground/20 text-muted-foreground cursor-not-allowed'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          ⚠️ Educational UI demo — responses are fake and not medical advice.
        </p>
      </div>
    </div>
  );
}
