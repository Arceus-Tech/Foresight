import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Ban,
  CalendarPlus,
  Contact,
  UserPlus,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import AreaChartDash from './AreaChartDash';

interface DataSummary {
  current: Record<string, unknown>;
  prev: Record<string, unknown>;
}

interface TopPerformer {
  agent: {
    id: number;
    name: string;
    email: string;
    target: number;
    target_mode: 'count' | 'deposit';
  };
  followUp: number;
  callBack: number;
  converted: number;
}

interface RecentDeposit {
  agent: {
    id: number;
    name: string;
    email: string;
  };
  id: number;
  amount: number;
  dateAdded: string;
}

function checkValidity(
  dataSummary: DataSummary | null,
  key: string,
  usePrev: boolean = false,
): string | number {
  if (!dataSummary) {
    return 0; // Return 0 if dataSummary is null
  }

  const target = usePrev ? dataSummary.prev : dataSummary.current;

  if (!target) {
    return 0; // Return 0 if the target object (current or prev) is null or undefined
  }

  const value = target[key];

  // Narrow the type of value to string or number
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return 0; // Return 0 if value is neither string nor number
}

function calculatePercentageChange(
  dataSummary: DataSummary | null,
  key: string,
): string {
  if (!dataSummary) {
    return '0%'; // Return "0%" if dataSummary is null
  }

  // Ensure currentValue and previousValue are treated as numbers
  const currentValue = dataSummary.current[key] || 0;
  const previousValue = dataSummary.prev[key] || 0;

  // Calculate percentage change
  if (currentValue === 0 && previousValue === 0) {
    return '0%'; // If both current and previous values are zero, return "0%"
  }
  if (previousValue === 0) {
    // Handle division by zero case (previousValue is 0)
    return currentValue === 0 ? '0%' : '+100%'; // Assuming +100% for the case where previousValue is 0
  }

  // Calculate percentage change
  const change =
    ((Number(currentValue) - Number(previousValue)) /
      Math.abs(Number(previousValue))) *
    100;

  // Determine if it's an increase or decrease
  const changeString =
    change < 0 ? `${change.toFixed(2)}%` : `+${change.toFixed(2)}%`;

  // Return the change with appropriate sign
  return changeString;
}

export default function Dashboard() {
  const [dataSummary, setDataSummary] = useState<DataSummary | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>();
  const [reacentDeposits, setRecentDeposits] = useState<RecentDeposit[]>();

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/latest-stats/?dep_id=1')
      .then((response) => response.json())
      .then((data) => setDataSummary(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/top-performer/?count=6&dep_id=1')
      .then((response) => response.json())
      .then((data) => setTopPerformers(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/recent-running-bonus/')
      .then((response) => response.json())
      .then((data) => setRecentDeposits(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Followups
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{checkValidity(dataSummary, 'follow up')}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentageChange(dataSummary, 'follow up')} from last
              month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Callbacks
            </CardTitle>
            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{checkValidity(dataSummary, 'call back')}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentageChange(dataSummary, 'call back')} from last
              from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total No Answer
            </CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{checkValidity(dataSummary, 'no answer')}
            </div>
            <p className="text-xs text-muted-foreground">
              {calculatePercentageChange(dataSummary, 'no answer')} from last
              from last month
            </p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Contact className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>
                Top 5 performers based on sales and revenue
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link to="/">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>

                  <TableHead className="hidden xl:table-cell text-right">
                    Follow Ups
                  </TableHead>
                  <TableHead className="hidden xl:table-cell text-right">
                    Call Backs
                  </TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Achieved %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers?.map((performer) => (
                  <TableRow key={performer.agent.id}>
                    <TableCell>
                      <div className="font-medium">{performer.agent.name}</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        {performer.agent.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-right">
                      {performer.followUp ? performer.followUp : 0}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell text-right">
                      {performer.callBack ? performer.callBack : 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {performer.converted ? performer.converted : 0}
                    </TableCell>
                    <TableCell className="text-right">
                      {performer.agent.target_mode === 'count' &&
                      performer.converted
                        ? (performer.converted / performer.agent.target) * 100
                        : 0}{' '}
                      %
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Recent Deposits</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            {reacentDeposits?.map((deposit) => (
              <div className="flex items-center gap-4" key={deposit.id}>
                <Avatar className="hidden h-9 w-9 sm:flex">
                  {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {deposit.agent.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {deposit.agent.email}
                  </p>
                </div>
                <div className="ml-auto font-medium">+${deposit.amount}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <AreaChartDash />
      </div>
    </main>
  );
}
