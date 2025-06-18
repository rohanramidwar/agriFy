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
import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

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
  const [loading, setLoading] = useState(true);
  const [moistureData, setMoistureData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [phData, setPhData] = useState([]);
  const [nutrientData, setNutrientData] = useState([]);

  useEffect(() => {
    const fetchSoilData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/soil-data",
          {
            params: {
              limit: 7,
              offset: 0,
              sensorId: "soil-sensor-001",
            },
          }
        );

        const data = response.data.reverse();

        setMoistureData(
          data.map((soil) => ({
            time: new Date(soil.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            moisture: soil.value.moisture,
          }))
        );

        setTemperatureData(
          data.map((soil) => ({
            time: new Date(soil.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temperature: soil.value.temperature,
          }))
        );

        setPhData(
          data.map((soil) => ({
            time: new Date(soil.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            ph: soil.value.ph,
          }))
        );

        setNutrientData(
          data.map((soil) => ({
            time: new Date(soil.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: soil.value.nutrient,
          }))
        );
      } catch (error) {
        console.error("Error fetching soil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSoilData();
  }, []);

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
            Current:
            {moistureData.length ? (
              moistureData[6]?.moisture + "%"
            ) : (
              <RotatingLines
                height="25"
                width="25"
                radius="9"
                color="#CFDF1C"
                ariaLabel="Google-loading"
              />
            )}
            <TrendingUp className="h-4 w-4" />
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
            Current:{" "}
            {temperatureData.length ? (
              temperatureData[6]?.temperature + "°C"
            ) : (
              <RotatingLines
                height="25"
                width="25"
                radius="9"
                color="#CFDF1C"
                ariaLabel="Google-loading"
              />
            )}
            <TrendingUp className="h-4 w-4" />
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
              <XAxis dataKey="time" />
              <YAxis domain={[6, 8]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="ph" fill="var(--color-ph)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Current:{" "}
            {phData.length ? (
              phData[6]?.ph + "pH"
            ) : (
              <RotatingLines
                height="25"
                width="25"
                radius="9"
                color="#CFDF1C"
                ariaLabel="Google-loading"
              />
            )}{" "}
            <TrendingUp className="h-4 w-4" />
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
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-nutrients)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Average:{" "}
            {nutrientData.length ? (
              nutrientData[6]?.value + "%"
            ) : (
              <RotatingLines
                height="25"
                width="25"
                radius="9"
                color="#CFDF1C"
                ariaLabel="Google-loading"
              />
            )}
            <TrendingUp className="h-4 w-4" />
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
