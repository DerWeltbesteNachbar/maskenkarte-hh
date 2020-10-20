import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import GoogleMapReact from 'google-map-react';
import * as api from "../../api/Api"
import { 
  Grid,
  Button,
  Typography,
} from '@material-ui/core';
import StartIcon from '@material-ui/icons/PlayArrowRounded';
import StopIcon from '@material-ui/icons/StopRounded';
import TheMap from '../theMap/TheMap'

const StyledControllsContainer = styled(Grid)`
  ${({ theme }) => css`
    padding: ${theme.spacing(3,0)};
  `}
`;

const StyledMapContainer = styled.div`
  height: 75vh;
`;

/*
  Underlaying SQL

  CREATE TABLE areas (
    ID BIGINT NOT NULL AUTO_INCREMENT,
    coords TEXT NOT NULL,
    PRIMARY KEY (ID)
  )
  ENGINE=InnoDB; 
*/

const Map: React.FC = () => {
  
  const [areaIDs, setAreaIDs] = React.useState<number[]>([])  
  const [isRecording, setIsRecording] = React.useState<boolean>(false)  
  const [currCoords, setCurrCoords] = React.useState<{}>(0)  
  const [tempArea, setTempArea] = React.useState<[{}]>()
  const [tempAreaPolyCount, setTempAreaPolyCount] = React.useState<number>(0)

  
  useEffect(() => {
    api.getAreas()
  }, []);
    
  const onCenterChanged = (coords: {}) => {    
    setCurrCoords(coords)
  }

  const handleRecordToggle = () => {
    setIsRecording(!isRecording)
  }

  const handleAddCoordsClick = () => {
    if ( tempArea ) {
      let _tempArea: [{}] = tempArea;
      _tempArea.push(currCoords)
      setTempArea(_tempArea)
    } else {
      setTempArea([currCoords])
    }
    setTempAreaPolyCount(tempAreaPolyCount+1)
  }

  return (
    <Grid container spacing={0}>

      <Grid item xs={12}>
        <StyledControllsContainer>

          <Button variant="outlined" color="primary" onClick={handleRecordToggle}>
            Starte markierung
            {isRecording 
              ? <StopIcon></StopIcon>
              : <StartIcon></StartIcon>
            }
          </Button>
          {isRecording 
            && <Button variant="outlined" color="primary" onClick={handleAddCoordsClick}>Hinzufügen</Button>
          }
          
          {tempArea && tempArea.map((it) => {
            return <div>{Object.values(it)[0] + ", " + Object.values(it)[1]}</div>
          })}

        </StyledControllsContainer>
      </Grid>

      <Grid item xs={12}>
        <StyledMapContainer>
          <TheMap onCenterChanged={onCenterChanged} polygons={tempArea} polyCount={tempAreaPolyCount}></TheMap>
        </StyledMapContainer>
      </Grid>
    </Grid>
  );
}

export default Map;
