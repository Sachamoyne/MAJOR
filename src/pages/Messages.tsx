import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Send, Sparkles, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useMatches, MatchProfile } from "@/hooks/useMatching";
import { useMessages, useSendMessage } from "@/hooks/useMessages";
import { BottomNav } from "@/components/BottomNav";

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
  const { user } = useAuth();
  
  const matchedProfile = location.state?.matchedProfile as MatchProfile | undefined;
  const matchIdFromState = location.state?.matchId as string | undefined;
  
  const { data: matches, isLoading: matchesLoading } = useMatches();
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(matchIdFromState || null);
  const [selectedProfile, setSelectedProfile] = useState<MatchProfile | null>(matchedProfile || null);
  
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedMatchId);
  const sendMessage = useSendMessage();
  
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // If coming from match screen with a matched profile, find the match
  useEffect(() => {
    if (matchedProfile && matches && !selectedMatchId) {
      const match = matches.find(m => 
        m.other_profile?.user_id === matchedProfile.user_id
      );
      if (match) {
        setSelectedMatchId(match.id);
        setSelectedProfile(match.other_profile || null);
      }
    }
  }, [matchedProfile, matches, selectedMatchId]);

  const handleSelectMatch = (matchId: string, profile: MatchProfile | undefined) => {
    setSelectedMatchId(matchId);
    setSelectedProfile(profile || null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedMatchId) return;
    
    try {
      await sendMessage.mutateAsync({
        matchId: selectedMatchId,
        content: newMessage.trim(),
      });
      setNewMessage("");
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleIcebreaker = (text: string) => {
    setNewMessage(text);
  };

  const avatarUrl = selectedProfile?.avatar_url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProfile?.name || 'match'}`;

  // Loading state
  if (matchesLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-4 pt-6 pb-4 border-b border-border/50 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Messages</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  // No matches yet
  if (!matches || matches.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-4 pt-6 pb-4 border-b border-border/50 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Messages</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
            <MessageCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Pas encore de matchs
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs">
            Swipez et matchez pour commencer à discuter avec des co-fondateurs potentiels.
          </p>
          <Button onClick={() => navigate("/home")}>
            Découvrir des profils
          </Button>
        </div>

        <BottomNav />
      </div>
    );
  }

  // Conversation list (if no conversation selected)
  if (!selectedMatchId) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-4 pt-6 pb-4 border-b border-border/50 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Messages</h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          {matches.map((match) => {
            const profile = match.other_profile;
            const avatar = profile?.avatar_url || 
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || match.user_2}`;
            
            return (
              <button
                key={match.id}
                onClick={() => handleSelectMatch(match.id, profile)}
                className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors border-b border-border/30"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary">
                  <img 
                    src={avatar} 
                    alt={profile?.name || 'Match'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-foreground">
                    {profile?.name || 'Anonyme'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    Tap pour discuter
                  </p>
                </div>
                <Heart className="h-4 w-4 text-primary" />
              </button>
            );
          })}
        </div>

        <BottomNav />
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
          onClick={() => {
            setSelectedMatchId(null);
            setSelectedProfile(null);
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        {selectedProfile && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
              <img 
                src={avatarUrl} 
                alt={selectedProfile.name || 'Match'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">
                {selectedProfile.name || 'Anonyme'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {selectedProfile.role === 'technical' ? 'Tech' : 
                 selectedProfile.role === 'business' ? 'Business' :
                 selectedProfile.role === 'product' ? 'Produit' : 'Généraliste'}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messagesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        ) : messages && messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm mb-6">
              Lancez la conversation avec {selectedProfile?.name || 'votre match'}
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
          messages?.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender_id === user?.id ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] px-4 py-2.5 rounded-2xl text-sm",
                  message.sender_id === user?.id
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                )}
              >
                {message.content}
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
            disabled={!newMessage.trim() || sendMessage.isPending}
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
