import {
  TrendingUp,
  Droplets,
  Thermometer,
  FlaskConical,
  Sprout,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";

// Mock data for the charts
const moistureData = [
  { time: "00:00", moisture: 65 },
  { time: "04:00", moisture: 68 },
  { time: "08:00", moisture: 62 },
  { time: "12:00", moisture: 58 },
  { time: "16:00", moisture: 55 },
  { time: "20:00", moisture: 60 },
];

const temperatureData = [
  { time: "00:00", temperature: 18 },
  { time: "04:00", temperature: 16 },
  { time: "08:00", temperature: 20 },
  { time: "12:00", temperature: 25 },
  { time: "16:00", temperature: 28 },
  { time: "20:00", temperature: 22 },
];

const phData = [
  { day: "Mon", ph: 6.8 },
  { day: "Tue", ph: 6.5 },
  { day: "Wed", ph: 6.9 },
  { day: "Thu", ph: 7.1 },
  { day: "Fri", ph: 6.7 },
  { day: "Sat", ph: 6.8 },
  { day: "Sun", ph: 7.0 },
];

const nutrientData = [
  { nutrient: "Nitrogen", value: 85, color: "#22c55e" },
  { nutrient: "Phosphorus", value: 72, color: "#3b82f6" },
  { nutrient: "Potassium", value: 68, color: "#f59e0b" },
  { nutrient: "Calcium", value: 91, color: "#8b5cf6" },
];

const chartConfig = {
  moisture: {
    label: "Moisture",
    color: "hsl(var(--chart-2))",
  },
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-1))",
  },
  ph: {
    label: "pH Level",
    color: "hsl(var(--chart-3))",
  },
  nutrients: {
    label: "Nutrients",
    color: "hsl(var(--chart-4))",
  },
};

const SoilCharts = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Moisture Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm font-medium">Soil Moisture</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <AreaChart data={moistureData}>
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="moisture"
                stroke="var(--color-moisture)"
                fill="var(--color-moisture)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Current: 60% <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Optimal range: 50-70%
          </div>
        </CardFooter>
      </Card>

      {/* Temperature Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <CardTitle className="text-sm font-medium">
              Soil Temperature
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <LineChart data={temperatureData}>
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="var(--color-temperature)"
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Current: 22°C <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Optimal range: 18-25°C
          </div>
        </CardFooter>
      </Card>

      {/* pH Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-purple-500" />
            <CardTitle className="text-sm font-medium">pH Level</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={phData}>
              <XAxis dataKey="day" />
              <YAxis domain={[6, 8]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ph" fill="var(--color-ph)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Current: 7.0 pH <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Optimal range: 6.5-7.5 pH
          </div>
        </CardFooter>
      </Card>

      {/* Nutrient Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-green-500" />
            <CardTitle className="text-sm font-medium">
              Nutrient Levels
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={nutrientData} layout="horizontal">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="nutrient" type="category" width={80} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-nutrients)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Average: 79% <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            All nutrients within optimal range
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SoilCharts;
