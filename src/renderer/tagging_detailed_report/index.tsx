import React, { useCallback, useContext } from 'react';
import { subDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { columns, Performer } from './columns';
import { DataTable } from './data-table';
import QuerySection from './query-section';
import getTaskResult from '../lib/get_task_result';
import AuthContext from '../auth/AuthContext';

interface Task {
  task_id: string;
}
export default function Index() {
  const [performerData, setPerformerData] = React.useState<Performer[]>([]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [taskId, setTaskId] = React.useState<string>('');
  const { authTokens } = useContext(AuthContext);
  React.useEffect(() => {
    console.log('isLoading changed:', isLoading);
  }, [isLoading]);
  // Function to fetch data

  // Call fetchData when the component mounts
  React.useEffect(() => {
    if (!taskId) {
      return;
    }
    setIsLoading(true);
    async function pollTaskResponse() {
      try {
        const data: Performer[] = await getTaskResult(taskId);

        const transformedData = Object.values(data).map((entry) => ({
          agent: entry.agent,
          followUp: entry.followUp || 0,
          callBack: entry.callBack || 0,
          appointment: entry.appointment || 0,
          noAnswer: entry.noAnswer || 0,
          converted: entry.converted || 0,
        }));

        setPerformerData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    pollTaskResponse();
  }, [taskId]);

  const handleSearch = useCallback(
    async (dateS: DateRange | undefined) => {
      setIsLoading(true);
      setPerformerData([]);
      const startDate =
        dateS && dateS.from ? format(dateS.from, 'yyyy-MM-dd') : ''; // Example start date
      const endDate = dateS && dateS.to ? format(dateS.to, 'yyyy-MM-dd') : '';
      try {
        const response = await fetch(
          `${process.env.CRM_URL}/api/reports/all-agents/?start_date=${startDate}&to_date=${endDate}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authTokens?.access}`,
            },
          },
        );
        const data: Task = await response.json();
        await setTaskId(data.task_id);
      } catch (error) {
        console.error('Error starting task:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [authTokens?.access],
  );
  React.useEffect(() => {
    if (!date) {
      return;
    }
    handleSearch(date);
  }, []);

  // Empty dependency array means this effect runs once on mount

  return (
    <div className="container mx-auto py-10">
      <QuerySection date={date} setDate={setDate} handleSearch={handleSearch} />

      <DataTable columns={columns} data={performerData} isLoading={isLoading} />
    </div>
  );
}
