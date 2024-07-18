import React from 'react';
import { columns, Performer } from './columns';
import { DataTable } from './data-table';
import QuerySection from './query-section';

export default function Index() {
  const [performerData, setPerformerData] = React.useState<Performer[]>([]);

  // Function to fetch data

  // Call fetchData when the component mounts
  React.useEffect(() => {
    const startDate = '2023-01-01'; // Example start date
    const endDate = '2025-06-30'; // Example end date

    fetch(
      `http://127.0.0.1:8000/api/reports/all-agents/?start_date=${startDate}&to_date=${endDate}&dep_id=1`,
    )
      .then((response) => response.json())
      .then((data: Performer[]) => {
        const transformedData: Performer[] = Object.values(data).map(
          (entry) => ({
            agent: entry.agent,
            followUp: entry.followUp || 0,
            callBack: entry.callBack || 0,
            appointment: entry.appointment || 0,
            noAnswer: entry.noAnswer || 0,
            converted: entry.converted || 0,
          }),
        );

        // Update the state with the transformed data
        setPerformerData(transformedData);
        return data; // Add a return statement here
      })
      .catch((error: any) => console.error('Error fetching data:', error));
  }, []);

  // Empty dependency array means this effect runs once on mount

  return (
    <div className="container mx-auto py-10">
      <QuerySection />

      <DataTable columns={columns} data={performerData} />
    </div>
  );
}
