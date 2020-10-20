import axios from "axios";

const apiPath = "http://localhost:8888/CRUD-Test/Services/api.php";
const apiCoordsPath = `${apiPath}/records/areas`;

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

export const addArea = (coords: [{}]) => {
  console.log("Adding coords: " + coords)
}