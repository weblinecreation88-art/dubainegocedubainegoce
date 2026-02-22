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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Bonjour ! Je suis l\'assistant de DubaiNegoce. Comment puis-je vous aider ?',
      sender: 'bot',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isOpen]);

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
            <Card className="flex h-[60vh] flex-col shadow-2xl border-primary/20">
              <CardHeader className="flex-row items-center justify-between border-b bg-muted/30 py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Assistant DubaiNegoce</CardTitle>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      En ligne
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-start gap-2',
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.sender === 'bot' && (
                          <Avatar className="h-8 w-8 border border-primary/10">
                            <AvatarFallback className="bg-primary/5">
                              <Bot className="h-4 w-4 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-[80%] rounded-2xl px-3.5 py-2 shadow-sm',
                            message.sender === 'user'
                              ? 'bg-primary text-primary-foreground rounded-tr-none'
                              : 'bg-muted rounded-tl-none'
                          )}
                        >
                          <p className="text-sm leading-relaxed">{message.text}</p>
                        </div>
                        {message.sender === 'user' && (
                          <Avatar className="h-8 w-8 border border-muted-foreground/10">
                            <AvatarFallback className="bg-muted text-muted-foreground">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start gap-2 justify-start">
                        <Avatar className="h-8 w-8 border border-primary/10">
                          <AvatarFallback className="bg-primary/5">
                            <Bot className="h-4 w-4 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-3 bg-muted/10">
                <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    disabled={isLoading}
                    className="bg-background border-primary/10 focus-visible:ring-primary/20"
                  />
                  <Button type="submit" size="icon" disabled={isLoading} className="shrink-0 h-9 w-9">
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
        className="fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} key="close">
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} key="open">
              <MessageSquare className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </>
  );
}
