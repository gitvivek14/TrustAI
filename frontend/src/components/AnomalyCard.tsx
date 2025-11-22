import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Anomaly } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface AnomalyCardProps {
  anomaly: Anomaly;
}

export const AnomalyCard = ({ anomaly }: AnomalyCardProps) => {
  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          color: 'bg-destructive text-destructive-foreground',
          icon: AlertTriangle,
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive',
        };
      case 'medium':
        return {
          color: 'bg-warning text-warning-foreground',
          icon: AlertCircle,
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
        };
      case 'low':
        return {
          color: 'bg-primary text-primary-foreground',
          icon: Info,
          bgColor: 'bg-primary/10',
          textColor: 'text-primary',
        };
      default:
        return {
          color: 'bg-muted text-muted-foreground',
          icon: Info,
          bgColor: 'bg-muted',
          textColor: 'text-muted-foreground',
        };
    }
  };

  const config = getSeverityConfig(anomaly.severity);
  const Icon = config.icon;
  const formattedDate = new Date(anomaly.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn('rounded-lg p-2', config.bgColor)}>
              <Icon className={cn('h-5 w-5', config.textColor)} />
            </div>
            <div>
              <CardTitle className="text-base">{anomaly.type}</CardTitle>
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <Badge className={cn('font-semibold', config.color)}>
            {anomaly.severity.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm font-medium text-foreground">{anomaly.description}</p>
        <p className="text-sm text-muted-foreground">{anomaly.details}</p>
      </CardContent>
    </Card>
  );
};
