import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useState } from 'react';

interface EventItemProps {
    event: any;
    refresh: any;
}
const EventItem: React.FC<EventItemProps> = ({ event, refresh }) => {
    const [open, setOpen] = useState<boolean>(false)
    const [responseMessage, setResponseMessage] = useState<string>('')

    const date = dayjs(event.eventdate.substring(0, 10)).format('MM/DD/YYYY');
    const handleDelete = async () => {
        const res = await fetch(`/api/event/${event.id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            setResponseMessage('Event deleted successfully!')
            refresh()
        } else {
            setResponseMessage('Event deletion failed!')
        }
        setOpen(true)
    }
    const handleWarningClose = () => {
        setOpen(false);
    }
    return <>
        <Snackbar open={open} autoHideDuration={3000} anchorOrigin={{ horizontal: 'center', vertical: 'top' }} onClose={handleWarningClose}>
            <Alert
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {responseMessage}
            </Alert>
        </Snackbar>
        <div key={event.id} className='col-12 col-sm-6 col-md-4 mb-2 d-flex justify-content-between p-2' style={{
            border: '1px solid black',
            borderRadius: '5px',
            backgroundColor: event.isgood ? '#90EE90' : '#d8504d'
        }}>
            <div className='d-block'>
                <h3>{event.name}</h3>
                <h5>{date}</h5>
            </div>
            <div className='d-flex flex-column'>
                <Button className='h-50 m-1' variant="contained" color='error' onClick={handleDelete}><DeleteIcon /></Button>
                <Button className='h-50 m-1' variant="contained" color='info'><EditIcon /></Button>
            </div>
        </div>
    </>
}
export default EventItem;