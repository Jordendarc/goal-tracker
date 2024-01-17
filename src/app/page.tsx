'use client'

import Card from '@mui/material/Card';
import * as React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import CheckBoxOutlined from '@mui/icons-material/CheckBoxOutlined';
import { Send } from '@mui/icons-material';


class EventType {
  name: string;
  isGood: boolean | null;
  constructor(name: string, isGood: boolean) {
    this.name = name;
    this.isGood = isGood;
  }
}
const eventTypes: EventType[] = [
  {
    "name": "Bought Starbucks",
    "isGood": false
  },
  {
    "name": "Morning Walk",
    "isGood": true
  },
  {
    "name": "Cooked Lunch",
    "isGood": true
  },
  {
    "name": "Ordered Lunch (delivery)",
    "isGood": false
  },
  {
    "name": "Ordered Lunch (takeout)",
    "isGood": false
  },
  {
    "name": "Cooked Dinner",
    "isGood": true
  },
  {
    "name": "Ordered Dinner (delivery)",
    "isGood": false
  },
  {
    "name": "Ordered Dinner (takeout)",
    "isGood": false
  },
  {
    "name": "Went to Gym",
    "isGood": true
  },
  {
    "name": "Weighed in",
    "isGood": null
  }
]
export default function Home() {
  const [eventType, setEventType] = React.useState<string>('');
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());

  const handleChange = (event: SelectChangeEvent) => {
    setEventType(event.target.value as string);
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <main className={`container-lg text-center`}>
        <h1 className='mb-2 mt-3'>ジョジョのGoal Tracker</h1>
        <Card variant="outlined" className={`mt-3 mb-3 p-3`}>
          <FormControl fullWidth>
            <InputLabel id="event-type">Event Type</InputLabel>
            <Select
              labelId="event-type"
              id="event-type-select"
              value={eventType}
              onChange={handleChange}
              className={``}
            >
              {eventTypes.map((eventType: EventType) => (
                <MenuItem key={eventType.name} value={eventType.name}>{eventType.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>

            <DatePicker
              className={`mt-3 mb-3`}
              label="Event Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
            />
          </FormControl>
          <FormControl fullWidth>
            <Button variant="contained" color='success' endIcon={<Send />}>
              Submit Event
            </Button>
          </FormControl>
        </Card>
      </main>
    </LocalizationProvider>
  )
}
