import axios from "axios";

const apiPath = "http://localhost:8888/maskenkarte-hh/Services/api.php";
const apiCoordsPath = `${apiPath}/records/areas`;
const apiGMapsAPIPath = `${apiPath}/records/gmkey`;

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

export const getMapsAPIKey = () =>
  axios
    .get(`${apiGMapsAPIPath}`)
    .then((response) => ({response, error: undefined}))
    .catch((error) => ({response: undefined, error}));
    
export const saveArea = (coords: [{ lat: number; lng: number }]) => {
  axios
    .post(`${apiCoordsPath}`, {
      coords: JSON.stringify(coords)
    })
    .then(function (response) {
      console.log("Area successfully saved.")
    })
    .catch(function (error) {
      console.log("Error saving area: ", error.response);
    });
}