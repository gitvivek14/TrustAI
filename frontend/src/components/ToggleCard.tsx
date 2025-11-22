import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface ToggleCardProps {
  title: string;
  description: string;
  enabled: boolean;
  impact: string;
  onToggle: () => void;
}

export const ToggleCard = ({ title, description, enabled, impact, onToggle }: ToggleCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Switch checked={enabled} onCheckedChange={onToggle} />
        </div>
      </CardHeader>
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">{impact}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
