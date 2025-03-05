
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Users, Calendar, FileType } from "lucide-react";
import { Signature } from "@/pages/Index";

interface DashboardProps {
  signatures: Signature[];
}

export const AdminDashboard = ({ signatures }: DashboardProps) => {
  // Calculate statistics
  const totalSignatures = signatures.length;
  const uniqueUsers = new Set(signatures.map(sig => sig.name)).size;
  
  // Get departments and counts
  const departmentCounts: Record<string, number> = {};
  signatures.forEach(sig => {
    if (departmentCounts[sig.department]) {
      departmentCounts[sig.department]++;
    } else {
      departmentCounts[sig.department] = 1;
    }
  });
  
  // Sort departments by count (descending)
  const sortedDepartments = Object.entries(departmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5 departments

  // Calculate signatures per month (last 6 months)
  const monthlyData = getMonthlySignatureData(signatures);

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-white/10 mb-6">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>
          Visão geral das assinaturas geradas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Total de Assinaturas" 
            value={totalSignatures.toString()} 
            icon={<FileType className="h-5 w-5 text-blue-500" />} 
            description="Assinaturas emitidas" 
            color="blue"
          />
          <StatCard 
            title="Usuários Únicos" 
            value={uniqueUsers.toString()} 
            icon={<Users className="h-5 w-5 text-green-500" />} 
            description="Pessoas diferentes" 
            color="green"
          />
          <StatCard 
            title="Assinaturas este Mês" 
            value={monthlyData[0]?.count.toString() || "0"} 
            icon={<Calendar className="h-5 w-5 text-purple-500" />} 
            description={monthlyData[0]?.month || "Sem dados"} 
            color="purple"
          />
          <StatCard 
            title="Setor Principal" 
            value={sortedDepartments[0]?.[1].toString() || "0"} 
            icon={<BarChart className="h-5 w-5 text-orange-500" />} 
            description={sortedDepartments[0]?.[0] || "Sem dados"} 
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Assinaturas por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full flex items-end justify-between gap-2">
                {monthlyData.map((data, i) => (
                  <div key={i} className="relative flex flex-col items-center">
                    <div className="absolute -top-6 text-xs font-medium">{data.count}</div>
                    <div 
                      className="w-12 rounded-t-md bg-blue-500/80" 
                      style={{ height: `${Math.max((data.count / (Math.max(...monthlyData.map(d => d.count)) || 1)) * 150, 10)}px` }}
                    ></div>
                    <div className="mt-1 text-xs text-gray-500">{data.month.substring(0, 3)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Top Setores</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px] w-full pr-4">
                {sortedDepartments.length > 0 ? (
                  <div className="space-y-4">
                    {sortedDepartments.map(([dept, count], i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium truncate">{dept}</span>
                          <span className="text-gray-500">{count}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${(count / (sortedDepartments[0][1] || 1)) * 100}%`,
                              background: getColorForIndex(i)
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">Nenhum dado disponível</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper component for stat cards
const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  color 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  description: string; 
  color: string;
}) => (
  <Card className="bg-white/80">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span className={`p-1.5 rounded-full bg-${color}-100`}>{icon}</span>
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </CardContent>
  </Card>
);

// Helper function to get monthly data
const getMonthlySignatureData = (signatures: Signature[]) => {
  const months: { month: string; count: number }[] = [];
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  
  // Get last 6 months
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push({
      month: monthNames[month.getMonth()],
      count: 0
    });
  }
  
  // Count signatures for each month
  signatures.forEach(sig => {
    const sigDate = new Date(sig.date);
    const monthIndex = monthNames[sigDate.getMonth()];
    
    const monthData = months.find(m => m.month === monthIndex);
    if (monthData && isSameYearMonth(sigDate, today)) {
      monthData.count++;
    }
  });
  
  return months;
};

// Helper function to check if two dates are in the same year and month
const isSameYearMonth = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() && 
         Math.abs(date2.getMonth() - date1.getMonth()) <= 5;
};

// Helper function to get colors for chart
const getColorForIndex = (index: number) => {
  const colors = [
    "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
    "linear-gradient(90deg, #10b981 0%, #34d399 100%)",
    "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
    "linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%)",
    "linear-gradient(90deg, #ec4899 0%, #f472b6 100%)"
  ];
  return colors[index % colors.length];
};
