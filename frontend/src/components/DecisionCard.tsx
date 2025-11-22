import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, CreditCard, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FinancialDecision } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface DecisionCardProps {
  decision: FinancialDecision;
}

export const DecisionCard = ({ decision }: DecisionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'denied':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'loan':
        return TrendingUp;
      case 'credit_limit':
        return CreditCard;
      case 'fraud_check':
        return ShieldAlert;
      default:
        return TrendingUp;
    }
  };

  const TypeIcon = getTypeIcon(decision.type);
  const formattedDate = new Date(decision.timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // --- FIX: SAFE FORMATTING HELPERS ---
  
  // Convert 0.85123 -> "85"
  const formatPercent = (val: number) => {
    if (val === undefined || val === null) return "0";
    // If val is small (like 0.85), multiply by 100. If it's already 85, keep it.
    const num = val <= 1 ? val * 100 : val;
    return num.toFixed(0); 
  };

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <TypeIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{decision.userName || "Guest User"}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {decision.type ? (
                    decision.type.replace('_', ' ').charAt(0).toUpperCase() +
                    decision.type.replace('_', ' ').slice(1)
                ) : "Transaction"}
              </p>
            </div>
          </div>
          <Badge className={cn('font-semibold', getStatusColor(decision.status))}>
            {decision.status?.toUpperCase() || "UNKNOWN"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* FIX 1: PROBABILITY FORMATTING */}
        <div className="flex items-center justify-between rounded-lg bg-accent p-3">
          <span className="text-sm font-medium text-accent-foreground">Approval Probability</span>
          <span className="text-2xl font-bold text-primary">
            {formatPercent(decision.approvalProbability)}%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Credit Score</p>
            <p className="text-lg font-semibold text-foreground">{decision.creditScore}</p>
          </div>
          
          {/* FIX 2: DTI FORMATTING */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">DTI Ratio</p>
            <p className="text-lg font-semibold text-foreground">
              {formatPercent(decision.dtiRatio)}%
            </p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Income</p>
            <p className="text-lg font-semibold text-foreground">
              ₹{(decision.income / 1000).toFixed(0)}k
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          <span>Model {decision.modelVersion || "v1.0"}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
          <Link to={`/decision/${decision.id}`}>
            View Explanation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};