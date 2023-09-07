import axios from "axios";

const BASE_URL = "https://backend.fourseasonglassrooms.com:3000";

export async function getAnnouncementByEmployee() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${BASE_URL}/api/employee/announcements`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
}
