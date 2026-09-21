import { Bot, CircleAlert, CircleCheck, LoaderCircle, Send, UserRound } from 'lucide-react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

type HealthStatus = 'checking' | 'online' | 'offline'
type MessageRole = 'user' | 'model'

type ChatMessage = {
  id: number
  role: MessageRole
  content: string
}

type ChatWorkspaceProps = {
  onHealthChange: (status: HealthStatus) => void
}

const chatApiUrl = import.meta.env.VITE_CHAT_API_URL ?? '/api/chat'

const ChatWorkspace = ({ onHealthChange }: ChatWorkspaceProps) => {
  const [health, setHealth] = useState<HealthStatus>('checking')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const messageId = useRef(0)
  const conversationEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const poll = async () => {
      try {
        const response = await fetch(`${chatApiUrl}/health`, { signal: controller.signal })
        if (!mounted) return
        const nextHealth = response.ok ? 'online' : 'offline'
        setHealth(nextHealth)
        onHealthChange(nextHealth)
      } catch {
        if (!mounted) return
        setHealth('offline')
        onHealthChange('offline')
      }
    }

    void poll()
    const interval = window.setInterval(poll, 10_000)

    return () => {
      mounted = false
      controller.abort()
      window.clearInterval(interval)
    }
  }, [onHealthChange])

  useEffect(() => {
    conversationEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isSending])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const content = draft.trim()
    if (!content || isSending) return

    const userMessage: ChatMessage = { id: ++messageId.current, role: 'user', content }
    const history = messages.slice(-20).map(({ role, content: historyContent }) => ({
      role,
      content: historyContent,
    }))

    setMessages((current) => [...current, userMessage])
    setDraft('')
    setError(null)
    setIsSending(true)

    try {
      const response = await fetch(`${chatApiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, history }),
      })
      const body = (await response.json()) as { answer?: string; error?: string }

      if (!response.ok || !body.answer) {
        throw new Error(body.error ?? 'Não foi possível obter uma resposta')
      }

      setMessages((current) => [
        ...current,
        { id: ++messageId.current, role: 'model', content: body.answer ?? '' },
      ])
      setHealth('online')
      onHealthChange('online')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Não foi possível obter uma resposta')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <section className="workspace chat-workspace" aria-labelledby="chat-title">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Assistente da fazenda</p>
          <h1 id="chat-title">Conversa</h1>
        </div>
        <div className={`health-pill ${health}`}>
          {health === 'checking' ? <LoaderCircle className="spin" size={16} /> : health === 'online' ? <CircleCheck size={16} /> : <CircleAlert size={16} />}
          {health === 'checking' ? 'Verificando' : health === 'online' ? 'Assistente online' : 'Assistente indisponível'}
        </div>
      </div>

      <div className="chat-panel">
        <div className="chat-feed" aria-live="polite">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <span className="chat-avatar model"><Bot size={25} /></span>
              <h2>Bom dia, vizinho.</h2>
              <p>O que você quer saber sobre a fazenda hoje?</p>
            </div>
          ) : (
            messages.map((message) => (
              <article className={`chat-message ${message.role}`} key={message.id}>
                <span className={`chat-avatar ${message.role}`}>
                  {message.role === 'model' ? <Bot size={18} /> : <UserRound size={18} />}
                </span>
                <div>
                  <strong>{message.role === 'model' ? 'Farmoo' : 'Você'}</strong>
                  <p>{message.content}</p>
                </div>
              </article>
            ))
          )}
          {isSending && (
            <div className="chat-message model waiting">
              <span className="chat-avatar model"><Bot size={18} /></span>
              <div><strong>Farmoo</strong><p><LoaderCircle className="spin" size={17} /> Consultando a fazenda...</p></div>
            </div>
          )}
          <div ref={conversationEnd} />
        </div>

        <form className="chat-composer" onSubmit={handleSubmit}>
          {error && <div className="chat-error"><CircleAlert size={16} /> {error}</div>}
          <div className="chat-input-row">
            <textarea
              aria-label="Mensagem"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre animais, produção ou estoque"
              rows={2}
              maxLength={2_000}
              disabled={isSending}
            />
            <button className="chat-send" type="submit" title="Enviar mensagem" disabled={!draft.trim() || isSending}>
              {isSending ? <LoaderCircle className="spin" size={19} /> : <Send size={19} />}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ChatWorkspace
