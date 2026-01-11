import { useNavigate, useLocation } from "react-router-dom";
import { Heart, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";

const MatchScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const matchedProfile = location.state?.matchedProfile as UserProfile | undefined;

  const avatarUrl = matchedProfile?.avatar || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${matchedProfile?.firstName || 'match'}`;

  // Fake current user avatar
  const currentUserAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=currentuser";

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-6 text-center">
      {/* Animated background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Hearts animation */}
        <div className="mb-8 relative">
          <Sparkles className="absolute -top-4 -left-4 h-6 w-6 text-white/60 animate-pulse" />
          <Sparkles className="absolute -top-2 -right-6 h-5 w-5 text-white/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Heart className="h-16 w-16 text-white fill-white animate-scale-in" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3 animate-fade-in">
          It's a Match !
        </h1>
        <p className="text-white/80 text-sm mb-10 max-w-xs animate-fade-in" style={{ animationDelay: '100ms' }}>
          {matchedProfile 
            ? `Toi et ${matchedProfile.firstName} avez matché. Lancez la conversation !`
            : "Vous avez un nouveau match. Lancez la conversation !"
          }
        </p>

        {/* Avatars */}
        <div className="flex items-center justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-white/30 overflow-hidden bg-white/10">
              <img 
                src={currentUserAvatar} 
                alt="Vous"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Heart className="h-8 w-8 text-white fill-white" />
          </div>
          
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-4 border-white/30 overflow-hidden bg-white/10">
              <img 
                src={avatarUrl} 
                alt={matchedProfile?.firstName || "Match"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={() => navigate("/messages", { state: { matchedProfile } })}
          className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 rounded-full text-base animate-slide-up"
          style={{ animationDelay: '300ms' }}
        >
          <MessageCircle className="h-5 w-5 mr-2" />
          Lancer la conversation
        </Button>

        {/* Skip */}
        <button
          onClick={() => navigate("/home")}
          className="mt-6 text-white/60 text-sm hover:text-white/80 transition-colors animate-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          Continuer à swiper
        </button>
      </div>
    </div>
  );
};

export default MatchScreen;
