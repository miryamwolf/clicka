import { useState } from "react";
import { Lead } from "shared-types";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const LeadInteractionGraph = ({ lead, onBack }: { lead: Lead; onBack: () => void }) => {
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // אינטראקציות לפי חודשים
  const monthAggregated = lead.interactions.reduce((acc, i) => {
    const date = new Date(i.date || i.updatedAt || i.createdAt);
    const month = date.getMonth();
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const monthData = Object.entries(monthAggregated).map(([month, count]) => ({
    label: new Date(2024, +month, 1).toLocaleString("he-IL", { month: "short" }),
    count,
    month: +month
  }));

  // אינטראקציות לפי ימים בחודש שנבחר
  const dayAggregated = lead.interactions
    .filter(i => {
      const date = new Date(i.date || i.updatedAt || i.createdAt);
      return selectedMonth !== null && date.getMonth() === selectedMonth;
    })
    .reduce((acc, i) => {
      const date = new Date(i.date || i.updatedAt || i.createdAt);
      const day = date.getDate();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

  const dayData = Object.entries(dayAggregated).map(([day, count]) => ({
    label: `יום ${day}`,
    count
  }));

  const chartData = viewMode === "month" ? monthData : dayData;

  return (
    <div className="bg-blue-50 mt-2 p-4 rounded-lg border border-blue-200">
      <div className="flex justify-between mb-2">
        <div className="font-bold text-lg">
          {viewMode === "month"
            ? "גרף אינטראקציות לפי חודשים"
            : `גרף לפי ימים בחודש ${new Date(2024, selectedMonth!).toLocaleString("he-IL", { month: "long" })}`}
        </div>
        <div className="flex gap-2">
          {viewMode === "day" && (
            <Button size="sm" onClick={() => setViewMode("month")}>
              ← חזור לחודשים
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={onBack}>
            סגור
          </Button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          onClick={(e: any) => {
            if (viewMode === "month" && e?.activePayload?.[0]?.payload?.month !== undefined) {
              setSelectedMonth(e.activePayload[0].payload.month);
              setViewMode("day");
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line dataKey="count" name="כמות אינטראקציות" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
