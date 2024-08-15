import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import React, { useEffect, useRef, useState } from 'react';
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

import { fetchData } from '../lib/get_task_result';
import { useToast } from '../components/ui/use-toast';
import Skeleton from '../components/ui/skeleton';

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
  const [chartData, setChartData] = useState<
    { month: any; callBack: any; followUp: any }[]
  >([]);
  const [chartDataTwo, setChartDataTwo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trendingUpValue, setTrendingUpValue] = useState(0);
  const [monthRange, setMonthRange] = useState({ start: '', end: '' });
  const { toast } = useToast();
  const isFetchingRef = useRef(false);

  const handleFetchError = (error: Error) => {
    toast({
      variant: 'destructive',
      title: 'Uh oh! Something went wrong.',
      description: error.message,
    });
  };

  const fetchMonthlyStats = async () => {
    try {
      await fetchData(
        `${process.env.CRM_URL}/api/monthly-status/`,
        setChartDataTwo,
        handleFetchError,
        {},
      );
    } catch (error) {
      throw new Error('Error fetching top performers data');
    }
  };

  useEffect(() => {
    const fetchData2 = async () => {
      try {
        const transformedData = chartDataTwo.map(
          (item: { month: any; callBack: any; followUp: any }) => ({
            month: item.month,
            callBack: item.callBack || 0,
            followUp: item.followUp || 0,
          }),
        );

        console.log('transformedData:', transformedData);
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
    fetchData2();
  }, [chartDataTwo]);

  useEffect(() => {
    const fetchOperations = async () => {
      if (isFetchingRef.current) {
        return;
      }
      isFetchingRef.current = true;
      try {
        await Promise.all([fetchMonthlyStats()]);
        console.log('Completed fetchTopPerformers and fetchLatestStats');
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchOperations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Call Backs vs Follow Ups</CardTitle>
        <CardDescription>
          Showing the number of call backs and follow ups for the past 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 || !chartData ? (
          <Skeleton className="aspect-auto h-[250px] w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
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
        )}
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
