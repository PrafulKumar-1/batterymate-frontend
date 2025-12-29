import { useState, useRef, useEffect } from 'react'
import api from '../services/api'
import '../styles/Chatbot.css'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your BatteryMate AI Assistant. I can help you with:\n\n🔋 EV battery tips\n🌍 Eco-driving advice\n⚡ Charging station info\n🗺️ Route optimization\n📊 Environmental impact\n\nWhat can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(null)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported in this browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        })
      },
      (err) => {
        console.error('Geolocation error', err)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    )
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setLoading(true)

    try {
      const response = await api.post('/api/chatbot/message', {
        message: inputValue,
        location
      })

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.reply || "Sorry, I couldn't understand that. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chatbot error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: "❌ Connection error. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
        >
          {isOpen ? '✕' : '💬'}
        </button>
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 z-50">
          <div className="bg-emerald-500 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">EV Assistant</h2>
              <p className="text-xs text-emerald-100">
                Always ready to help with your EV journeys
              </p>
            </div>
            <span className="text-2xl">⚡</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm message-bubble ${
                    message.sender === 'user'
                      ? 'bg-emerald-500 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{message.text}</p>
                  <span className="block text-[10px] text-slate-400 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white text-slate-800 rounded-2xl rounded-bl-sm px-3 py-2 text-sm shadow-sm flex items-center space-x-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-slate-200 p-3 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="flex-1 border border-slate-300 rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Ask about your EV, charging, or routes..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-full px-4 py-2 text-sm font-medium"
              >
                ➤
              </button>
            </div>
            <p className="mt-1 text-[10px] text-slate-400">
              {location
                ? `Using your location: ${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`
                : 'Location not available or permission denied.'}
            </p>
          </form>
        </div>
      )}
    </>
  )
}
