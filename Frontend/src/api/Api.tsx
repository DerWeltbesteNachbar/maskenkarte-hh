import axios from "axios";

const apiPath = "https://dev.borchert.design/maskenkarte-hh/Services/api.php";
const apiCoordsPath = `${apiPath}/records/areas`;
const apiTimeRestrictionPath = `${apiPath}/records/time_restriction`;

// Read

export const getAreas = () =>
  axios
    .get(`${apiCoordsPath}`)
    .then((response) => ({response, error: undefined}))
    .catch((error) => ({response: undefined, error}));
    
export const getCoords = (areaID: number) =>
  axios
    .get(`${apiCoordsPath}/${areaID}`)
    .then((response) => ({response, error: undefined}))
    .catch((error) => ({response: undefined, error}));

export const getTimeRestriction = (areaID: number) =>
  axios
    .get(`${apiTimeRestrictionPath}?filter=areaID,eq,${areaID}`)
    .then((response) => ({response, error: undefined}))
    .catch((error) => ({response: undefined, error}));

// Create

export const saveTimeRestriction = (
  data: any,
  areaID: number) => 
  axios
    .post(`${apiTimeRestrictionPath}`, { 
      data: JSON.stringify(data),
      areaID: areaID
     })
    .then((response) => ({response, error: undefined}))
    .catch((error) => ({response: undefined, error}));

export const saveArea = (coords: [{ lat: number; lng: number }]) =>
  axios
    .post(`${apiCoordsPath}`, { coords: JSON.stringify(coords) })
    .then((response) => ({response, error: undefined}))
    .catch((error) => ({response: undefined, error}));

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
  data JSON NOT NULL,
  areaID BIGINT,
  PRIMARY KEY (ID),
  FOREIGN KEY (areaID) REFERENCES areas(ID)
)
ENGINE=InnoDB;
*/