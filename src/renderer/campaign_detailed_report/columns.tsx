import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../components/ui/button';
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export type CampaignName = {
  id: number;
  name: string;
};

export type Campaign = {
  campaign: CampaignName;
  followUp: number;
  callBack: number;
  appointment: number;
  converted: number;
  noAnswer: number;
  totalDeposit: number;
};

export const columns: ColumnDef<Campaign>[] = [
  {
    accessorKey: 'campaign',
    sortingFn: (rowA, rowB) => {
      // Custom sorting function
      return rowA.original.campaign.name.localeCompare(
        rowB.original.campaign.name,
      );
    },

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          asChild={false}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Campaign
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const campaign = row.getValue('campaign') as CampaignName;
      return (
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {campaign.name}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'followUp',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          asChild={false}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Follow Ups
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const followUp = row.getValue('followUp') as number;
      return <div className="text-center">{followUp}</div>;
    },
  },
  {
    accessorKey: 'callBack',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          asChild={false}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Call Backs
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const callBack = row.getValue('callBack') as number;
      return <div className="text-center">{callBack}</div>;
    },
  },
  {
    accessorKey: 'appointment',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          asChild={false}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Appointments
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const appointments = row.getValue('appointment') as number;
      return <div className="text-center">{appointments}</div>;
    },
  },

  {
    accessorKey: 'noAnswer',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          asChild={false}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          No Answer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const noAnswer = row.getValue('noAnswer') as number;
      return <div className="text-center">{noAnswer}</div>;
    },
  },
  {
    accessorKey: 'converted',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          asChild={false}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Converted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const converted = row.getValue('converted') as number;
      return <div className="text-center">{converted}</div>;
    },
  },
  {
    accessorKey: 'totalDeposit',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="w-full"
          asChild={false}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Total Deposits
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const totalDeposit = row.getValue('totalDeposit') as number;
      return <div className="text-right">$ {totalDeposit}</div>;
    },
  },
];
