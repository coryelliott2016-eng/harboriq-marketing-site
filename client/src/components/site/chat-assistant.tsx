import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { LeadAvailabilityGate } from "./lead-availability";
import { LogoMark } from "@/components/site/logo";
import { teamSizeValues, type ChatMessage, type ChatResponse, type LeadResponse } from "@shared/schema";
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const SUGGESTIONS = [
  "What does HarborIQ actually do?",
  "How much does it cost?",
  "How do you handle security?",
  "Are you raising investment?",
];

const WELCOME =
  "Hi — I'm the HarborIQ assistant. Ask me about the product, pricing, security, or the investor round. If I don't know something, I'll say so and get Cory to follow up.";

const OFFLINE_MESSAGE = "Our assistant is temporarily unavailable. Please call ";
const OFFLINE_MESSAGE_TAIL = " for help.";

interface Bubble extends ChatMessage {
  id: number;
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Bubble[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, showLeadForm]);

  // Escape closes the panel — expected behaviour for an overlay.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || pending) return;

    setError(null);
    setInput("");

    const history: ChatMessage[] = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: trimmed },
    ].slice(-20);

    setMessages((prev) => [...prev, { id: nextId.current++, role: "user", content: trimmed }]);
    setPending(true);

    try {
      const res = await apiRequest("POST", "/api/chat", { messages: history });
      const data = (await res.json()) as ChatResponse;
      if (!data.ok || !data.reply) throw new Error("empty reply");
      setMessages((prev) => [...prev, { id: nextId.current++, role: "assistant", content: data.reply }]);
    } catch {
      setError("offline");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close the HarborIQ assistant" : "Ask the HarborIQ assistant"}
        data-testid="button-chat-launcher"
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 items-center gap-2 rounded-full bg-amber-500 px-5 text-sm font-semibold text-brand-950 shadow-lg shadow-brand-950/30 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2"
      >
        {open ? <X className="h-5 w-5" aria-hidden="true" /> : <MessageCircle className="h-5 w-5" aria-hidden="true" />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask HarborIQ"}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="HarborIQ assistant"
          data-testid="panel-chat"
          className="fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col overflow-hidden border-t border-white/10 bg-brand-900 text-white shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-5 sm:h-[560px] sm:w-[400px] sm:rounded-xl sm:border"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-brand-950 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-800">
                <LogoMark className="h-6 w-auto" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">HarborIQ assistant</p>
                <p className="text-xs text-white/50">Answers grounded in this site</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close the HarborIQ assistant"
              data-testid="button-chat-close"
              className="rounded-md p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Transcript */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            data-testid="list-chat-messages"
          >
            <ChatBubble role="assistant">{WELCOME}</ChatBubble>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1" data-testid="list-chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    data-testid={`button-chat-suggestion-${s.slice(0, 12).toLowerCase().replace(/\W+/g, "-")}`}
                    className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200 transition hover:bg-amber-500/20"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => (
              <ChatBubble key={m.id} role={m.role} testId={`text-chat-${m.role}-${m.id}`}>
                {m.content}
              </ChatBubble>
            ))}

            {pending && (
              <div
                className="flex w-fit items-center gap-1.5 rounded-lg rounded-bl-sm bg-white/10 px-3 py-2.5"
                data-testid="status-chat-typing"
                role="status"
                aria-label="Assistant is typing"
              >
                <Dot delay="0ms" />
                <Dot delay="150ms" />
                <Dot delay="300ms" />
              </div>
            )}

            {error && (
              <div
                className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-200"
                role="alert"
                data-testid="text-chat-error"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  {OFFLINE_MESSAGE}
                  <a className="underline" href="tel:+19412101663" data-testid="link-chat-phone">
                    941-210-1663
                  </a>
                  {OFFLINE_MESSAGE_TAIL}
                </span>
              </div>
            )}

            <ChatLeadCard open={showLeadForm} onToggle={() => setShowLeadForm((v) => !v)} />
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-white/10 bg-brand-950 px-3 py-3"
            data-testid="form-chat"
          >
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="chat-input">
                Ask a question about HarborIQ
              </label>
              <Input
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about pricing, features, security…"
                className="border-white/15 bg-white/5 text-white placeholder:text-white/60"
                data-testid="input-chat-message"
                autoComplete="off"
              />
              <Button
                type="submit"
                size="icon"
                disabled={pending || !input.trim()}
                aria-label="Send message"
                data-testid="button-chat-send"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </div>
            <p className="mt-2 text-[11px] leading-snug text-white/60">
              AI assistant — it can be wrong. Pricing shown on this site is a draft framework.
            </p>
          </form>
        </div>
      )}
    </>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/60"
      style={{ animationDelay: delay }}
    />
  );
}

/** The model is told to answer in plain text; this strips any stray markdown
 *  emphasis so bubbles never show literal asterisks or backticks. */
function plainText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/(^|\s)\*(\S[^*]*?)\*(?=\s|$|[.,!?])/g, "$1$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "");
}

function ChatBubble({
  role,
  children,
  testId,
}: {
  role: "user" | "assistant";
  children: string;
  testId?: string;
}) {
  const isUser = role === "user";
  return (
    <div className={isUser ? "flex justify-end" : "flex justify-start"}>
      <p
        data-testid={testId}
        className={
          isUser
            ? "max-w-[85%] whitespace-pre-wrap rounded-lg rounded-br-sm bg-amber-500 px-3 py-2 text-sm text-brand-950"
            : "max-w-[90%] whitespace-pre-wrap rounded-lg rounded-bl-sm bg-white/10 px-3 py-2 text-sm text-white/90"
        }
      >
        {isUser ? children : plainText(children)}
      </p>
    </div>
  );
}

const chatLeadSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name"),
  businessName: z.string().trim().min(1, "Enter your business"),
  email: z.string().trim().email("Enter a valid email address"),
  teamSize: z.enum(teamSizeValues, { message: "Select a team size" }),
});

type ChatLeadValues = z.infer<typeof chatLeadSchema>;

/** Collapsible "Leave your details" mini-form. Posts to the existing /api/leads. */
function ChatLeadCard({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [done, setDone] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ChatLeadValues>({
    resolver: zodResolver(chatLeadSchema),
    defaultValues: { fullName: "", businessName: "", email: "", teamSize: undefined as unknown as ChatLeadValues["teamSize"] },
  });

  async function onSubmit(values: ChatLeadValues) {
    setFailed(false);
    setSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/leads", { ...values, source: "ai_chat" });
      const data = (await res.json()) as LeadResponse;
      setDone(data.message);
      form.reset();
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-white/10 bg-brand-950/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        data-testid="button-chat-lead-toggle"
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          Leave your details
          <Badge variant="outline" className="border-white/15 text-[10px] font-normal text-white/50">
            30 seconds
          </Badge>
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-white/50" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/50" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div className="border-t border-white/10 px-3 py-3">
          <LeadAvailabilityGate>
          {done ? (
            <p
              className="flex items-start gap-2 text-xs text-teal-200"
              data-testid="text-chat-lead-success"
              role="status"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {done}
            </p>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2.5"
                data-testid="form-chat-lead"
                noValidate
              >
                <ChatField form={form} name="fullName" label="Name" placeholder="Jamie Rivera" testId="input-chat-lead-name" />
                <ChatField form={form} name="businessName" label="Business" placeholder="Rivera Marine Services" testId="input-chat-lead-business" />
                <ChatField form={form} name="email" label="Email" placeholder="jamie@riveramarine.com" type="email" testId="input-chat-lead-email" />

                <FormField
                  control={form.control}
                  name="teamSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] text-white/60">Team size</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger
                            className="h-9 border-white/15 bg-white/5 text-sm text-white"
                            data-testid="select-chat-lead-team-size"
                          >
                            <SelectValue placeholder="Select team size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="solo">Solo — just me</SelectItem>
                          <SelectItem value="team">Team — up to ~10 people</SelectItem>
                          <SelectItem value="business">Business — multiple crews/locations</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {failed && (
                  <p className="text-[11px] text-red-300" role="alert" data-testid="text-chat-lead-error">
                    We could not confirm that your request was saved. Please call 941-210-1663.
                  </p>
                )}

                <Button type="submit" size="sm" disabled={submitting} data-testid="button-chat-lead-submit">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Send my details"}
                </Button>
                <p className="text-center text-[11px] text-white/60">
                  Prefer a walkthrough?{" "}
                  <Link href="/demo" className="underline hover:text-white/70" data-testid="link-chat-demo">
                    Get a demo
                  </Link>
                </p>
              </form>
            </Form>
          )}
          </LeadAvailabilityGate>
        </div>
      )}
    </div>
  );
}

function ChatField({
  form,
  name,
  label,
  placeholder,
  testId,
  type = "text",
}: {
  form: ReturnType<typeof useForm<ChatLeadValues>>;
  name: "fullName" | "businessName" | "email";
  label: string;
  placeholder: string;
  testId: string;
  type?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[11px] text-white/60">{label}</FormLabel>
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              className="h-9 border-white/15 bg-white/5 text-sm text-white placeholder:text-white/30"
              data-testid={testId}
            />
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  );
}
