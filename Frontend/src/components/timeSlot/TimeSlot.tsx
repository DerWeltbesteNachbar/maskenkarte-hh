import React, { useEffect } from 'react';

import { StyledTimeRestrictionContainer } from './styles'

import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import TimeIcon from '@material-ui/icons/AccessTime';

type weekday = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

interface TimeSlotProps {
  readonly onTimeSlotChanged: Function
}

const TimeSlot: React.FC<TimeSlotProps> = ({onTimeSlotChanged}) => {
  
  const _DEFAULT_WEEKDAY_: weekday = "monday"
  const _DEFAULT_TIME_FROM_: string = "00:00"
  const _DEFAULT_TIME_TO_: string = "23:59"

  const [tempWeekday, setTempWeekday] = React.useState<weekday>(_DEFAULT_WEEKDAY_)
  const [tempTimeFrom, setTempTimeFrom] = React.useState<string>(_DEFAULT_TIME_FROM_)
  const [tempTimeTo, setTempTimeTo] = React.useState<string>(_DEFAULT_TIME_TO_)
  const [timeSlot, setTimeSlot] = React.useState<any>()
  const [entryCounter, setEntryCounter] = React.useState<number>(0)
  
  useEffect(() => {
    setTimeSlot({
      "monday": [],
      "tuesday": [],
      "wednesday": [],
      "thursday": [],
      "friday": [],
      "saturday": [],
      "sunday": []
    })
  }, []);

  const onChangeWeekday = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTempWeekday(event.target.value as weekday);
  };
  
  const onChangeTimeFrom = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTempTimeFrom(event.target.value as string);
  };
  
  const onChangeTimeTo = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTempTimeTo(event.target.value as string);
  };
  
  const onAddTimeClick = () => {
    let currTimeSlot: {from: string, to: string} = {
        from: tempTimeFrom,
        to: tempTimeTo
    }
    if ( timeSlot ) {      
      let lastTimeSlot: any = timeSlot
      let lastWeekdayData: [{}] = timeSlot[tempWeekday]      
      lastWeekdayData && lastWeekdayData.push(currTimeSlot)
      lastTimeSlot[tempWeekday] = lastWeekdayData      
      setTimeSlot(lastTimeSlot)
      onTimeSlotChanged(lastTimeSlot)
    }
    setEntryCounter(entryCounter+1) 
  };

  const createList = () => {
    if ( timeSlot ) {
      let markupBuffer: [any] = [null];
      for (let [key, value] of Object.entries(timeSlot)) {
        let timeData:[] = value as []
        let timePerWeekday: string = ""
        timeData.forEach((time: {from: string; to: string}) => {
          timePerWeekday += time.from + " - " + time.to + ", "
        })
        markupBuffer.push(
          <ListItem key={key}>
            <ListItemAvatar>
              <Avatar>
                <TimeIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={key} secondary={timePerWeekday}/>
          </ListItem>
        )
      }
      return markupBuffer
    }
  }

  return (
    <>
      <StyledTimeRestrictionContainer noValidate>        
        <FormControl variant="filled">
          <InputLabel id="weekday-label">Weekday</InputLabel>        
          <Select
            labelId="weekday-label"
            value={tempWeekday}
            onChange={onChangeWeekday}
          >            
            <MenuItem value={"monday"}>Monday</MenuItem>
            <MenuItem value={"tuesday"}>Tuesday</MenuItem>
            <MenuItem value={"wednesday"}>Wednesday</MenuItem>
            <MenuItem value={"thursday"}>Thursday</MenuItem>
            <MenuItem value={"friday"}>Friday</MenuItem>
            <MenuItem value={"saturday"}>Saturday</MenuItem>
            <MenuItem value={"sunday"}>Sunday</MenuItem>            
          </Select>
        </FormControl>        
        <TextField
          label="Time from"
          variant="filled"
          type="time"
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
          onChange={onChangeTimeFrom}
          value={tempTimeFrom}
        />
        <TextField
          label="Time to"
          variant="filled"
          type="time"
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
          onChange={onChangeTimeTo}
          value={tempTimeTo}
        />
        <Button variant="outlined" color="secondary" onClick={onAddTimeClick}>Add time</Button>
      </StyledTimeRestrictionContainer>        
      <List>
        {createList()}
      </List>
    </>
  );
}

export default TimeSlot;
