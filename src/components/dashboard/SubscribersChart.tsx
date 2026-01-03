import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "يناير", subscribers: 1200 },
  { month: "فبراير", subscribers: 1800 },
  { month: "مارس", subscribers: 2400 },
  { month: "أبريل", subscribers: 3100 },
  { month: "مايو", subscribers: 3800 },
  { month: "يونيو", subscribers: 4500 },
  { month: "يوليو", subscribers: 5200 },
];

export function SubscribersChart() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">نمو المشتركين</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSubscribers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(217 91% 40%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(217 91% 40%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                className="text-xs fill-muted-foreground"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString('ar-EG')}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  direction: "rtl",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [value.toLocaleString('ar-EG'), "المشتركين"]}
              />
              <Area
                type="monotone"
                dataKey="subscribers"
                stroke="hsl(217 91% 40%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSubscribers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
