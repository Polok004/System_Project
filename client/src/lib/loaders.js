import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts?" + query);
  return defer({
    postResponse: postPromise,
  });
};


export const profilePageLoader = async () => {
  try {
    const response = await apiRequest.get("/users/profilePosts"); // Adjust the API route if needed
    console.log("API Response in Loader:", response.data); // Debugging API response
    return { postResponse: response.data }; // Ensure postResponse structure is correct
  } catch (err) {
    console.error("Error fetching profile posts in loader:", err);
    throw new Error("Failed to fetch profile posts");
  }
};

  
  