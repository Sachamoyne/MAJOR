import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Heart, Star, User, MessageCircle, Settings, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMatchingProfiles, useLikeProfile, MatchProfile } from "@/hooks/useMatching";
import { useProfile } from "@/hooks/useProfile";

const Home = () => {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: profiles, isLoading: profilesLoading, refetch } = useMatchingProfiles();
  const likeProfile = useLikeProfile();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  // Check if onboarding is complete
  const isOnboardingComplete = profile?.name && profile?.role;

  // Redirect to onboarding if not complete
  if (!profileLoading && !isOnboardingComplete) {
    navigate('/onboarding');
    return null;
  }

  const currentProfile = profiles?.[currentIndex];
  const hasMoreProfiles = profiles && currentIndex < profiles.length;

  const handleSwipeLeft = useCallback(() => {
    setExitDirection("left");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setExitDirection(null);
    }, 200);
  }, []);

  const handleSwipeRight = useCallback(async () => {
    if (!currentProfile) return;
    
    setExitDirection("right");
    
    try {
      const result = await likeProfile.mutateAsync(currentProfile.user_id);
      
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
        
        if (result.isMatch) {
          navigate("/match", { state: { matchedProfile: currentProfile } });
        }
      }, 200);
    } catch (error) {
      setExitDirection(null);
    }
  }, [currentProfile, likeProfile, navigate]);

  const handleTap = useCallback(() => {
    if (currentProfile) {
      navigate(`/profile/${currentProfile.user_id}`);
    }
  }, [currentProfile, navigate]);

  const handleSuperLike = useCallback(async () => {
    if (!currentProfile) return;
    
    setExitDirection("right");
    
    try {
      await likeProfile.mutateAsync(currentProfile.user_id);
      
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setExitDirection(null);
        // Super like always shows match screen for now
        navigate("/match", { state: { matchedProfile: currentProfile } });
      }, 200);
    } catch (error) {
      setExitDirection(null);
    }
  }, [currentProfile, likeProfile, navigate]);

  const resetMatching = () => {
    setCurrentIndex(0);
    refetch();
  };

  // Loading state
  if (profileLoading || profilesLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Découvrir</h1>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
        <BottomNav currentPath="/home" />
      </div>
    );
  }

  // Empty state
  if (!hasMoreProfiles) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Découvrir</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/70"
              onClick={() => navigate("/messages")}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground/70"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Plus de profils pour le moment
          </h2>
          <p className="text-muted-foreground text-sm mb-8 max-w-xs">
            Tu as vu tous les profils disponibles. Reviens plus tard ou ajuste tes critères.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={() => navigate("/onboarding")} variant="outline">
              Modifier mes critères
            </Button>
            <Button onClick={resetMatching}>
              Recommencer
            </Button>
          </div>
        </div>

        <BottomNav currentPath="/home" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Découvrir</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/70"
            onClick={() => navigate("/messages")}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/70"
            onClick={() => navigate("/settings")}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Card container */}
      <div className="flex-1 px-4 pb-4 relative overflow-hidden">
        <div
          className={cn(
            "h-full transition-transform duration-200",
            exitDirection === "left" && "-translate-x-full rotate-[-20deg] opacity-0",
            exitDirection === "right" && "translate-x-full rotate-[20deg] opacity-0"
          )}
        >
          {currentProfile && (
            <ProfileCard
              profile={currentProfile}
              onTap={handleTap}
            />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-4 pt-2">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleSwipeLeft}
            className="w-14 h-14 rounded-full border-2 border-destructive/30 flex items-center justify-center text-destructive/60 hover:bg-destructive/5 hover:border-destructive/50 hover:text-destructive transition-colors"
          >
            <X className="h-7 w-7" />
          </button>

          <button
            onClick={handleSuperLike}
            disabled={likeProfile.isPending}
            className="w-11 h-11 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary/60 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50"
          >
            <Star className="h-5 w-5" />
          </button>

          <button
            onClick={handleSwipeRight}
            disabled={likeProfile.isPending}
            className="w-14 h-14 rounded-full border-2 border-green-500/30 flex items-center justify-center text-green-500/60 hover:bg-green-500/5 hover:border-green-500/50 hover:text-green-500 transition-colors disabled:opacity-50"
          >
            <Heart className="h-7 w-7" />
          </button>
        </div>

        {/* Progress indicator */}
        {profiles && profiles.length > 0 && (
          <div className="mt-4 flex justify-center gap-1">
            {profiles.slice(0, 10).map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-1 rounded-full transition-all",
                  idx === currentIndex
                    ? "w-6 bg-primary"
                    : idx < currentIndex
                    ? "w-2 bg-primary/30"
                    : "w-2 bg-primary/10"
                )}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav currentPath="/home" />
    </div>
  );
};

// Profile Card Component
function ProfileCard({ profile, onTap }: { profile: MatchProfile; onTap: () => void }) {
  const avatarUrl = profile.avatar_url || 
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name || profile.user_id}`;

  const roleLabels: Record<string, string> = {
    Tech: 'Tech',
    Business: 'Business',
    Design: 'Design',
    Product: 'Produit',
    Other: 'Autre',
  };

  return (
    <div
      onClick={onTap}
      className="h-full bg-card rounded-2xl shadow-card overflow-hidden cursor-pointer border border-border/50"
    >
      {/* Image */}
      <div className="relative h-[55%] w-full">
        <img
          src={avatarUrl}
          alt={profile.name || 'Profil'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Score badge */}
        {profile.compatibility_score > 0 && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {profile.compatibility_score} match{profile.compatibility_score > 1 ? 's' : ''}
          </div>
        )}
        
        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-xl font-semibold">
            {profile.name || 'Anonyme'}{profile.age ? `, ${profile.age}` : ''}
          </h2>
          <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
            {profile.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {profile.city}
              </span>
            )}
            {profile.role && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {roleLabels[profile.role] || profile.role}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-[45%] overflow-y-auto">
        {profile.bio && (
          <p className="text-foreground/80 text-sm mb-4 line-clamp-2">
            {profile.bio}
          </p>
        )}

        {profile.school && (
          <p className="text-muted-foreground text-xs mb-4">
            🎓 {profile.school}
          </p>
        )}

        <p className="text-xs text-muted-foreground mb-2">Tap pour voir le profil complet</p>
      </div>
    </div>
  );
}

// Bottom Navigation Component
const BottomNav = ({ currentPath }: { currentPath: string }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { path: "/home", icon: Heart, label: "Découvrir" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
    { path: "/profile", icon: User, label: "Profil" },
  ];

  return (
    <nav className="border-t border-border/50 bg-white px-6 py-3">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Home;
