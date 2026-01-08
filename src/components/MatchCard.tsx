import { Match, MatchLevel } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Briefcase, Clock, Target, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
  onView: (match: Match) => void;
  onPass: (match: Match) => void;
  onConnect: (match: Match) => void;
}

const levelLabels: Record<MatchLevel, string> = {
  excellent: 'Très complémentaire',
  good: 'Bon fit',
  explore: 'À explorer',
};

const levelVariants: Record<MatchLevel, 'excellent' | 'good' | 'explore'> = {
  excellent: 'excellent',
  good: 'good',
  explore: 'explore',
};

const roleLabels = {
  technical: 'Technique',
  product: 'Produit',
  business: 'Business',
  marketing: 'Marketing',
  generalist: 'Généraliste',
};

const availabilityLabels = {
  'full-time': 'Temps plein',
  'part-time': 'Temps partiel',
  'evenings-weekends': 'Soirs & weekends',
};

const ambitionLabels = {
  lifestyle: 'Lifestyle business',
  growth: 'Croissance',
  unicorn: 'Licorne',
};

export function MatchCard({ match, onView, onPass, onConnect }: MatchCardProps) {
  const { profile, score, level, reasons } = match;
  
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
  
  return (
    <Card className="group overflow-hidden border-border/50 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in">
      <CardContent className="p-0">
        {/* Header with score */}
        <div className="relative p-6 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-xl font-semibold text-foreground border border-border/50">
                  {initials}
                </div>
                {level === 'excellent' && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-success-foreground" />
                  </div>
                )}
              </div>
              
              {/* Name & Badge */}
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {profile.firstName} {profile.lastName}
                </h3>
                <Badge variant={levelVariants[level]} className="mt-1">
                  {levelLabels[level]}
                </Badge>
              </div>
            </div>
            
            {/* Score */}
            <div className="text-right">
              <div className={cn(
                "text-3xl font-bold",
                level === 'excellent' && "text-success",
                level === 'good' && "text-accent",
                level === 'explore' && "text-muted-foreground"
              )}>
                {score.overall}%
              </div>
              <p className="text-xs text-muted-foreground">compatibilité</p>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        <div className="px-6 pb-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {profile.bio}
          </p>
        </div>
        
        {/* Meta info */}
        <div className="px-6 pb-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{roleLabels[profile.role]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{availabilityLabels[profile.availability]}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Target className="w-3.5 h-3.5" />
            <span>{ambitionLabels[profile.ambition]}</span>
          </div>
          {profile.location && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>
        
        {/* Key skills */}
        <div className="px-6 pb-4">
          <p className="text-xs font-medium text-foreground mb-2">Compétences clés</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.slice(0, 4).map((userSkill) => (
              <Badge key={userSkill.skill.id} variant="skill" className="text-xs">
                {userSkill.skill.name}
                {userSkill.level === 'expert' && ' ⭐'}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Match reasons */}
        <div className="px-6 pb-4">
          <p className="text-xs font-medium text-foreground mb-2">Pourquoi ce match</p>
          <ul className="space-y-1">
            {reasons.map((reason, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-1 h-1 rounded-full bg-accent" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Score breakdown */}
        <div className="px-6 pb-4 grid grid-cols-3 gap-2">
          <ScoreBar label="Compétences" value={score.skillComplementarity} />
          <ScoreBar label="Disponibilité" value={score.availability} />
          <ScoreBar label="Vision" value={score.ambition} />
        </div>
        
        {/* Actions */}
        <div className="p-4 bg-muted/30 border-t border-border/50 flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onPass(match)}
          >
            Passer
          </Button>
          <Button 
            variant="accent"
            className="flex-1"
            onClick={() => onConnect(match)}
          >
            Connecter
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500",
            value >= 80 ? "bg-success" : value >= 60 ? "bg-accent" : "bg-muted-foreground"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
