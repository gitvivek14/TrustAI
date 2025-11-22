import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDecisionById, getExplanation } from '@/lib/api'; // Import API
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Sliders, AlertTriangle, Shield, Loader2, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const DecisionDetails = () => {
  const { id } = useParams();

  // 1. Fetch Basic Decision Info (From Memory DB)
  const { data: decision, isLoading: isDecisionLoading } = useQuery({
    queryKey: ['decision', id],
    queryFn: () => getDecisionById(id!),
    enabled: !!id,
  });

  // 2. Fetch Deep Explanation (From Gemini + SHAP)
  // We only run this if we have the decision data
  const { data: explanation, isLoading: isExplainLoading } = useQuery({
    queryKey: ['explanation', id],
    queryFn: () => getExplanation({
        // Reconstruct features for the Python model
        credit_score: decision.creditScore,
        monthly_income: decision.income,
        dti_ratio: 0.35, // Default if missing in simple DB
        employment_months: 24,
        late_payments_6m: 0
    }),
    enabled: !!decision,
  });

  // Loading State
  if (isDecisionLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Retrieving decision records...</p>
      </div>
    );
  }

  // Not Found State
  if (!decision) {
    return (
      <div className="text-center pt-20">
        <div className="bg-muted inline-flex p-4 rounded-full mb-4">
           <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Decision Not Found</h1>
        <p className="text-muted-foreground mt-2">This record may have been cleared from memory.</p>
        <Button asChild className="mt-6">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Format Data for Display
  const formattedDate = new Date(decision.timestamp).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  // If explanation is loading, show skeleton or default structure
  const factors = explanation?.factors || [];
  const positiveFactors = factors.filter((f: any) => f.impact === 'positive');
  const negativeFactors = factors.filter((f: any) => f.impact === 'negative');

  return (
    <div className="space-y-6 fade-in">
      
      {/* HEADER */}
      <div>
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Decision Explanation
              {isExplainLoading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
            </h1>
            <p className="mt-2 text-muted-foreground">
              AI Analysis for {decision.type || "Loan Application"} • ID: {id}
            </p>
          </div>
          <Badge
            className={cn(
              'text-sm font-semibold px-4 py-1',
              decision.status === 'approved' ? 'bg-success text-success-foreground' : 'bg-destructive text-white'
            )}
          >
            {decision.status?.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* MAIN CONTENT (Left Side) */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Decision Logic</CardTitle>
            <CardDescription>How the AI calculated the risk score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Probability Bar */}
            <div className="rounded-lg bg-accent/50 p-4 border">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Approval Probability</span>
                <span className="text-2xl font-bold text-primary">{(decision.approvalProbability * 100).toFixed(1)}%</span>
              </div>
              <Progress value={decision.approvalProbability * 100} className="h-3" />
            </div>

            {/* EXPLAINABILITY SECTION */}
            {isExplainLoading ? (
                <div className="space-y-3 py-8 text-center">
                    <Bot className="h-10 w-10 mx-auto text-muted-foreground animate-bounce" />
                    <p className="text-sm text-muted-foreground">Gemini is analyzing SHAP values...</p>
                </div>
            ) : (
                <>
                    {/* Pros */}
                    {positiveFactors.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-success font-semibold">
                        <TrendingUp className="h-5 w-5" />
                        <h3>What Helped</h3>
                        </div>
                        <div className="grid gap-2">
                        {positiveFactors.map((f: any, i: number) => (
                            <div key={i} className="flex justify-between bg-success/10 p-3 rounded border border-success/20">
                            <span className="text-sm font-medium">{f.feature}</span>
                            <Badge variant="outline" className="border-success text-success">+{f.weight}</Badge>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}

                    {/* Cons */}
                    {negativeFactors.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-destructive font-semibold">
                        <TrendingDown className="h-5 w-5" />
                        <h3>What Hurt</h3>
                        </div>
                        <div className="grid gap-2">
                        {negativeFactors.map((f: any, i: number) => (
                            <div key={i} className="flex justify-between bg-destructive/10 p-3 rounded border border-destructive/20">
                            <span className="text-sm font-medium">{f.feature}</span>
                            <Badge variant="outline" className="border-destructive text-destructive">{f.weight}</Badge>
                            </div>
                        ))}
                        </div>
                    </div>
                    )}

                    {/* AI Advice */}
                    {explanation?.advice && (
                        <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4 mt-4">
                        <h3 className="mb-2 font-semibold text-foreground flex items-center gap-2">
                            <Bot size={18} /> AI Recommendations
                        </h3>
                        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                            {explanation.advice.map((tip: string, i: number) => (
                                <li key={i}>{tip}</li>
                            ))}
                        </ul>
                        </div>
                    )}
                </>
            )}

          </CardContent>
        </Card>

        {/* SIDEBAR (Right Side) */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Credit Score</p>
                <p className="font-medium text-xl">{decision.creditScore}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Income</p>
                <p className="font-medium text-xl">₹{decision.income?.toLocaleString()}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-muted-foreground text-xs">Processed At</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link to="/simulator">
                <Sliders className="mr-2 h-4 w-4" />
                Run What-If Simulator
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to="/anomalies">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Check for Anomalies
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DecisionDetails;