import { useState } from "react";
import { MapPin } from "lucide-react";
import { UserProfile } from "@/types";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  profile: UserProfile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onTap: () => void;
}

export function SwipeCard({ profile, onSwipeLeft, onSwipeRight, onTap }: SwipeCardProps) {
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const threshold = 100;
  const deltaX = currentX - startX;
  const rotation = deltaX * 0.05;
  const opacity = Math.max(0, 1 - Math.abs(deltaX) / 300);

  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setCurrentX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (deltaX > threshold) {
      onSwipeRight();
    } else if (deltaX < -threshold) {
      onSwipeLeft();
    }

    setCurrentX(startX);
  };

  const handleClick = () => {
    if (Math.abs(deltaX) < 10) {
      onTap();
    }
  };

  // Default avatar if none provided
  const avatarUrl = profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.firstName}`;

  return (
    <div
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none"
      style={{
        transform: isDragging ? `translateX(${deltaX}px) rotate(${rotation}deg)` : "none",
        transition: isDragging ? "none" : "transform 0.3s ease-out",
        opacity: isDragging ? opacity : 1,
      }}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onClick={handleClick}
    >
      {/* Swipe indicators */}
      <div
        className={cn(
          "absolute top-8 left-6 z-20 px-4 py-2 rounded-lg border-2 font-bold text-xl rotate-[-15deg] transition-opacity",
          "border-destructive text-destructive",
          deltaX < -50 ? "opacity-100" : "opacity-0"
        )}
      >
        PASS
      </div>
      <div
        className={cn(
          "absolute top-8 right-6 z-20 px-4 py-2 rounded-lg border-2 font-bold text-xl rotate-[15deg] transition-opacity",
          "border-success text-success",
          deltaX > 50 ? "opacity-100" : "opacity-0"
        )}
      >
        LIKE
      </div>

      {/* Card */}
      <div className="h-full bg-white rounded-2xl overflow-hidden shadow-lg">
        {/* Photo - 50% height */}
        <div className="relative h-[50%] w-full">
          <img
            src={avatarUrl}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6 overflow-y-auto" style={{ height: "50%" }}>
          {/* Identity */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              {profile.firstName} {profile.lastName}
            </h2>
            {profile.location && (
              <div className="flex items-center gap-1.5 mt-1 text-primary/70">
                <MapPin className="h-3.5 w-3.5" />
                <span className="text-sm">{profile.location}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <p className="text-foreground/80 text-sm leading-relaxed mb-5 line-clamp-3">
            {profile.bio}
          </p>

          {/* Skills */}
          <div className="mb-5">
            <h3 className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
              Compétences
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.skills.slice(0, 4).map((userSkill) => (
                <span
                  key={userSkill.skill.id}
                  className="px-2.5 py-1 text-xs text-foreground bg-secondary rounded-full"
                >
                  {userSkill.skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Wanted Skills */}
          <div>
            <h3 className="text-xs font-medium text-primary uppercase tracking-wider mb-2">
              Recherche
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profile.wantedSkills.slice(0, 3).map((wantedSkill) => (
                <span
                  key={wantedSkill.skill.id}
                  className="px-2.5 py-1 text-xs text-foreground border border-primary/20 rounded-full"
                >
                  {wantedSkill.skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
