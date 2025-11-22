import { useState } from 'react';
import { useMutation } from '@tanstack/react-query'; // 1. Import React Query
import { runSimulation } from '@/lib/api'; // 2. Import your API
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Import Button
import { ArrowRight, TrendingUp, TrendingDown, Loader2, Bot } from 'lucide-react';

const Simulator = () => {
  // State for inputs
  const [creditScore, setCreditScore] = useState([720]);
  const [salary, setSalary] = useState([75000]); // Annual Salary
  const [loanAmount, setLoanAmount] = useState([25000]);
  const [employmentMonths, setEmploymentMonths] = useState([36]);

  // --- API INTEGRATION ---
  const mutation = useMutation({
    mutationFn: async () => {
      // Map UI inputs to Python Model features
      return await runSimulation({
        monthly_income: Math.floor(salary[0] / 12), // Convert Annual -> Monthly
        credit_score: creditScore[0],
        employment_months: employmentMonths[0],
        dti_ratio: parseFloat((loanAmount[0] / salary[0]).toFixed(2)), // Approx DTI
        late_payments: 0 // Default for simulator (or add a slider if you want)
      });
    },
    onSuccess: (data) => {
      console.log("AI Prediction:", data);
    }
  });

  // Derived State
  // If we have AI data, use it. Otherwise, show 0 or a placeholder.
  const aiProbability = mutation.data ? Math.round(mutation.data.probability * 100) : 0;
  const baselineApproval = 68; // This could also come from an initial API call
  const difference = aiProbability - baselineApproval;

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Bot className="text-primary" /> 
          AI What-If Simulator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Adjust parameters and ask the Python ML Model to re-calculate your approval odds.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* --- INPUT SECTION --- */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Adjust Financial Profile</CardTitle>
            <CardDescription>Modify these values to simulate a new applicant profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            
            {/* Credit Score */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Credit Score</label>
                <span className="text-lg font-bold text-primary">{creditScore[0]}</span>
              </div>
              <Slider
                value={creditScore}
                onValueChange={setCreditScore}
                min={300} max={850} step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Poor (300)</span><span>Excellent (850)</span>
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Annual Salary</label>
                <span className="text-lg font-bold text-primary">₹{salary[0].toLocaleString()}</span>
              </div>
              <Slider
                value={salary}
                onValueChange={setSalary}
                min={25000} max={200000} step={5000}
                className="w-full"
              />
            </div>

            {/* Loan Amount */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Loan Amount</label>
                <span className="text-lg font-bold text-primary">₹{loanAmount[0].toLocaleString()}</span>
              </div>
              <Slider
                value={loanAmount}
                onValueChange={setLoanAmount}
                min={5000} max={100000} step={1000}
                className="w-full"
              />
            </div>

            {/* Employment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Employment Duration</label>
                <span className="text-lg font-bold text-primary">{employmentMonths[0]} months</span>
              </div>
              <Slider
                value={employmentMonths}
                onValueChange={setEmploymentMonths}
                min={0} max={120} step={6}
                className="w-full"
              />
            </div>

            {/* RUN BUTTON */}
            <Button 
              onClick={() => mutation.mutate()} 
              disabled={mutation.isPending}
              className="w-full text-lg py-6"
              size="lg"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Calculating with Python ML...
                </>
              ) : (
                <>Run AI Prediction</>
              )}
            </Button>

          </CardContent>
        </Card>

        {/* --- RESULTS SECTION --- */}
        <div className="space-y-6">
          
          {/* Probability Card */}
          <Card className={mutation.isPending ? "opacity-50" : ""}>
            <CardHeader>
              <CardTitle className="text-base">AI Approval Probability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                {mutation.data ? (
                    <>
                        <div className={`text-5xl font-bold ${aiProbability > 50 ? 'text-green-500' : 'text-red-500'}`}>
                        {aiProbability}%
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                        Model Confidence Score: {mutation.data.score.toFixed(2)}
                        </p>
                    </>
                ) : (
                    <div className="text-muted-foreground py-4">
                        Click "Run AI Prediction" to see results.
                    </div>
                )}
              </div>
              <Progress value={aiProbability} className="h-3" />
            </CardContent>
          </Card>

          {/* Comparison Card */}
          {mutation.data && (
            <Card>
                <CardHeader>
                <CardTitle className="text-base">Before vs After</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <span className="text-sm font-medium">Original</span>
                    <span className="text-xl font-bold">{baselineApproval}%</span>
                </div>
                <div className="flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className={`flex items-center justify-between rounded-lg p-3 ${difference >= 0 ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                    <span className="text-sm font-medium">Simulated</span>
                    <span className={`text-xl font-bold ${difference >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {aiProbability}%
                    </span>
                </div>
                
                {/* Difference Badge */}
                <div className="flex justify-end">
                     <Badge
                      variant={difference > 0 ? 'default' : 'destructive'}
                      className={difference > 0 ? 'bg-success text-white' : ''}
                    >
                      {difference > 0 ? '+' : ''}{difference}% Change
                    </Badge>
                </div>
                </CardContent>
            </Card>
          )}

          {/* Key Insights (Static Rules for immediate feedback) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    {creditScore[0] >= 700 ? 'Good credit is your strongest asset.' : 'Credit score is dragging down the probability.'}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>
                    DTI Ratio: {((loanAmount[0] / salary[0]) * 100).toFixed(0)}% 
                    {loanAmount[0] / salary[0] > 0.5 ? ' (High Risk)' : ' (Healthy)'}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Simulator;