import React from 'react';

import { CircleUser } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/ui/button';
import NavigationMenuBase from './nav-menu';

export default function main({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky z-[999] top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <NavigationMenuBase />

        <div className="flex  w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="ml-auto">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                asChild={false}
              >
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel inset={false}>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem inset={false}>Settings</DropdownMenuItem>
              <DropdownMenuItem inset={false}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem inset={false}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {children}
    </div>
  );
}
