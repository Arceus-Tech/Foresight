import { Calendar as CalendarIcon } from 'lucide-react';
import React from 'react';
import { format, subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import Label from '../components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';
import { Button } from '../components/ui/button';
import cn from '../lib/utils';
import { Calendar } from '../components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

export default function QuerySection({
  date,
  setDate,
  handleSearch,
}: {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  handleSearch: (dates: DateRange | undefined) => void;
}) {
  const formattedFrom = date && date.from ? format(date.from, 'LLL dd, y') : '';
  const formattedTo = date && date.to ? format(date.to, 'LLL dd, y') : '';

  const [openPopover, setOpenPopover] = React.useState(false);

  const handleSubmit = (dateS: DateRange | undefined) => {
    setOpenPopover((prev) => !prev);
    handleSearch(dateS);
  };

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
  };

  return (
    <div className="relative hidden flex-col items-start gap-8 md:flex">
      <form className="grid w-full items-start gap-6">
        <fieldset className="grid grid-cols-5 gap-6 rounded-lg border p-4">
          <div className="grid gap-3">
            <Label htmlFor="max-tokens">Date Range</Label>
            <Popover open={openPopover} onOpenChange={setOpenPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  asChild={false}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date && date.from ? (
                    <>
                      {formattedFrom} - {formattedTo}
                    </>
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto  mx-5 p-0 flex">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={(selectedDate) => handleDateSelect(selectedDate)}
                  initialFocus
                  numberOfMonths={2}
                />
                <div className=" flex flex-col justify-between items-start p-5">
                  <RadioGroup
                    defaultValue="option-7"
                    onValueChange={(value) =>
                      setDate(() => ({
                        from: subDays(new Date(), parseInt(value, 10)),
                        to: new Date(),
                      }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="option-0" />
                      <Label htmlFor="option-0">Today</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="option-3" />
                      <Label htmlFor="option-3">Last 3 Days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7" id="option-7" />
                      <Label htmlFor="option-7">Last Week</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30" id="option-30" />
                      <Label htmlFor="option-30">Last Month</Label>
                    </div>
                  </RadioGroup>

                  <Button
                    variant="default"
                    asChild={false}
                    className="mt-5 w-full"
                    onClick={() => handleSubmit(date)}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
