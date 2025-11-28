'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FileText,
  Calculator,
  Calendar,
  Lightbulb,
  Copy,
  Check,
} from 'lucide-react';
import styles from './ai.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestions = [
  { icon: BookOpen, text: 'Help me understand recursion' },
  { icon: FileText, text: 'Write a formal email to professor' },
  { icon: Calculator, text: 'Calculate my GPA' },
  { icon: Calendar, text: 'Create a study schedule' },
];

const initialMessage: Message = {
  id: '0',
  role: 'assistant',
  content: "Hi! I'm your Campus Connect AI assistant. I can help you with:\n\n• **Study help** - Explain concepts, solve problems\n• **Writing** - Emails, essays, reports\n• **Planning** - Study schedules, task management\n• **Campus info** - Events, resources, FAQ\n\nHow can I help you today?",
  timestamp: new Date(),
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('gpa') || msg.includes('grade')) {
      return "Based on your current grades, your cumulative GPA is **3.75**. \n\nHere's a breakdown:\n- Current semester: 3.8 GPA\n- Total credits: 78/120\n- Projected graduation GPA: 3.7-3.8\n\nWould you like me to calculate what grades you need to reach a specific GPA target?";
    }
    
    if (msg.includes('email') || msg.includes('professor')) {
      return "Here's a template for a formal email to your professor:\n\n---\n**Subject:** [Course Code] - [Brief Topic]\n\nDear Professor [Name],\n\nI hope this email finds you well. My name is [Your Name], and I am a student in your [Course Name] class (Student ID: [Number]).\n\n[Your message here]\n\nThank you for your time and consideration.\n\nBest regards,\n[Your Name]\n\n---\n\nWould you like me to customize this for a specific situation?";
    }
    
    if (msg.includes('study') || msg.includes('schedule')) {
      return "Here's a suggested study schedule based on your upcoming deadlines:\n\n📅 **This Week:**\n\n**Monday-Tuesday:** Focus on CS301 Binary Tree assignment (~4 hours)\n\n**Wednesday:** MATH301 Problem Set (~3 hours)\n\n**Thursday-Friday:** Start ML Neural Network project (~6 hours)\n\n**Weekend:** Continue ML project, review for CS301 midterm\n\n💡 **Tips:**\n- Take 10-min breaks every 50 minutes\n- Study difficult subjects when you're most alert\n- Use active recall instead of re-reading\n\nWould you like me to adjust this schedule?";
    }
    
    if (msg.includes('recursion')) {
      return "**Recursion Explained Simply:**\n\nRecursion is when a function calls itself to solve a smaller version of the same problem.\n\n**Key Components:**\n1. **Base case** - When to stop (prevents infinite loop)\n2. **Recursive case** - The function calling itself\n\n**Example - Factorial:**\n```python\ndef factorial(n):\n    if n <= 1:        # Base case\n        return 1\n    return n * factorial(n-1)  # Recursive case\n```\n\n**How it works:** factorial(4) → 4 × factorial(3) → 4 × 3 × factorial(2) → 4 × 3 × 2 × 1 = 24\n\nWant me to explain with more examples?";
    }
    
    return "I'd be happy to help with that! Could you provide more details about what you're looking for? I can assist with:\n\n• Explaining course concepts\n• Writing and editing documents\n• Planning your study schedule\n• Answering campus-related questions\n• Practice problems and quizzes";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = generateResponse(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Bot size={24} />
        </div>
        <div>
          <h1>AI Assistant</h1>
          <p>Powered by Campus Connect AI</p>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            className={`${styles.message} ${styles[message.role]}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message.role === 'assistant' && (
              <div className={styles.avatar}>
                <Sparkles size={16} />
              </div>
            )}
            <div className={styles.messageContent}>
              <div 
                className={styles.messageText}
                dangerouslySetInnerHTML={{ 
                  __html: message.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br>')
                    .replace(/```(\w+)?\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
                }}
              />
              {message.role === 'assistant' && (
                <button 
                  className={styles.copyBtn}
                  onClick={() => handleCopy(message.content, message.id)}
                >
                  {copied === message.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </motion.div>
        ))}
        
        {isTyping && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.avatar}>
              <Sparkles size={16} />
            </div>
            <div className={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              className={styles.suggestionBtn}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSuggestion(suggestion.text)}
            >
              <suggestion.icon size={16} />
              <span>{suggestion.text}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className={styles.input}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
        >
          <Send size={20} />
        </motion.button>
      </div>
    </div>
  );
}

