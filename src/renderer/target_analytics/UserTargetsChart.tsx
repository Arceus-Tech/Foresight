import { TrendingUp } from 'lucide-react';
import { Bar, CartesianGrid, ComposedChart, Line, XAxis } from 'recharts';
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '../components/ui/chart';

type ChartData = {
  month: string;
  targets: number;
  achieved: number;
};
const chartConfig = {
  targets: {
    label: 'targets',
    color: 'hsl(var(--chart-1))',
  },
  achieved: {
    label: 'achieved',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export default function UserTargetsChart({
  chartData,
  username,
}: {
  chartData: ChartData[];
  username: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className=" text-md">
          {username} ({chartData[chartData.length - 1].achieved} /{' '}
          {chartData[chartData.length - 1].targets})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={5}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  hideLabel={false}
                  hideIndicator={false}
                  nameKey=""
                  labelKey=""
                />
              }
            />
            <Bar dataKey="targets" fill="var(--color-targets)" radius={4} />
            <Bar dataKey="achieved" fill="var(--color-achieved)" radius={4} />
            <Line
              dataKey="achieved"
              stroke="var(--color-achieved)"
              type="monotone"
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
