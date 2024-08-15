import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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

import { useToast } from '../components/ui/use-toast';
import AuthContext from '../auth/AuthContext';
import { fetchData } from './utils';
import Skeleton from '../components/ui/skeleton';

const chartConfig = {
  views: {
    label: 'Page Views',
  },
  sales: {
    label: 'Sales',
    color: 'hsl(var(--chart-1))',
  },
  retention: {
    label: 'Retention',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type ChartData = {
  date: string;
  sales: number;
  retention: number;
};

export default function WeekData() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('sales');

  const { authTokens, logoutUser } = React.useContext(AuthContext);
  const [chartData, setChartData] = React.useState<ChartData[]>();
  const { toast } = useToast();

  const handleFetchError = (error: Error) => {
    toast({
      variant: 'destructive',
      title: 'Uh oh! Something went wrong.',
      description: error.message,
    });
  };

  const fetchTopPerformers = async () => {
    try {
      await fetchData(
        `${process.env.CRM_URL}/api/chart/achived/`,
        setChartData,
        handleFetchError,
        authTokens,
        logoutUser,
        {},
      );
    } catch (error) {
      throw new Error('Error fetching top performers data');
    }
  };
  const isFetchingRef = React.useRef(false);

  React.useEffect(() => {
    const fetchOperations = async () => {
      if (isFetchingRef.current) {
        return;
      }
      isFetchingRef.current = true;
      try {
        await Promise.all([fetchTopPerformers()]);
        console.log('Completed');
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchOperations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = React.useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return {
        sales: 0,
        retention: 0,
        averageSales: 0,
        averageRetention: 0,
      };
    }

    const totalSales = chartData.reduce((acc, curr) => acc + curr.sales, 0);
    const totalRetention = chartData.reduce(
      (acc, curr) => acc + curr.retention,
      0,
    );

    return {
      sales: totalSales,
      retention: totalRetention,
      averageSales: totalSales / chartData.length,
      averageRetention: totalRetention / chartData.length,
    };
  }, [chartData]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Sales and Deposits</CardTitle>
          <CardDescription>
            A summary of sales and deposits for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {['sales', 'retention'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                type="button"
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {key === 'retention' ? '$' : ''}
                  {total?.[key as keyof typeof total]?.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {chartData?.length === 0 || !chartData ? (
          <Skeleton className="aspect-auto h-[250px] w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    }}
                    indicator="line"
                    hideLabel={false}
                    hideIndicator={false}
                    labelKey=""
                  />
                }
              />
              <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {/* Trending up by {trendingUpValue}% this month{' '}
              {trendingUpValue > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )} */}
              <div className="flex">
                {activeChart === 'sales'
                  ? `Average Sales: ${total.averageSales.toFixed(0)} / day`
                  : `Average Deposits: $${total.averageRetention.toFixed(2)} / day`}
              </div>
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData &&
                chartData.length > 0 &&
                `${chartData[0].date} - ${chartData[chartData.length - 1].date}`}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
