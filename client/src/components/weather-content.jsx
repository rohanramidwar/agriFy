import { Cloud, Sun, CloudRain, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { RotatingLines } from "react-loader-spinner";

const WeatherContent = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/weather-data",
          {
            params: {
              limit: 1,
              offset: 0,
              sensorId: "weather-station-001",
            },
          }
        );

        setWeatherData(response.data[0].value);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

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
            <div className="text-2xl font-bold">
              {weatherData?.temperature ? (
                weatherData?.temperature + "°C"
              ) : (
                <RotatingLines
                  height="25"
                  width="25"
                  radius="9"
                  color="#CFDF1C"
                  ariaLabel="Google-loading"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Feels like 26°C</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Cloud className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weatherData?.humidity ? (
                weatherData?.humidity + "%"
              ) : (
                <RotatingLines
                  height="25"
                  width="25"
                  radius="9"
                  color="#CFDF1C"
                  ariaLabel="Google-loading"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Optimal for crops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precipitation</CardTitle>
            <CloudRain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weatherData?.rainfall ? (
                weatherData?.rainfall + "mm"
              ) : (
                <RotatingLines
                  height="25"
                  width="25"
                  radius="9"
                  color="#CFDF1C"
                  ariaLabel="Google-loading"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wind Speed</CardTitle>
            <Wind className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weatherData?.windSpeed ? (
                weatherData?.windSpeed + "km/h"
              ) : (
                <RotatingLines
                  height="25"
                  width="25"
                  radius="9"
                  color="#CFDF1C"
                  ariaLabel="Google-loading"
                />
              )}
            </div>
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
