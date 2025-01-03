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
import { Send } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EventItem from '../components/EventItem';

interface EventType {
  name: string;
  isGood: boolean | null;
  eventDate?: string | null;
  additionalInfo?: string[] | null;
}
const eventTypes: EventType[] = [
  {
    "name": "Bought Starbucks",
    "isGood": false,
    "additionalInfo": ["price"]
  },
  {
    "name": "Morning Walk",
    "isGood": true,
    "additionalInfo": ["distance", "time"]
  },
  {
    "name": "Cooked Lunch",
    "isGood": true
  },
  {
    "name": "Ordered Lunch (delivery)",
    "isGood": false,
    "additionalInfo": ["price"]
  },
  {
    "name": "Ordered Lunch (takeout)",
    "isGood": false,
    "additionalInfo": ["price"]
  },
  {
    "name": "Cooked Dinner",
    "isGood": true
  },
  {
    "name": "Ordered Dinner (delivery)",
    "isGood": false,
    "additionalInfo": ["price"]
  },
  {
    "name": "Ordered Dinner (takeout)",
    "isGood": false,
    "additionalInfo": ["price"]
  },
  {
    "name": "Went to Gym",
    "isGood": true
  },
  {
    "name": "Weighed in",
    "isGood": null,
    "additionalInfo": ["weight", "waist"]
  },
  {
    "name": "At home ab day (10+ min)",
    "isGood": true
  },
  {
    "name": "At yoga / stretching (10+ min)",
    "isGood": true
  }
]
export default function Home() {
  const [eventType, setEventType] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [apiData, setApiData] = React.useState<any>(null);

  const [date, setDate] = React.useState<Dayjs | null>(dayjs());
  const [currentEvents, setCurrentEvents] = React.useState([]);

  const handleChange = (event: SelectChangeEvent) => {
    setEventType(event.target.value as string);
  };
  const handleGet = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/event', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setCurrentEvents(result)
    } catch (error) {
      console.error('failed getting data', error);
    }
    setLoading(false)
  }
  const handleSubmit = async () => {
    setLoading(true)
    try {
      const additionalInfo = eventTypes.find((et: EventType) => et.name === eventType)?.additionalInfo
      const additionalInfoJson: any = {}
      if (additionalInfo) {
        additionalInfo.forEach((info: string) => {
          additionalInfoJson[info] = 'test'
        })
      }
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType, date, isGood: eventTypes.find((et: EventType) => et.name === eventType)?.isGood,
          additionalInfo: additionalInfoJson
        }),
      });

      if (!response.ok) {
        setApiData({ status: 'danger', message: `Event: "${eventType}" created unsuccessfully!` })
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setApiData({ status: 'success', message: `Event: "${eventType}" created successfully!` })
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>

      <main className={`container-lg text-center`}>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Card variant="outlined" className={`mt-3 mb-3 p-3`}>
          {apiData &&
            <Alert className='mb-3' icon={apiData.status === 'success' ? <CheckIcon fontSize="inherit" /> : <CloseIcon fontSize="inherit" />} severity={apiData.status}>
              {apiData.message}
            </Alert>
          }
          <form>
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
            <FormControl>
              <Button disabled={loading} onClick={handleSubmit} variant="contained" color='success' endIcon={
                <Send />
              }>
                Submit Event
              </Button>
            </FormControl>
            <FormControl>
              <Button disabled={loading} onClick={handleGet} variant="contained" color='info' endIcon={<Send />}>
                Get Events
              </Button>
            </FormControl>
          </form>
        </Card>
        {currentEvents.length > 0 &&
          <Card variant="outlined" className={`mt-3 mb-3 p-3`}>
            <h2>Current Events</h2>
            <div className='row'>
              {currentEvents.map((event: any) => (
                <EventItem key={event.id} event={event} refresh={handleGet}/>
              ))}
            </div>
          </Card>
        }
      </main>
    </LocalizationProvider >
  )
}
