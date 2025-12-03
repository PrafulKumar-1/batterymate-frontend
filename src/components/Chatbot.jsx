import { useState } from 'react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-green-600 p-4 text-white font-semibold flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span> BatteryMate AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 text-xl font-bold">×</button>
          </div>
          
          {/* Messages Area */}
          <div className="p-4 h-80 overflow-y-auto bg-gray-50 space-y-3">
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700 max-w-[85%]">
                Hello! I can help you find charging stations, predict your battery range, or give eco-driving tips. How can I assist you today?
              </div>
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-3 border-t bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask me anything..." 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              />
              <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors">
                ➤
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  )
}