import React, { useContext, useEffect, useRef, useState } from 'react';
import UserTargetsChart from './UserTargetsChart';
import { fetchData } from '../dashboard/utils';
import { useToast } from '../components/ui/use-toast';
import AuthContext from '../auth/AuthContext';

type UserTargets = {
  userInfo: {
    username: string;
    userId: number;
  };
  chartData: {
    month: string;
    targets: number;
    achieved: number;
  }[];
};

export default function UserChatBase() {
  const { authTokens, logoutUser } = useContext(AuthContext);
  const [userTargets, setUserTargets] = useState<UserTargets[]>();
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
        `${process.env.CRM_URL}/api/chart/targets/`,
        setUserTargets,
        handleFetchError,
        authTokens,
        logoutUser,
        {},
      );
    } catch (error) {
      throw new Error('Error fetching top performers data');
    }
  };
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchOperations = async () => {
      if (isFetchingRef.current) {
        return;
      }
      isFetchingRef.current = true;
      try {
        await Promise.all([fetchTopPerformers()]);
        console.log('Completed');
        console.log('userTargets:', userTargets);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        isFetchingRef.current = false;
      }
    };

    fetchOperations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userTargets) {
      console.log('userTargets:', userTargets);
    }
  }, [userTargets]);

  return (
    <div className="grid p-10   items-start gap-10 md:grid-cols-2 lg:grid-cols-3">
      {userTargets?.map((userTarget) => (
        <UserTargetsChart
          chartData={userTarget.chartData}
          key={userTarget.userInfo.userId}
          username={userTarget.userInfo.username}
        />
      ))}
    </div>
  );
}
