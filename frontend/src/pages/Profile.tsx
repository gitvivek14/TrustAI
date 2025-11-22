import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, Wallet, Building, TrendingUp, CreditCard, 
  ShieldCheck, Server, AlertCircle, Loader2 
} from 'lucide-react';

const Profile = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8 fade-in">
      
      {/* HEADER WITH MCP BADGE */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <User className="text-primary" /> Financial Identity
          </h1>
          <p className="text-muted-foreground mt-1">
            Raw data snapshot used by TrustAI Agents for decision making.
          </p>
        </div>
        <Badge variant="outline" className="flex gap-2 px-3 py-1 border-blue-500/50 bg-blue-500/10 text-blue-400">
           <Server size={14} /> Fetched via Financial MCP
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        {/* COL 1: IDENTITY & ACCOUNTS */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Identity Verification</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                    {profile.identity.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{profile.identity.name}</h2>
                    <p className="text-sm text-muted-foreground">{profile.identity.email}</p>
                    <div className="flex items-center gap-1 text-xs text-green-500 mt-1">
                       <ShieldCheck size={12} /> {profile.identity.verificationLevel}
                    </div>
                  </div>
               </div>
               <Separator className="my-4" />
               <div className="space-y-3">
                 {profile.connectedAccounts.map((acc: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                       <div className="flex items-center gap-2">
                          <Building size={14} className="text-muted-foreground" />
                          <span>{acc.bank}</span>
                       </div>
                       <Badge variant="secondary" className="text-xs">{acc.type} •••• {acc.last4}</Badge>
                    </div>
                 ))}
               </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
             <CardHeader>
                <CardTitle className="flex items-center gap-2">
                   <AlertCircle size={18} /> Data Transparency
                </CardTitle>
             </CardHeader>
             <CardContent className="text-sm text-muted-foreground">
                This data is read-only. TrustAI uses the "Credit Score" and "Income" fields to calculate probability in the Simulator.
             </CardContent>
          </Card>
        </div>

        {/* COL 2: FINANCIAL METRICS */}
        <Card className="md:col-span-2">
           <CardHeader>
              <CardTitle>Financial Health Overview</CardTitle>
              <CardDescription>Key metrics driving the ML Model</CardDescription>
           </CardHeader>
           <CardContent className="space-y-8">
              
              {/* METRIC GRID */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="text-2xl font-bold">₹{(profile.financials.monthlyIncome / 1000).toFixed(1)}k</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Savings Balance</p>
                    <p className="text-2xl font-bold">₹{(profile.financials.savingsBalance / 1000).toFixed(0)}k</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Debt</p>
                    <p className="text-2xl font-bold text-destructive">₹{(profile.financials.totalDebt / 1000).toFixed(0)}k</p>
                 </div>
              </div>

              {/* CREDIT SCORE BAR */}
              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span>Credit Score</span>
                    <span className="font-bold text-primary">{profile.financials.creditScore} / 850</span>
                 </div>
                 <Progress value={(profile.financials.creditScore / 850) * 100} className="h-4" />
                 <p className="text-xs text-muted-foreground">Excellent score. Low risk factor for loans.</p>
              </div>

              {/* DTI BAR */}
              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span>Debt-to-Income (DTI) Ratio</span>
                    <span className="font-bold text-orange-500">{(profile.financials.dtiRatio * 100).toFixed(0)}%</span>
                 </div>
                 
                 {/* FIXED: Removed custom indicatorClassName and fixed logic */}
                 <Progress value={profile.financials.dtiRatio * 100} className="h-4" />
                 
                 {/* FIXED: Used &lt; instead of < for syntax error */}
                 <p className="text-xs text-muted-foreground">Ratio is healthy (&lt; 36%), but approaching warning levels.</p>
              </div>

           </CardContent>
        </Card>
      </div>

      {/* SECTION 3: STOCK PORTFOLIO */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
           <TrendingUp className="text-green-500" /> Live Investment Portfolio
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
           {profile.portfolio.map((stock: any) => {
              const profit = ((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100;
              return (
                 <Card key={stock.symbol}>
                    <CardHeader className="pb-2">
                       <CardTitle className="text-base flex justify-between">
                          {stock.symbol}
                          <Badge variant={profit > 0 ? "default" : "destructive"} className={profit > 0 ? "bg-green-600" : ""}>
                             {profit > 0 ? "+" : ""}{profit.toFixed(1)}%
                          </Badge>
                       </CardTitle>
                       <CardDescription>{stock.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current Price</span>
                          <span className="font-bold">₹{stock.currentPrice}</span>
                       </div>
                       <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Holdings</span>
                          <span>{stock.quantity} Qty</span>
                       </div>
                    </CardContent>
                 </Card>
              )
           })}
        </div>
      </div>
    </div>
  );
};

export default Profile;