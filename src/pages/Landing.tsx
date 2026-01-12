import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect authenticated users to home
  useEffect(() => {
    if (!loading && user) {
      navigate('/home');
    }
  }, [user, loading, navigate]);
  
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
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Se connecter
            </Button>
            <Button variant="default" onClick={() => navigate('/auth')}>
              S'inscrire
            </Button>
          </div>
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
            <span className="block text-primary">qui vous complète</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Un algorithme de matching basé sur la complémentarité des compétences, 
            l'engagement et la vision. Pas un swipe superficiel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Button 
              variant="hero" 
              onClick={() => navigate('/auth')}
            >
              Trouver un co-fondateur
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button 
              variant="hero-secondary"
              onClick={() => navigate('/auth')}
            >
              S'inscrire
            </Button>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
            Onboarding en 5 minutes • Matching par score • 100% gratuit
          </p>
        </div>
      </section>
      
      {/* Social Proof */}
      <section className="py-16 px-4 border-y border-border/50 bg-secondary/30">
        <div className="container max-w-5xl mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Ils nous font confiance
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Profils actifs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">HEC • ESSEC</p>
              <p className="text-sm text-muted-foreground">Business Schools</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">42 • Epitech</p>
              <p className="text-sm text-muted-foreground">Tech Schools</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">150+</p>
              <p className="text-sm text-muted-foreground">Matchs cette semaine</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-20 px-4 bg-card border-b border-border/50">
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
              title="Swipez les profils"
              description="Découvrez des co-fondateurs potentiels triés par score de compatibilité."
              step={2}
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Matchez et discutez"
              description="Quand vous likez mutuellement, lancez la conversation avec des icebreakers guidés."
              step={3}
            />
          </div>
        </div>
      </section>
      
      {/* Typical profiles */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Profils typiques
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Des profils complémentaires pour former des équipes équilibrées
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <ProfileTypeCard
              emoji="💻"
              title="Tech"
              description="Développeurs, data scientists, ingénieurs infrastructure"
              skills={["Backend", "Frontend", "DevOps", "Data/ML"]}
            />
            <ProfileTypeCard
              emoji="💼"
              title="Business"
              description="Sales, stratégie, finance, levée de fonds"
              skills={["Vente", "Stratégie", "Finance", "Fundraising"]}
            />
            <ProfileTypeCard
              emoji="📱"
              title="Produit & Design"
              description="Product managers, designers UX/UI"
              skills={["Product", "UX/UI", "No-code", "Analytics"]}
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
            onClick={() => navigate('/auth')}
          >
            Trouver un co-fondateur
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
      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
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

function ProfileTypeCard({ emoji, title, description, skills }: { emoji: string; title: string; description: string; skills: string[] }) {
  return (
    <div className="p-6 rounded-xl bg-card border border-border/50 shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{description}</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className="px-2 py-1 text-xs bg-secondary text-foreground rounded-full">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
