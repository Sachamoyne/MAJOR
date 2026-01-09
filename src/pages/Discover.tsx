import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MatchCard } from '@/components/MatchCard';
import { getMockMatches } from '@/data/mockProfiles';
import { Match } from '@/types';
import { Users, Filter, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Discover() {
  const navigate = useNavigate();
  const [matches] = useState<Match[]>(getMockMatches());
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const currentMatch = matches[currentIndex];
  
  const handlePass = (match: Match) => {
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info("Vous avez vu tous les profils disponibles !");
    }
  };
  
  const handleConnect = (match: Match) => {
    toast.success(`Demande de connexion envoyée à ${match.profile.firstName} !`);
    if (currentIndex < matches.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handleView = (match: Match) => {
    // Could navigate to detailed profile view
  };
  
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">CoFounder</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Vos matchs
          </h1>
          <p className="text-muted-foreground">
            {matches.length} profils triés par compatibilité
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>Profil {currentIndex + 1} sur {matches.length}</span>
          <div className="flex gap-1">
            {matches.map((_, idx) => (
              <div 
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentIndex 
                    ? 'bg-primary' 
                    : idx < currentIndex 
                    ? 'bg-primary/30' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Match card */}
        {currentMatch && (
          <MatchCard
            key={currentMatch.profile.id}
            match={currentMatch}
            onView={handleView}
            onPass={handlePass}
            onConnect={handleConnect}
          />
        )}
        
        {/* Quick navigation */}
        <div className="mt-6 flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          >
            Précédent
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentIndex === matches.length - 1}
            onClick={() => setCurrentIndex(Math.min(matches.length - 1, currentIndex + 1))}
          >
            Suivant
          </Button>
        </div>
      </main>
    </div>
  );
}
