import { useQuery } from "@tanstack/react-query";
import { getAnomalies } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldAlert, CheckCircle, Terminal, Activity, Ban, Eye } from "lucide-react";
import { toast } from "sonner";

const Anomalies = () => {
  const { data: anomalies = [], isLoading } = useQuery({
    queryKey: ["anomalies"],
    queryFn: getAnomalies,
    refetchInterval: 3000 // Poll every 3s for new attacks
  });

  const handleDismiss = (id: string) => {
    toast.success("Anomaly marked as resolved");
    // In a real app, you'd send a DELETE/PATCH request here
  };

  return (
    <div className="space-y-8 fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-destructive">
            <ShieldAlert className="h-8 w-8" />
            Security Watchdog
          </h1>
          <p className="mt-2 text-muted-foreground flex items-center gap-2">
            <Activity size={16} className="text-green-500 animate-pulse" />
            Live Threat Monitoring System
          </p>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-sm font-bold text-foreground">{anomalies.length} Alerts</div>
           <div className="text-xs text-muted-foreground">Active Threats</div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="space-y-4">
        {isLoading ? (
           <div className="text-center py-10 text-muted-foreground animate-pulse">Scanning system logs...</div>
        ) : anomalies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-xl border border-dashed">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4 opacity-80" />
            <h2 className="text-xl font-bold text-foreground">System Secure</h2>
            <p className="text-muted-foreground">No active anomalies detected in the last 24 hours.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {anomalies.map((a: any) => {
              const isCritical = a.severity === "CRITICAL";
              
              return (
                <Card 
                  key={a.id} 
                  className={`transition-all hover:shadow-md ${isCritical ? 'border-l-4 border-l-red-600' : 'border-l-4 border-l-orange-500'}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {isCritical ? (
                             <AlertTriangle className="text-red-600 h-5 w-5" />
                          ) : (
                             <AlertTriangle className="text-orange-500 h-5 w-5" />
                          )}
                          {a.type}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 text-xs font-mono">
                           ID: {a.id.slice(-8)} • {new Date(a.timestamp).toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge variant={isCritical ? "destructive" : "secondary"}>
                        {a.severity || "WARNING"}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <p className="text-sm font-medium text-foreground mb-3">{a.description}</p>
                    
                    {/* Tech Details Box */}
                    {a.details && (
                      <div className="bg-slate-950 rounded-md p-3 border border-slate-800">
                         <div className="flex items-center gap-2 text-xs text-slate-400 mb-2 border-b border-slate-800 pb-1">
                            <Terminal size={12} /> Transaction Dump
                         </div>
                         <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap overflow-x-auto">
                           {JSON.stringify(a.details, null, 2)}
                         </pre>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-2 flex gap-3 justify-end">
                     <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => toast("Opening detailed investigation...")}
                     >
                        <Eye size={14} /> Investigate
                     </Button>
                     {isCritical && (
                         <Button 
                            variant="destructive" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => handleDismiss(a.id)}
                         >
                            <Ban size={14} /> Block Sender
                         </Button>
                     )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Anomalies;