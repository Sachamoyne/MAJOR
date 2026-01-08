import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, CheckCircle2, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">CoFounder</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/onboarding')}>
            Connexion
          </Button>
        </div>
      </header>
      
      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3 mr-1" />
            Matching intelligent entre co-fondateurs
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight animate-slide-up">
            Trouvez le co-fondateur
            <span className="block text-gradient-accent">qui vous complète</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Un algorithme de matching basé sur la complémentarité des compétences, 
            l'engagement et la vision. Pas un swipe superficiel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Button 
              variant="hero" 
              onClick={() => navigate('/onboarding')}
            >
              Commencer — c'est gratuit
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="hero-secondary"
              onClick={() => navigate('/discover')}
            >
              Voir un aperçu
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
            Onboarding en 5 minutes • Matching par score • 100% gratuit
          </p>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-20 px-4 bg-card border-y border-border/50">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comment ça fonctionne
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Un processus simple et efficace pour former des équipes fondatrices solides
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Définissez votre profil"
              description="Renseignez vos compétences, ce que vous recherchez, votre disponibilité et votre ambition."
              step={1}
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Matching par score"
              description="Notre algorithme calcule un score de compatibilité basé sur la complémentarité réelle."
              step={2}
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Validez la compatibilité"
              description="Des questions guidées avant le premier échange pour décider rapidement si vous avancez ensemble."
              step={3}
            />
          </div>
        </div>
      </section>
      
      {/* What makes us different */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ce n'est pas une app de rencontre
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Un outil sérieux de formation d'équipes fondatrices
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <DifferentiatorCard
              title="Matching par complémentarité"
              description="Pas de swipe aléatoire. Les profils sont ordonnés par score de compatibilité, du plus pertinent au moins pertinent."
              items={[
                'Score de complémentarité des compétences',
                'Score d\'alignement sur l\'engagement',
                'Score d\'alignement sur la vision',
              ]}
            />
            <DifferentiatorCard
              title="Échanges structurés"
              description="Pas de chat libre immédiat. Des questions guidées pour valider rapidement si le fit est là."
              items={[
                'Questions de compatibilité avant tout échange',
                'Objectif : décider vite si on avance ensemble',
                'Moins de temps perdu, plus de résultats',
              ]}
            />
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à trouver votre co-fondateur ?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Rejoignez des centaines de futurs entrepreneurs qui cherchent la personne idéale pour lancer leur projet.
          </p>
          <Button 
            variant="accent"
            size="xl"
            onClick={() => navigate('/onboarding')}
          >
            Créer mon profil gratuitement
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Users className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-medium text-foreground">CoFounder</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 CoFounder. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, step }: { icon: React.ReactNode; title: string; description: string; step: number }) {
  return (
    <div className="relative p-6 rounded-xl bg-gradient-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm">
        {step}
      </div>
      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function DifferentiatorCard({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border/50 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span className="text-foreground">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
