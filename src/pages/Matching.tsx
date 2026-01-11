import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { X, Heart, Star, SlidersHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SwipeCard } from "@/components/SwipeCard";
import { mockProfiles } from "@/data/mockProfiles";
import { UserProfile } from "@/types";
import { cn } from "@/lib/utils";

const Matching = () => {
  const navigate = useNavigate();
  const [profiles] = useState<UserProfile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading] = useState(false);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const currentProfile = profiles[currentIndex];
  const hasMoreProfiles = currentIndex < profiles.length;

  const handleSwipeLeft = useCallback(() => {
    setExitDirection("left");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setExitDirection(null);
    }, 200);
  }, []);

  const handleSwipeRight = useCallback(() => {
    setExitDirection("right");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setExitDirection(null);
    }, 200);
  }, []);

  const handleTap = useCallback(() => {
    if (currentProfile) {
      navigate(`/profile/${currentProfile.id}`);
    }
  }, [currentProfile, navigate]);

  const handleSuperLike = useCallback(() => {
    setExitDirection("right");
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setExitDirection(null);
    }, 200);
  }, []);

  const resetMatching = () => {
    setCurrentIndex(0);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-sm mx-auto px-6">
            {/* Skeleton card */}
            <div className="h-[70vh] bg-secondary/30 rounded-2xl animate-pulse" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Empty state
  if (!hasMoreProfiles) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <header className="px-6 pt-6 pb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">Matching</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/70"
            onClick={() => navigate("/onboarding")}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Matching</h1>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground/70"
          onClick={() => navigate("/onboarding")}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
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
            <SwipeCard
              profile={currentProfile}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onTap={handleTap}
            />
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 pb-8 pt-2">
        <div className="flex items-center justify-center gap-4">
          {/* Pass button */}
          <button
            onClick={handleSwipeLeft}
            className="w-14 h-14 rounded-full border-2 border-destructive/30 flex items-center justify-center text-destructive/60 hover:bg-destructive/5 hover:border-destructive/50 hover:text-destructive transition-colors"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Super Like button */}
          <button
            onClick={handleSuperLike}
            className="w-11 h-11 rounded-full border-2 border-primary/30 flex items-center justify-center text-primary/60 hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Star className="h-5 w-5" />
          </button>

          {/* Like button */}
          <button
            onClick={handleSwipeRight}
            className="w-14 h-14 rounded-full border-2 border-success/30 flex items-center justify-center text-success/60 hover:bg-success/5 hover:border-success/50 hover:text-success transition-colors"
          >
            <Heart className="h-7 w-7" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex justify-center gap-1">
          {profiles.map((_, idx) => (
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
      </div>
    </div>
  );
};

export default Matching;
