'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { runAnswerFaq, runRecommendPerfumes } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { AdvisorAnswers, AdvisorRecommendation } from '@/lib/perfume-advisor';

type QuickReply = { label: string; value: string };

type Message = {
  text: string;
  sender: 'user' | 'bot';
  replies?: QuickReply[];
  products?: AdvisorRecommendation[];
};

// Questions du conseiller parfum, posées dans l'ordre.
const ADVISOR_STEPS: { key: keyof AdvisorAnswers; question: string; replies: QuickReply[] }[] = [
  {
    key: 'gender',
    question: 'Pour qui est ce parfum ?',
    replies: [
      { label: '👩 Pour une femme', value: 'femme' },
      { label: '👨 Pour un homme', value: 'homme' },
      { label: '✨ Mixte / peu importe', value: 'mixte' },
    ],
  },
  {
    key: 'family',
    question: 'Quelles senteurs aimez-vous ?',
    replies: [
      { label: '🍬 Gourmand & sucré', value: 'gourmand' },
      { label: '🪵 Boisé & oud', value: 'boise' },
      { label: '🌸 Floral', value: 'floral' },
      { label: '🍋 Frais & agrumes', value: 'frais' },
      { label: '🌙 Oriental & ambré', value: 'oriental' },
    ],
  },
  {
    key: 'intensity',
    question: 'Quelle intensité préférez-vous ?',
    replies: [
      { label: 'Légère et discrète', value: 'légère' },
      { label: 'Moyenne', value: 'moyenne' },
      { label: 'Forte, gros sillage', value: 'forte' },
    ],
  },
  {
    key: 'occasion',
    question: 'Pour quelle occasion ?',
    replies: [
      { label: '☀️ Tous les jours', value: 'tous les jours' },
      { label: '💼 Travail', value: 'travail' },
      { label: '🥂 Soirée', value: 'soirée' },
      { label: '❤️ Rendez-vous', value: 'rendez-vous' },
    ],
  },
];

const START_ADVISOR = '__advisor';
const ASK_QUESTION = '__question';
const MAIN_REPLIES: QuickReply[] = [
  { label: '✨ Trouver mon parfum idéal', value: START_ADVISOR },
  { label: '💬 Poser une question', value: ASK_QUESTION },
];

// Questions libres qui relèvent du conseiller plutôt que de la FAQ.
const ADVISOR_INTENT = /quel parfum|choisir|conseil|recommand|sugg|id[ée]e cadeau|offrir|trouver (un|mon) parfum/i;

const TEASER_KEY = 'dn_chat_teaser_seen';

export function FaqChatbot() {
  const pathname = usePathname();
  if (pathname?.startsWith('/cart') || pathname?.startsWith('/checkout')) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Bonjour ! Vous ne savez pas quel parfum choisir ? Je vous guide en 4 questions, ou répondez à vos questions sur la boutique.',
      sender: 'bot',
      replies: MAIN_REPLIES,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Étape en cours du conseiller (null = hors conseiller)
  const [advisorStep, setAdvisorStep] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Partial<AdvisorAnswers>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isOpen, isLoading]);

  // Bulle d'accroche affichée une fois par session
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(TEASER_KEY) === '1'; } catch {}
    if (seen) return;
    const timer = setTimeout(() => setShowTeaser(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTeaser = () => {
    setShowTeaser(false);
    try { sessionStorage.setItem(TEASER_KEY, '1'); } catch {}
  };

  const pushBot = (message: Omit<Message, 'sender'>) =>
    setMessages(prev => [...prev, { ...message, sender: 'bot' }]);

  const askAdvisorStep = (index: number) => {
    const step = ADVISOR_STEPS[index];
    setAdvisorStep(index);
    pushBot({ text: step.question, replies: step.replies });
  };

  const startAdvisor = () => {
    setAnswers({});
    pushBot({ text: 'Parfait, trouvons ensemble votre parfum idéal !' });
    askAdvisorStep(0);
  };

  const showRecommendations = async (finalAnswers: AdvisorAnswers) => {
    setAdvisorStep(null);
    setIsLoading(true);
    try {
      const products = await runRecommendPerfumes(finalAnswers);
      if (products.length === 0) {
        pushBot({
          text: "Je n'ai pas trouvé de parfum disponible pour ces critères. Essayons avec d'autres choix ?",
          replies: [{ label: '🔄 Recommencer', value: START_ADVISOR }],
        });
      } else {
        pushBot({
          text: 'Voici mes 3 recommandations pour vous :',
          products,
          replies: [
            { label: '🔄 Recommencer', value: START_ADVISOR },
            { label: '💬 Poser une question', value: ASK_QUESTION },
          ],
        });
      }
    } catch (error) {
      console.error('Advisor error:', error);
      pushBot({ text: 'Désolé, une erreur est survenue. Veuillez réessayer.', replies: MAIN_REPLIES });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    setMessages(prev => [...prev, { text: reply.label, sender: 'user' }]);

    if (reply.value === START_ADVISOR) {
      startAdvisor();
      return;
    }
    if (reply.value === ASK_QUESTION) {
      setAdvisorStep(null);
      pushBot({ text: 'Je vous écoute : livraison, retours, authenticité... posez votre question ci-dessous.' });
      return;
    }
    if (advisorStep === null) return;

    const step = ADVISOR_STEPS[advisorStep];
    const nextAnswers = { ...answers, [step.key]: reply.value };
    setAnswers(nextAnswers);
    if (advisorStep < ADVISOR_STEPS.length - 1) {
      askAdvisorStep(advisorStep + 1);
    } else {
      showRecommendations(nextAnswers as AdvisorAnswers);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;

    setMessages(prev => [...prev, { text: question, sender: 'user' }]);
    setInput('');

    if (ADVISOR_INTENT.test(question)) {
      startAdvisor();
      return;
    }

    setAdvisorStep(null);
    setIsLoading(true);
    try {
      const result = await runAnswerFaq({ question });
      pushBot({ text: result.answer });
    } catch (error) {
      console.error('Chatbot error:', error);
      pushBot({
        text: "Désolé, je n'ai pas pu répondre. Voulez-vous que je vous aide à choisir un parfum ?",
        replies: MAIN_REPLIES,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openChat = (withAdvisor = false) => {
    dismissTeaser();
    setIsOpen(true);
    if (withAdvisor && advisorStep === null) {
      setMessages(prev => [...prev, { text: '✨ Trouver mon parfum idéal', sender: 'user' }]);
      startAdvisor();
    }
  };

  const lastIndex = messages.length - 1;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="storefront-advisor-panel fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm"
          >
            <Card className="flex h-[70vh] max-h-[620px] flex-col shadow-2xl border-primary/20">
              <CardHeader className="flex-row items-center justify-between border-b bg-muted/30 py-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">Conseiller DubaiNegoce</CardTitle>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      En ligne
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)} aria-label="Fermer le chat">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className="space-y-2">
                        <div
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

                        {message.products && (
                          <div className="ml-10 space-y-2">
                            {message.products.map(product => (
                              <Link
                                key={product.slug}
                                href={`/parfum/${product.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 rounded-xl border bg-background p-2 transition-colors hover:border-primary/50"
                              >
                                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                                  {product.image && (
                                    <Image src={product.image} alt={product.name} fill sizes="56px" className="object-cover" />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-semibold">{product.name}</p>
                                  <p className="truncate text-xs text-muted-foreground">
                                    {product.brand} · {product.family}
                                  </p>
                                  <p className="text-sm font-bold text-primary">{product.price.toFixed(2)} €</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {message.replies && index === lastIndex && !isLoading && (
                          <div className="ml-10 flex flex-wrap gap-2">
                            {message.replies.map(reply => (
                              <button
                                key={reply.value}
                                type="button"
                                onClick={() => handleQuickReply(reply)}
                                className="rounded-full border border-primary/40 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                              >
                                {reply.label}
                              </button>
                            ))}
                          </div>
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
                  <Button type="submit" size="icon" disabled={isLoading} className="shrink-0 h-9 w-9" aria-label="Envoyer">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="storefront-advisor-teaser fixed bottom-20 right-4 z-50 flex max-w-[260px] items-start gap-2 rounded-2xl rounded-br-none border border-primary/20 bg-background p-3 shadow-xl"
          >
            <button type="button" onClick={() => openChat(true)} className="text-left text-sm font-medium leading-snug">
              Vous ne savez pas quel parfum choisir ? 👋
              <span className="mt-1 block text-xs font-normal text-primary">Je vous conseille en 30 secondes</span>
            </button>
            <button type="button" onClick={dismissTeaser} className="text-muted-foreground hover:text-foreground" aria-label="Masquer">
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="storefront-advisor-launcher fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-105"
        onClick={() => (isOpen ? setIsOpen(false) : openChat())}
        aria-label={isOpen ? 'Fermer le chat' : 'Ouvrir le conseiller parfum'}
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
