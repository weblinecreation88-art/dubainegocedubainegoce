'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { runAnswerFaq } from '@/app/actions';
import { cn } from '@/lib/utils';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          text: 'Bonjour ! Je suis l\'assistant de DubaiNegoce. Comment puis-je vous aider ?',
          sender: 'bot',
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await runAnswerFaq({ question: input });
      const botMessage: Message = { text: result.answer, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm"
          >
            <Card className="flex h-[60vh] flex-col shadow-2xl">
              <CardHeader className="flex-row items-center justify-between border-b">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Assistant DubaiNegoce</CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-start gap-3',
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.sender === 'bot' && (
                          <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                            <Bot className="h-5 w-5" />
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-[80%] rounded-xl px-4 py-2',
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                         {message.sender === 'user' && (
                          <Avatar className="h-8 w-8 bg-muted text-muted-foreground">
                            <User className="h-5 w-5" />
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-start gap-3 justify-start">
                           <Avatar className="h-8 w-8 bg-primary/20 text-primary">
                            <Bot className="h-5 w-5" />
                          </Avatar>
                          <div className="bg-muted rounded-xl px-4 py-3">
                              <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="fixed bottom-4 right-4 z-50 h-16 w-16 rounded-full shadow-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="close">
              <X className="h-8 w-8" />
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="open">
              <MessageSquare className="h-8 w-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </>
  );
}

// Add a simple Avatar component if not available elsewhere
const Avatar = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", className)}>
    {children}
  </div>
);
