import * as React from 'react';
import { Link } from 'react-router-dom';
import cn from '../lib/utils';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../components/ui/navigation-menu';

const historicalReportItems: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: 'Campaigns',
    href: '/historical-report',
    description: 'View to see the performance of the campaigns that were run.',
  },
  {
    title: 'Employees',
    href: '/historical-report',
    description: 'View to see the performance of the employees in the company.',
  },
];

const dashboardItems: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: 'Overall Performance',
    href: '/',
    description: 'View to see the overall performance of the company.',
  },
  {
    title: 'Sales',
    href: '/sales',
    description: 'View to see the sales performance of the company.',
  },
  {
    title: 'Retention',
    href: '/retention',
    description: 'View to see the retention performance of the company.',
  },
];

type ListItemProps = {
  // eslint-disable-next-line react/require-default-props
  className?: string;
  title: string;
  to: string;
  children: React.ReactNode;
};

const ListItem = React.forwardRef<React.ElementRef<'a'>, ListItemProps>(
  ({ className, title, to, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            to={to}
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';

export default function NavigationMenuBase() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Dashboard</NavigationMenuTrigger>
          <NavigationMenuContent className=" bg-white">
            <ul className="grid gap-3 p-6 bg-white md:w-[700px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        viewBox="0 0 95.8 82.4"
                      >
                        <polygon
                          points="95.8 82.4 85.3 82.4 80.2 73.6 70.3 73.6 75.4 82.4 65.2 82.4 60.2 73.6 44.4 73.6 44.4 64.6 54.9 64.6 47.9 52.5 30.5 82.4 20.3 82.4 47.9 35 65.1 64.6 75 64.6 47.9 18 10.5 82.4 0 82.4 47.9 0 95.8 82.4"
                          fill="#000"
                        />
                      </svg>
                    </span>
                    <span className="sr-only">Arceus CRM</span>
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Arceus Report
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Well organized reports and dashboards to help you make the
                      right decisions. Integrated with Arceus CRM
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>

              {dashboardItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Historical Report</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {historicalReportItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  to={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/hierarchy-flow">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Hierarchy
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
