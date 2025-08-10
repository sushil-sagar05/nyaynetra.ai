'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  SendHorizontal,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Copy
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import api from '@/lib/api'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface StreamEvent {
  type: 'status' | 'word' | 'complete' | 'error' | 'done'
  message?: string
  word?: string
  index?: number
  response?: string
}

interface ChatUIProps {
  documentId: string
  isAnalysisReady?: boolean
}

export function ChatUI({ documentId, isAnalysisReady = true }: ChatUIProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState('')
  const [connectionError, setConnectionError] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages, streamingMessage])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return
    if (!isAnalysisReady) {
      toast.error('Document analysis is not complete. Please wait for analysis to finish.')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setStreamingMessage('')
    setConnectionError(false)

    try {
      let assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true
      }

      setMessages(prev => [...prev, assistantMessage])

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_Backend_Url}/analyze/chat-stream/${documentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ message: userMessage.content })
        }
      )

      if (!response.ok) {
        if (response.status === 401) {
          try {
            await api.post("/refresh-token")
            const retryResponse = await fetch(
              `${process.env.NEXT_PUBLIC_Backend_Url}/analyze/chat-stream/${documentId}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ message: userMessage.content })
              }
            )
            
            if (retryResponse.ok) {
              await handleStreamResponse(retryResponse, assistantMessage.id)
              return
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError)
            throw new Error("Authentication failed. Please login again.")
          }
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      await handleStreamResponse(response, assistantMessage.id)

    } catch (error) {
      console.error('Chat streaming error:', error)
      setConnectionError(true)
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to get response. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
      setStreamingMessage('')
    }
  }

  const handleStreamResponse = async (response: Response, messageId: string) => {
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('Response body is not readable')
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData: StreamEvent = JSON.parse(line.slice(6))
            await handleStreamEvent(eventData, messageId)
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', parseError)
          }
        }
      }
    }
  }

  const handleStreamEvent = async (event: StreamEvent, messageId: string) => {
    switch (event.type) {
      case 'status':
        setStreamingMessage(event.message || '')
        break

      case 'word':
        if (event.word) {
          setStreamingMessage(prev => prev + (prev ? ' ' : '') + event.word)
        }
        break

      case 'complete':
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? {
                ...msg,
                content: event.response || streamingMessage,
                isStreaming: false
              }
            : msg
        ))
        setStreamingMessage('')
        break

      case 'error':
        setMessages(prev => prev.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                content: `Error: ${event.message || 'Unknown error occurred'}`,
                isStreaming: false
              }
            : msg
        ))
        setStreamingMessage('')
        toast.error(event.message || 'Chat error occurred')
        break

      case 'done':
        setIsLoading(false)
        break
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (!isAnalysisReady) {
    return (
      <div className="w-full h-[70vh] max-h-[70vh] flex flex-col">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex-shrink-0 pb-2 sm:pb-3">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              Ask NyayAI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin mx-auto mb-3 sm:mb-4 text-muted-foreground" />
              <p className="text-sm sm:text-base text-muted-foreground">
                Document analysis in progress...
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Chat will be available once analysis is complete
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full h-[70vh] max-h-[70vh] flex flex-col relative">
      <Card className="h-full flex flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0 pb-2 sm:pb-3 border-b bg-background">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            Ask NyayAI
            {connectionError && (
              <Badge variant="destructive" className="ml-auto text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Connection Error</span>
                <span className="sm:hidden">Error</span>
              </Badge>
            )}
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground ">
            Ask questions about your legal document analysis
          </p>
        </CardHeader>
        <div className="flex-1 overflow-hidden relative">
          <ScrollArea 
            className="h-full w-full absolute inset-0" 
            ref={scrollAreaRef}
          >
            <div className="p-2 sm:p-4">
              <div className="space-y-3 sm:space-y-4 pb-4">
                {messages.length === 0 && (
                  <div className="text-center py-6 sm:py-8">
                    <Bot className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
                    <h3 className="text-sm sm:text-base font-semibold mb-2">Welcome to NyayAI Chat</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 px-2">
                      I can help you understand your legal document. Try asking:
                    </p>
                    <div className="space-y-2 text-xs sm:text-sm px-2">
                      <div className="p-2 sm:p-3 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors"
                           onClick={() => setInputMessage("What are the key terms and conditions?")}>
                        "What are the key terms and conditions?"
                      </div>
                      <div className="p-2 sm:p-3 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors"
                           onClick={() => setInputMessage("What are the main risks in this document?")}>
                        "What are the main risks in this document?"
                      </div>
                      <div className="p-2 sm:p-3 bg-muted rounded cursor-pointer hover:bg-muted/80 transition-colors"
                           onClick={() => setInputMessage("Explain the liability clauses")}>
                        "Explain the liability clauses"
                      </div>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2 sm:gap-3",
                      message.type === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.type === 'assistant' && (
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mt-1 flex-shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={cn(
                        "max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2",
                        message.type === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      )}
                    >
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                          {message.content}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(message.timestamp)}
                          </span>
                          {message.type === 'assistant' && !message.isStreaming && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-5 px-1 sm:h-6 sm:px-2"
                              onClick={() => copyToClipboard(message.content)}
                            >
                              <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {message.type === 'user' && (
                      <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mt-1 flex-shrink-0">
                        <AvatarFallback className="bg-secondary">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {streamingMessage && (
                  <div className="flex gap-2 sm:gap-3 justify-start">
                    <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 bg-muted text-foreground">
                      <p className="text-xs sm:text-sm leading-relaxed break-words overflow-wrap-anywhere">
                        {streamingMessage}
                        <span className="inline-block w-1.5 h-3 sm:w-2 sm:h-4 bg-primary animate-pulse ml-1" />
                      </p>
                    </div>
                  </div>
                )}
                {isLoading && !streamingMessage && (
                  <div className="flex gap-2 sm:gap-3 justify-start">
                    <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mt-1 flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 bg-muted text-foreground">
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Processing your question...
                      </p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>
          </ScrollArea>
        </div>
        <div className="flex-shrink-0 border-t bg-background">
          <div className="p-2 sm:p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your document..."
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="flex-shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                ) : (
                  <SendHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
