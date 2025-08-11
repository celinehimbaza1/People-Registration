import axios from "axios";

const API_KEY = "372d5a62c3msh675d920177e7bcap1a93e8jsn492688e1f273";
const BASE_URL = "https://rwanda.p.rapidapi.com";

const headers = {
  "X-RapidAPI-Key": API_KEY,
  "X-RapidAPI-Host": "rwanda.p.rapidapi.com",
};

export const fetchDistricts = async () => {
  try {
    console.log("Fetching all districts...");
    const response = await axios.get(
      `${BASE_URL}/location/districts`,
      { headers }
    );
    console.log("Districts response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch districts:", error);
    // Return some sample data as fallback
    return [
      { name: "Kicukiro" },
      { name: "Gasabo" },
      { name: "Nyarugenge" }
    ];
  }
};

export const fetchSectors = async (district: string) => {
  try {
    console.log("Fetching sectors for district:", district);
    const response = await axios.get(
      `${BASE_URL}/location/sectors/${encodeURIComponent(district)}`,
      { headers }
    );
    console.log("Sectors response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sectors:", error);
    // Return some sample data as fallback
    return [
      { name: "Kanombe" },
      { name: "Gikondo" },
      { name: "Kigarama" }
    ];
  }
};

export const fetchCells = async (sector: string) => {
  try {
    console.log("Fetching cells for sector:", sector);
    const response = await axios.get(
      `${BASE_URL}/location/cells/${encodeURIComponent(sector)}`,
      { headers }
    );
    console.log("Cells response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cells:", error);
    // Return some sample data as fallback
    return [
      { name: "Kamashashi" },
      { name: "Kanserege" },
      { name: "Kigarama" }
    ];
  }
};

export const fetchVillages = async (cell: string) => {
  try {
    console.log("Fetching villages for cell:", cell);
    const response = await axios.get(
      `${BASE_URL}/location/villages/${encodeURIComponent(cell)}`,
      { headers }
    );
    console.log("Villages response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch villages:", error);
    // Return some sample data as fallback
    return [
      { name: "Kamashashi" },
      { name: "Kanserege" },
      { name: "Kigarama" }
    ];
  }
};
