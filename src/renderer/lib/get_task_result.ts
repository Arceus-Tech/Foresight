import * as React from 'react';

interface ExtendedResponse extends Response {
  data: any; // Specify the correct type for `data` instead of `any` if possible
}

export default async function getTaskResult<T>(taskId: string): Promise<T> {
  if (
    !taskId ||
    taskId === '' ||
    typeof taskId !== 'string' ||
    taskId.length === 0 ||
    taskId === undefined
  ) {
    throw new Error('Task ID is required');
  }
  const response = await fetch(`${process.env.CRM_URL}/api/task/${taskId}`)
    .then((res) => {
      if (res.status === 202) {
        return new Promise((resolve) => {
          setTimeout(() => resolve(getTaskResult<T>(taskId)), 2000);
        });
      }
      return res.json();
    })
    .catch((error) => {
      throw error;
    });

  return response;
}

export async function attemptFetch<T>(
  url: string,
  setState: React.Dispatch<React.SetStateAction<T>>,
  handleError: (error: Error) => void,
  queryParams: Record<string, any>,
  retriesLeft: number,
): Promise<void> {
  try {
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${url}?${queryString}`).then((res) => {
      if (!res.ok) {
        throw new Error(`Network response was not ok, status: ${res.status}`);
      }
      return res.json();
    });

    if (response.task_id === undefined) {
      handleError(new Error('Task ID not found in response'));
      return;
    }

    const newData = (await getTaskResult(response.task_id)) as ExtendedResponse;
    setState(newData.data);
  } catch (error: any) {
    if (retriesLeft > 1) {
      // Recursively attempt fetch again, decrementing retriesLeft
      await attemptFetch(
        url,
        setState,
        handleError,
        queryParams,
        retriesLeft - 1,
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
  queryParams: Record<string, any> = {},
  maxRetries: number = 3, // Default maximum retries to 3
): Promise<void> {
  await attemptFetch(url, setState, handleError, queryParams, maxRetries);
}
