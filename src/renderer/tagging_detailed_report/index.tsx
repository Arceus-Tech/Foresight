import React, { useCallback } from 'react';
import { subDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { columns, Performer } from './columns';
import { DataTable } from './data-table';
import QuerySection from './query-section';
import getTaskResult from '../lib/get_task_result';

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

  // Function to fetch data

  // Call fetchData when the component mounts
  React.useEffect(() => {
    if (!taskId) {
      return;
    }
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
      }
    }

    pollTaskResponse();
  }, [taskId]);

  React.useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);
  const handleSearch = useCallback(async (dateS: DateRange | undefined) => {
    console.log('Before setting loading state:', isLoading);
    setIsLoading(true);
    console.log(isLoading);
    const startDate =
      dateS && dateS.from ? format(dateS.from, 'yyyy-MM-dd') : ''; // Example start date
    const endDate = dateS && dateS.to ? format(dateS.to, 'yyyy-MM-dd') : '';
    try {
      const response = await fetch(
        `${process.env.CRM_URL}/api/reports/all-agents/?start_date=${startDate}&to_date=${endDate}`,
      );
      const data: Task = await response.json();
      await setTaskId(data.task_id);
    } catch (error) {
      console.error('Error starting task:', error);
    } finally {
      console.log('Before setting loading state to false:', isLoading);
      setIsLoading(false); // Set loading to false
      console.log('Loading state set to false');
    }
  }, []);
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

      {isLoading && (
        <div className=" text-black font-normal text-xl py-5">Loading...</div>
      )}

      {performerData && performerData.length !== 0 && (
        <DataTable columns={columns} data={performerData} />
      )}
    </div>
  );
}
