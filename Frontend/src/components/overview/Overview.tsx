import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import * as api from "../../api/Api"
import {
  Grid,
  Button,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import Map from '../map/Map'

const StyledControllsContainer = styled(Grid)`
  ${({ theme }) => css`
    padding: ${theme.spacing(3,0)};
  `}
`;

const StyledMapContainer = styled.div`
  height: 75vh;
  position: relative;
  &::before, &::after {
    content: "";
    position: absolute;
    width: 100px;
    height: 1px;
    background: #E66A73;
    left: 50%;
    transform: translateX(-50%);
    top: 50%;
    z-index: 3;
  }
  &::after {
    transform: translateX(-50%) rotateZ(90deg);
  }
`;

/*
  Underlaying SQL

  CREATE TABLE areas (
    ID BIGINT NOT NULL AUTO_INCREMENT,
    coords TEXT NOT NULL,
    PRIMARY KEY (ID)
  )
  ENGINE=InnoDB; 
  
  CREATE TABLE time_restriction (
    ID BIGINT NOT NULL AUTO_INCREMENT,
    weekday TEXT NOT NULL,
    time_from TIME NOT NULL,
    time_to TIME NOT NULL,
    areaID BIGINT,
    PRIMARY KEY (ID),
    FOREIGN KEY (areaID) REFERENCES areas(ID)
  )
  ENGINE=InnoDB;
    
  CREATE TABLE gmkey (
    ID BIGINT NOT NULL AUTO_INCREMENT,
    thekey INT NOT NULL,
    PRIMARY KEY (ID)
  )
  ENGINE=InnoDB; 
  */


const Overview: React.FC = () => {
  
  type mode = "EDIT" | "USE"
  const _STARTCOORDS_ = { lat: 53.559383, lng: 9.937278 }

  const [areaIDs, setAreaIDs] = React.useState<number[]>([])  
  const [currCoords, setCurrCoords] = React.useState<{ lat: number; lng: number }>(_STARTCOORDS_)  
  const [tempArea, setTempArea] = React.useState<[{ lat: number; lng: number }]>()
  const [tempAreaPolyCount, setTempAreaPolyCount] = React.useState<number>(0)
  const [mode, setMode] = React.useState<mode>("USE")
  const [areaData, setAreaData] = React.useState<[[{ lat: number; lng: number }]]>()
  const [mapsAPIKey, setMapsAPIKey] = React.useState<string>("")
  
  
  useEffect(() => {
    api.getMapsAPIKey().then( (data) => {
      setMapsAPIKey(data.response?.data.records[0].thekey)
    })
    if (mode === "USE") {
      api.getAreas().then( (data) => {
        console.log("area data: ", data)
        if (data.error) return
        let tempData: [[{ lat: number; lng: number }]] = [[{ lat: 0, lng: 0 }]]
        data.response && data.response.data.records.forEach( (it: any) => {
          tempData.push(JSON.parse(it.coords))
        })
        setAreaData(tempData)
        setTempAreaPolyCount(tempData.length)
      })
    }
  }, [mode]);
    
  const onCenterChanged = (coords: { lat: number; lng: number }) => {    
    setCurrCoords(coords)
  }

  const handleAddCoordsClick = () => {    
    let _tempArea: [{ lat: number; lng: number }] = tempArea ? tempArea : [currCoords];
    _tempArea.push(currCoords)
    setTempArea(_tempArea)
    setTempAreaPolyCount(tempAreaPolyCount+1)
  }

  const handleEndAndSave = () => {
    tempArea && api.saveArea(tempArea);
    setTempArea(undefined)
    setTempAreaPolyCount(0)
  }

  const handleChangeMode = () => {
    if ( mode === "USE" ) {
      setMode("EDIT");
      setTempAreaPolyCount(0)
    } else {
      setMode("USE")
    }
  }

  return (
    <Grid container spacing={0}>

      <Grid item xs={6}>
      <FormControlLabel
        control={<Switch checked={mode==="EDIT"} onChange={handleChangeMode} name="" />}
        label={mode === "USE" ? "Benutzen" : "Bearbeiten"}
      />
      </Grid>
      <Grid item xs={6}>
        <StyledControllsContainer>
          {mode === "EDIT" && (
            <>              
              <Button variant="outlined" color="primary" onClick={handleAddCoordsClick}>Hinzufügen</Button>
              <Button variant="outlined" color="secondary" onClick={handleEndAndSave}>speichern</Button>
            </>
          )}
        </StyledControllsContainer>
      </Grid>

      <Grid item xs={12}>
        <StyledMapContainer>
          {mapsAPIKey ?
          <Map 
            onCenterChanged={onCenterChanged} 
            polygons={mode === "USE" ? areaData : tempArea && [tempArea]} 
            polyCount={tempAreaPolyCount}
            defaultCenter={currCoords}
            apiKey={/*mapsAPIKey*/""}></Map>
            : "Loading..."
          }
        </StyledMapContainer>
      </Grid>
    </Grid>
  );
}

export default Overview;
