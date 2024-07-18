import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../components/ui/chart';

const chartConfig = {
  callBack: {
    label: 'Call Back',
    color: 'hsl(var(--chart-1))',
  },
  followUp: {
    label: 'Follow Up',
    color: 'hsl(var(--chart-2))',
  },
  noAnswer: {
    label: 'Follow Up',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

const getCurrentMonthName = () => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const now = new Date();
  const currentMonthIndex = now.getMonth(); // getMonth() returns a zero-based value

  return monthNames[currentMonthIndex];
};

export default function AreaChartDash() {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trendingUpValue, setTrendingUpValue] = useState(0);
  const [monthRange, setMonthRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/monthly-status/?dep_id=1',
        );
        const data = await response.json();
        const transformedData = data.map(
          (item: { month: any; callBack: any; followUp: any }) => ({
            month: item.month,
            callBack: item.callBack || 0,
            followUp: item.followUp || 0,
          }),
        );
        setChartData(transformedData);
        // Calculate trending up percentage
        const currentMonthIndex = transformedData.findIndex(
          (item: { month: string }) => item.month === getCurrentMonthName(),
        ); // Assuming January is the current month
        const previousMonthIndex = currentMonthIndex - 1;
        if (
          currentMonthIndex > 0 &&
          transformedData[currentMonthIndex] &&
          transformedData[previousMonthIndex]
        ) {
          const currentValue =
            transformedData[currentMonthIndex].callBack +
            transformedData[currentMonthIndex].followUp;
          const previousValue =
            transformedData[previousMonthIndex].callBack +
            transformedData[previousMonthIndex].followUp;
          const percentageIncrease =
            ((currentValue - previousValue) / previousValue) * 100;
          setTrendingUpValue(Number(percentageIncrease.toFixed(2))); // Format to 2 decimal places
        }

        // Determine month range
        const startDate = transformedData[0]?.month;
        const endDate = transformedData[transformedData.length - 1]?.month;
        setMonthRange({ start: startDate, end: endDate });

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (chartData.length === 0) {
    return <div>No data available.</div>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Backs vs Follow Ups</CardTitle>
        <CardDescription>
          Showing the number of call backs and follow ups for the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  hideLabel={false}
                  hideIndicator={false}
                  nameKey=""
                  labelKey=""
                />
              }
            />
            <Area
              dataKey="followUp"
              type="natural"
              fill="var(--color-followUp)"
              fillOpacity={0.4}
              stroke="var(--color-followUp)"
              stackId="a"
            />
            <Area
              dataKey="callBack"
              type="natural"
              fill="var(--color-callBack)"
              fillOpacity={0.4}
              stroke="var(--color-callBack)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by {trendingUpValue}% this month{' '}
              {trendingUpValue > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {monthRange.start} - {monthRange.end}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
