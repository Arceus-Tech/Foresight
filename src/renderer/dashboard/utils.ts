import React from 'react';

import getTaskResult from '../lib/get_task_result';

interface ExtendedResponse extends Response {
  data: any; // Specify the correct type for `data` instead of `any` if possible
}

interface AuthTokens {
  access: string;
  refresh: string;
}
export async function attemptFetch<T>(
  url: string,
  setState: React.Dispatch<React.SetStateAction<T>>,
  handleError: (error: Error) => void,
  queryParams: Record<string, any>,
  retriesLeft: number,
  authTokens: AuthTokens | null,
  logoutUser = () => {},
): Promise<void> {
  try {
    const queryString = new URLSearchParams(queryParams).toString();

    console.log('queryString:', queryString);
    const response: any = await fetch(`${url}?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens?.access}`,
      },
    });

    // Check for network errors
    if (!response.ok) {
      if (response.status === 403) {
        // Handle 403 status code specifically
        logoutUser();
      }
      throw new Error(
        `Network response was not ok, status: ${response.status}`,
      );
    }

    const data = await response.json();

    if (data.task_id === undefined) {
      handleError(new Error('Task ID not found in response'));
      return;
    }

    const newData = (await getTaskResult(data.task_id)) as ExtendedResponse;
    console.log(newData.data); // Assuming getTaskResult is async
    setState(newData.data);
  } catch (error: any) {
    // Log the error message for debugging
    if (retriesLeft > 1) {
      // Recursively attempt fetch again, decrementing retriesLeft
      await attemptFetch(
        url,
        setState,
        handleError,
        queryParams,
        retriesLeft - 1,
        authTokens,
        logoutUser,
      );
    } else {
      // No retries left, handle error
      handleError(new Error(`Error fetching data: ${error.message}`));
    }
  }
}

export async function fetchData<T>(
  url: string,
  setState: React.Dispatch<React.SetStateAction<T>>,
  handleError: (error: Error) => void,
  authTokens: AuthTokens | null,
  logoutUser: () => void,
  queryParams: Record<string, any> = {},
  maxRetries: number = 3,
  // Default maximum retries to 3
): Promise<void> {
  await attemptFetch(
    url,
    setState,
    handleError,
    queryParams,
    maxRetries,
    authTokens,
    logoutUser,
  );
}
