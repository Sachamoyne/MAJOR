import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Bell, 
  SlidersHorizontal, 
  LogOut, 
  Trash2,
  ChevronRight,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  onClick?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}

const SettingItem = ({ icon, title, description, onClick, trailing, destructive }: SettingItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 p-4 text-left transition-colors",
      onClick && "hover:bg-secondary/50",
      destructive && "text-destructive"
    )}
  >
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center",
      destructive ? "bg-destructive/10" : "bg-secondary"
    )}>
      {icon}
    </div>
    <div className="flex-1">
      <p className={cn(
        "font-medium",
        destructive ? "text-destructive" : "text-foreground"
      )}>
        {title}
      </p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {trailing || (onClick && <ChevronRight className="h-5 w-5 text-muted-foreground" />)}
  </button>
);

const Settings = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [notifications, setNotifications] = useState({
    newMatch: true,
    messages: true,
    appUpdates: false,
  });

  const handleToggleActive = async (checked: boolean) => {
    try {
      await updateProfile.mutateAsync({ is_active: checked });
      toast.success(checked ? 'Profil visible' : 'Profil masqué');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete profile first (cascade will handle related data)
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('user_id', user.id);
        
        if (error) throw error;
      }
      
      // Sign out
      await signOut();
      toast.success("Compte supprimé");
      navigate("/");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 border-b border-border/50 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Paramètres</h1>
      </header>

      {/* Content */}
      <main className="pb-12">
        {/* Profile Visibility */}
        <section className="pt-6">
          <h2 className="px-4 text-xs font-medium text-primary uppercase tracking-wider mb-2">
            Visibilité du profil
          </h2>
          <div className="border-y border-border/50 bg-white">
            <SettingItem
              icon={profile?.is_active ? <Eye className="h-5 w-5 text-foreground/70" /> : <EyeOff className="h-5 w-5 text-foreground/70" />}
              title="Profil visible"
              description={profile?.is_active ? "Les autres peuvent vous voir" : "Vous êtes masqué"}
              trailing={
                <Switch
                  checked={profile?.is_active ?? true}
                  onCheckedChange={handleToggleActive}
                  disabled={updateProfile.isPending}
                />
              }
            />
          </div>
        </section>

        {/* Matching Preferences */}
        <section className="pt-8">
          <h2 className="px-4 text-xs font-medium text-primary uppercase tracking-wider mb-2">
            Préférences de matching
          </h2>
          <div className="border-y border-border/50 bg-white">
            <SettingItem
              icon={<SlidersHorizontal className="h-5 w-5 text-foreground/70" />}
              title="Critères de recherche"
              description="Compétences, rôle, disponibilité"
              onClick={() => navigate("/onboarding")}
            />
          </div>
        </section>

        {/* Notifications */}
        <section className="pt-8">
          <h2 className="px-4 text-xs font-medium text-primary uppercase tracking-wider mb-2">
            Notifications
          </h2>
          <div className="border-y border-border/50 bg-white divide-y divide-border/50">
            <SettingItem
              icon={<Bell className="h-5 w-5 text-foreground/70" />}
              title="Nouveaux matchs"
              description="Recevez une alerte quand vous avez un match"
              trailing={
                <Switch
                  checked={notifications.newMatch}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, newMatch: checked })
                  }
                />
              }
            />
            <SettingItem
              icon={<Bell className="h-5 w-5 text-foreground/70" />}
              title="Messages"
              description="Recevez une alerte pour les nouveaux messages"
              trailing={
                <Switch
                  checked={notifications.messages}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, messages: checked })
                  }
                />
              }
            />
            <SettingItem
              icon={<Bell className="h-5 w-5 text-foreground/70" />}
              title="Mises à jour de l'app"
              description="Nouveautés et fonctionnalités"
              trailing={
                <Switch
                  checked={notifications.appUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, appUpdates: checked })
                  }
                />
              }
            />
          </div>
        </section>

        {/* Account */}
        <section className="pt-8">
          <h2 className="px-4 text-xs font-medium text-primary uppercase tracking-wider mb-2">
            Compte
          </h2>
          <div className="border-y border-border/50 bg-white divide-y divide-border/50">
            <SettingItem
              icon={<User className="h-5 w-5 text-foreground/70" />}
              title="Mon profil"
              description="Modifier mes informations"
              onClick={() => navigate("/profile")}
            />
            <SettingItem
              icon={<Shield className="h-5 w-5 text-foreground/70" />}
              title="Confidentialité"
              description="Données personnelles et sécurité"
              onClick={() => toast.info("Bientôt disponible")}
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-8">
          <h2 className="px-4 text-xs font-medium text-destructive uppercase tracking-wider mb-2">
            Zone dangereuse
          </h2>
          <div className="border-y border-border/50 bg-white divide-y divide-border/50">
            <SettingItem
              icon={<LogOut className="h-5 w-5" />}
              title="Se déconnecter"
              onClick={handleLogout}
              destructive
            />
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <SettingItem
                    icon={<Trash2 className="h-5 w-5" />}
                    title="Supprimer mon compte"
                    description="Cette action est irréversible"
                    destructive
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action est irréversible. Toutes vos données, matchs et conversations seront définitivement supprimés.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </section>

        {/* Version */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">CoFounder v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">© 2026 Tous droits réservés</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
