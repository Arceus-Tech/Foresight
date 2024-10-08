import React, { useContext } from 'react';

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
import Toaster from '../components/ui/toaster';
import PrivateRoute from '../auth/PrivateRoute';
import AuthContext from '../auth/AuthContext';

export default function MainNavLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logoutUser } = useContext(AuthContext);
  return (
    <PrivateRoute>
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
                <DropdownMenuItem inset={false} onClick={logoutUser}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Toaster />
          </div>
        </header>

        {children}
      </div>
    </PrivateRoute>
  );
}
