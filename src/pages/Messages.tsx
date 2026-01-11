import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserProfile } from "@/types";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "match";
  timestamp: Date;
}

interface Conversation {
  matchId: string;
  matchProfile: UserProfile;
  messages: Message[];
  lastActivity: Date;
}

// Mock conversations for demo
const mockConversations: Conversation[] = [];

// Icebreaker suggestions
const icebreakers = [
  "Quel est ton projet idéal ?",
  "Tu préfères bootstrapper ou lever des fonds ?",
  "Quelle est ta plus grande force ?",
  "Tu cherches un side-project ou du full-time ?",
  "Qu'est-ce qui te motive à entreprendre ?",
];

const Messages = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const matchedProfile = location.state?.matchedProfile as UserProfile | undefined;
  
  const [conversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If coming from a match, create a new conversation view
  useEffect(() => {
    if (matchedProfile && !activeConversation) {
      setActiveConversation({
        matchId: matchedProfile.id,
        matchProfile: matchedProfile,
        messages: [],
        lastActivity: new Date(),
      });
    }
  }, [matchedProfile, activeConversation]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate response after 1-2 seconds
    setTimeout(() => {
      const responses = [
        "Super question ! J'y réfléchis...",
        "Intéressant ! On devrait en discuter plus.",
        "Exactement ce que je me demandais aussi !",
        "J'adore cette énergie ! 🚀",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: randomResponse,
        sender: "match",
        timestamp: new Date(),
      }]);
    }, 1000 + Math.random() * 1000);
  };

  const handleIcebreaker = (text: string) => {
    setNewMessage(text);
  };

  const avatarUrl = activeConversation?.matchProfile?.avatar || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeConversation?.matchProfile?.firstName || 'match'}`;

  // If no active conversation and no conversations exist
  if (!activeConversation && conversations.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-4 pt-6 pb-4 border-b border-border/50 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/home")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Messages</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
            <Send className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Pas encore de messages
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs">
            Swipez et matchez pour commencer à discuter avec des co-fondateurs potentiels.
          </p>
          <Button onClick={() => navigate("/home")}>
            Découvrir des profils
          </Button>
        </div>
      </div>
    );
  }

  // Conversation view
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 border-b border-border/50 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/home")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {activeConversation && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
              <img 
                src={avatarUrl} 
                alt={activeConversation.matchProfile.firstName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">
                {activeConversation.matchProfile.firstName}
              </h1>
              <p className="text-xs text-muted-foreground">
                {activeConversation.matchProfile.role === 'technical' ? 'Tech' : 
                 activeConversation.matchProfile.role === 'business' ? 'Business' :
                 activeConversation.matchProfile.role === 'product' ? 'Produit' :
                 activeConversation.matchProfile.role === 'marketing' ? 'Marketing' : 'Généraliste'}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm mb-6">
              Lancez la conversation avec {activeConversation?.matchProfile.firstName}
            </p>
            
            {/* Icebreakers */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Questions suggérées</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {icebreakers.slice(0, 3).map((icebreaker, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleIcebreaker(icebreaker)}
                    className="px-4 py-2 text-sm text-foreground bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                  >
                    {icebreaker}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                )}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border/50 bg-white">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez un message..."
            className="flex-1 rounded-full px-4"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Messages;
