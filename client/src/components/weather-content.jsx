import { Cloud, Sun, CloudRain, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const WeatherContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Weather Monitoring
        </h2>
        <p className="text-muted-foreground">
          Current weather conditions and forecast for your agricultural area.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Sun className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24°C</div>
            <p className="text-xs text-muted-foreground">Feels like 26°C</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Cloud className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Optimal for crops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precipitation</CardTitle>
            <CloudRain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5mm</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
            <Wind className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 km/h</div>
            <p className="text-xs text-muted-foreground">From northwest</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              "Today",
              "Tomorrow",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day, index) => (
              <div key={day} className="flex items-center justify-between">
                <span className="font-medium">{day}</span>
                <div className="flex items-center gap-4">
                  <Sun className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-muted-foreground">
                    {24 + index}°C / {18 + index}°C
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherContent;
