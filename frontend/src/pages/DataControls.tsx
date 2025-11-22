import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, toggleSetting } from '@/lib/api'; // Real API
import { ToggleCard } from '@/components/ToggleCard';
import { Shield, Info, Lock, Loader2, ServerCrash } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner"; // Assuming you installed sonner, or use your preferred toast

// Since our backend is simple (only stores ID and Status), 
// we keep the UI text here to make it look professional.
const STATIC_DESCRIPTIONS: Record<string, { description: string; impact: string }> = {
  location: {
    description: "Allow AI to cross-reference transaction location with your device GPS.",
    impact: "High Impact: Disabling this reduces fraud detection accuracy by ~40%.",
  },
  history: {
    description: "Allow the model to analyze past 6 months of spending patterns.",
    impact: "Medium Impact: Required for accurate credit limit increases.",
  },
  social: {
    description: "Include public social media data for identity verification.",
    impact: "Low Impact: Used primarily for identity recovery.",
  },
  biometric: {
      description: "Use fingerprint/FaceID data for high-value transaction approval.",
      impact: "Critical: Disabling this forces manual review for transactions > $1000."
  }
};

const DataControls = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Settings from Backend
  const { data: permissions = [], isLoading, isError } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  // 2. Mutation to Toggle Settings
  const mutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      await toggleSetting(id, enabled);
    },
    onSuccess: () => {
      // Refresh the data locally without reloading page
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success("Privacy settings updated");
    },
    onError: () => {
      toast.error("Failed to save setting. Is backend running?");
    }
  });

  const handleToggle = (id: string, currentStatus: boolean) => {
    mutation.mutate({ id, enabled: !currentStatus });
  };

  // Loading State
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p>Loading Privacy Controls...</p>
        </div>
    );
  }

  // Error State
  if (isError) {
      return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-destructive">
              <ServerCrash className="h-12 w-12 mb-4" />
              <h2 className="text-xl font-bold">Connection Failed</h2>
              <p className="text-sm opacity-80">Ensure Node Backend is running on port 5000.</p>
          </div>
      );
  }

  const enabledCount = permissions.filter((p: any) => p.enabled).length;

  return (
    <div className="space-y-8 fade-in">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
             <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Data Controls</h1>
        </div>
        <p className="mt-2 text-muted-foreground ml-1">
          Manage granular permissions for the AI Decision Engine.
        </p>
      </div>

      {/* Summary Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Privacy & Control</AlertTitle>
        <AlertDescription>
          Changes take effect immediately on the next AI simulation. 
          Currently, <span className="font-bold">{enabledCount}</span> of{' '}
          <span className="font-bold">{permissions.length}</span> data sources are enabled.
        </AlertDescription>
      </Alert>

      {/* Controls Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {permissions.map((permission: any) => {
          // Merge Backend Status with Frontend Text
          const meta = STATIC_DESCRIPTIONS[permission.id] || { 
              description: "System Setting", 
              impact: "Unknown Impact" 
          };

          return (
            <ToggleCard
              key={permission.id}
              title={permission.name}
              description={meta.description}
              enabled={permission.enabled}
              impact={meta.impact}
              onToggle={() => handleToggle(permission.id, permission.enabled)}
            />
          );
        })}
      </div>

      {/* Footer Security Note */}
      <Alert className="border-green-500/20 bg-green-500/5">
        <Lock className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-600 font-semibold">Enterprise Grade Security</AlertTitle>
        <AlertDescription className="text-green-700/80">
          TrustAI uses AES-256 encryption for all stored data. 
          Toggling these off stops the AI from reading the data, but does not delete the historical record 
          unless a "Right to be Forgotten" request is filed.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default DataControls;