import React, { useEffect } from 'react';

import * as api from "../../api/Api"
import Map, { applicationMode } from '../map/Map'
import TimeSlot from '../timeSlot/TimeSlot'
import * as gps from "../../util/GPS"
import * as rayCast from "../../util/PointInsidePolygon"
import { playNotificationSound } from "../../util/Notification"

import { StyledMapContainer } from './styles'

import {
  Grid,
  Button,
  FormControlLabel,
  Switch,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@material-ui/core';

const Overview: React.FC = () => {
  
  const _START_MODE_:applicationMode = "USE"
  const _STARTCOORDS_ = { lat: 53.559383, lng: 9.937278 }
  
  const [mode, setMode] = React.useState<applicationMode>(_START_MODE_)
  const [currCoords, setCurrCoords] = React.useState<{ lat: number; lng: number }>(_STARTCOORDS_)  
  const [editArea, setEditArea] = React.useState<[{ lat: number; lng: number }]>()
  const [editAreaPolyCount, setEditAreaPolyCount] = React.useState<number>(0)
  const [areaData, setAreaData] = React.useState<[{}] | undefined>(undefined)
  const [timeSlot, setTimeSlot] = React.useState<any>()
  const [userCoords, setUserCoords] = React.useState<{lat: number; lng: number}>()
  const [saving, setSaving] = React.useState<boolean>(false)
  
  const [canNotifyUser, setCanNotifyUser] = React.useState<boolean>(true)
  const [permissionToNotify, setpermissionToNotify] = React.useState<boolean>(false)
  const [showNotificationPermissionDialog, setShowNotificationPermissionDialog] = React.useState<boolean>(true)

  const setUsersGeoPosition = (coords: {lat: number; lng: number} | undefined) => coords && setUserCoords(coords)
  
  let randomIteration: number = 0
  const randomCoords = () => {
    randomIteration++;

    if (randomIteration % 2 > 0) {
      setUsersGeoPosition({lat: 53.661108, lng: 9.805738})
      playNotificationSound()
    } else {
      setUsersGeoPosition({lat: 53.660336, lng: 9.806626})
    }    
    setTimeout(() => {
      randomCoords()
    }, 500)
  }


  /**   
   * We need to request some kind of user input because otherwise Google Chrome wont allow audio autoplay
   */ 
  const handleCloseNotificationPermissionDialog = () => {
    setShowNotificationPermissionDialog(false)
    setpermissionToNotify(true)
  }  
  
  useEffect(() => {
    
    // simulate movement
    //randomCoords()

    gps.getUserGPSCoordinates(setUsersGeoPosition)
    
    if (mode === "USE") {
      setTimeout(() => {
        api.getAreas().then( (data) => {
          if (data.error) {
            console.log("error reading area data:", data.error)
          } else {
            data.response && setAreaData(data.response?.data.records)
          }
        })
      }, 100);
    }
  }, [mode]);


  useEffect(() => {

    if (mode === "USE") {

      if (userCoords && areaData) {
        
        // Iterate over each area one by one
        // Also, we want to store the amount of intersection (either 0 or 1 most likely, 
        // unsless one area is intersecting with another) so that we can restore intersectionID to -1

        let intersectionCount = 0 

        areaData && areaData.forEach((area: any) => {
          // Reorder the array structure from "lat: … lng: …" to […, …]

          let areaArray: any
          let i: number = 0
          JSON.parse(area.coords).forEach((coords: {lat: number, lng: number}) => {
            let thisCoords: number[] = [coords.lat, coords.lng]
            if (i === 0) {
              areaArray = [thisCoords]
            } else {
              areaArray.push(thisCoords)
            }
            i++
          })
          
          // Check for intersection with one of the areas
          
          if ( rayCast.inside([userCoords.lat, userCoords.lng], areaArray) ) {
            intersectionCount++;
          }

        })
        
        // end of the loop
        
        // if an intersection took place

        if ( intersectionCount > 0 ) {

          // if the user is not notified yet

          if ( canNotifyUser ) {

            // if we got the permission to notify him

            if ( permissionToNotify ) {
              //playNotificationSound()
              setCanNotifyUser(false)
            }

          }
        
        } else {
          setCanNotifyUser(true)
        }        

      }

    }

  }, [userCoords, permissionToNotify])
    
  const onCenterChanged = (coords: { lat: number; lng: number }) => {    
    setCurrCoords(coords)
  }

  const handleAddCoordsClick = () => {
    if ( editArea ) {
      let t: [{ lat: number; lng: number }] = editArea;
      t.push(currCoords)
      setEditArea(t)
    } else {
      setEditArea(currCoords ? [currCoords] : [_STARTCOORDS_])
    }
    setEditAreaPolyCount(editAreaPolyCount+1)
  }

  const handleEndAndSave = () => {
    if ( editArea && editArea.length > 2 ) {
      // force refresh of time slot component
      setSaving(true)
      api.saveArea(editArea).then((data: any) => {
        if (data.error)
          return
        if (data.response?.statusText === "OK") {
          let lastAreaID: number = data.response.data
          api.saveTimeRestriction(timeSlot, lastAreaID).then((data: any) => {
            if (data.error) {
              alert("error saving timeslot. Message: " + data.error)
            }
          })
        }
        setSaving(false)
      })

      // clean up
      setEditArea(undefined)
      setEditAreaPolyCount(0)
    } else {
      alert("An area must consist out of at least 3 edges. You only provided " + editArea?.length + ".")
    }
  }

  const handleChangeMode = () => {
    setMode(mode === "USE" ? "EDIT" : "USE")
    // clear current data (and load new when switched back)
    if (mode === "USE") {
      setAreaData(undefined)
    }
  }

  const handleTimeSlotChanged = (timeSlot: any) => {
    setTimeSlot(timeSlot)
  }

  const handlePinClicked = (id: number) => {
    id && api.getTimeRestriction(id).then((data: any) => {
      if (data.error)
        return
      data?.response.data.records.forEach((entry: any) => {
        alert(JSON.stringify(JSON.parse(entry.data)))
      })
    })
  }

  return (
    <>

    <Dialog onClose={handleCloseNotificationPermissionDialog} aria-labelledby="simple-dialog-title" open={showNotificationPermissionDialog}>
      <DialogTitle id="simple-dialog-title">Bevor du losläufst…</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Um eine möglichst schnelle und barrierefreie Benachrichtung zu ermöglichen, verwendet diese Web-App ein akustisches Signal 🎶.
            Bitte stelle daher sicher, dass der Ton an deinem Smartphone eingeschaltet ist. ✌️
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNotificationPermissionDialog} color="primary">
            Alles klar
          </Button>
        </DialogActions>
    </Dialog>

      <Grid container spacing={0}>

        <Grid item xs={3}>
          <FormControlLabel
            control={<Switch checked={mode==="EDIT"} onChange={handleChangeMode} name="" />}
            label={mode === "USE" ? "Benutzen" : "Bearbeiten"}
          />
        </Grid>
        
        {mode === "EDIT" && (

          <Grid item xs={8}>
            <Grid container spacing={0}>
              <Grid item xs={3}>                
                <Button variant="outlined" color="primary" onClick={handleAddCoordsClick}>Hinzufügen</Button>
                <Button variant="outlined" color="secondary" onClick={handleEndAndSave}>speichern</Button>
              </Grid>
              <Grid item xs={8}>
                {!saving &&
                  <TimeSlot onTimeSlotChanged={handleTimeSlotChanged}></TimeSlot>}
              </Grid>
            </Grid>
          </Grid>
        )}

      </Grid>

      <Grid container spacing={0}>
        <Grid item xs={12}>
          <StyledMapContainer>
            {(mode === "EDIT" || (mode === "USE" && areaData)) ? 
            <Map 
              apiKey={process.env.NODE_ENV === "production" ? process.env.REACT_APP_GOOGLE_MAPS_API_KEY : ""}
              onCenterChanged={onCenterChanged} 
              center={mode === "EDIT" ? currCoords : userCoords}
              editPolygons={editArea && editArea} 
              editPolyCount={editAreaPolyCount}
              areaData={areaData && areaData}     
              mode={mode}
              pinClickHandler={handlePinClicked}
              ></Map>
              : "Loading..."
            }
          </StyledMapContainer>
        </Grid>
      </Grid>

    </>
  );
}

export default Overview;
