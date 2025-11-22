import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom"; // 1. Import Link
import { getDecisions } from "@/lib/api";
import { DecisionCard } from "@/components/DecisionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // 2. Import Button
import SimulateAttackButton from "@/components/SimulateAttackButton";
import { Users, CheckCircle, XCircle, TrendingUp, Activity, Loader2, UserCircle } from "lucide-react";

const Dashboard = () => {
  // 1. Fetch Real Data
  const { data: decisions = [], isLoading } = useQuery({
    queryKey: ["decisions"],
    queryFn: getDecisions,
    refetchInterval: 5000 // Auto-refresh every 5s to show new simulations!
  });

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  // 2. Calculate Stats dynamically
  const approvedCount = decisions.filter((d: any) => d.status === "approved").length;
  const deniedCount = decisions.filter((d: any) => d.status === "denied").length;
  const avgProb = decisions.length > 0 
    ? (decisions.reduce((acc: number, d: any) => acc + d.approvalProbability, 0) / decisions.length) * 100
    : 0;

  return (
    <div className="space-y-8 fade-in">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Overview</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Activity size={16} className="text-green-500 animate-pulse" />
            Real-time System Status
          </p>
        </div>
        
        {/* ACTION BUTTONS GROUP */}
        <div className="flex items-center gap-3">
           {/* New Profile Link */}
           <Button asChild variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
             <Link to="/profile">
               <UserCircle size={16} className="text-primary"/> Identity Data
             </Link>
           </Button>
           
           {/* Existing Attack Button */}
           <SimulateAttackButton />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Total Decisions" value={decisions.length} icon={Users} sub="Lifetime volume" />
        <StatCard title="Approved" value={approvedCount} icon={CheckCircle} color="text-green-500" sub={`${decisions.length ? Math.round((approvedCount/decisions.length)*100) : 0}% Rate`} />
        <StatCard title="Denied" value={deniedCount} icon={XCircle} color="text-red-500" sub={`${decisions.length ? Math.round((deniedCount/decisions.length)*100) : 0}% Rate`} />
        <StatCard title="Avg Probability" value={`${avgProb.toFixed(0)}%`} icon={TrendingUp} color="text-blue-500" sub="AI Confidence" />
      </div>

      {/* Recent List */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {decisions.slice(0, 6).map((d: any) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper Component
const StatCard = ({ title, value, icon: Icon, color, sub }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color || "text-muted-foreground"}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </CardContent>
  </Card>
);

export default Dashboard;