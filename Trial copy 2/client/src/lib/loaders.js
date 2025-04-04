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
    const [postResponse, chatResponse] = await Promise.all([
      apiRequest.get("/users/profilePosts"),
      apiRequest.get("/chats"),
    ]);

    return {
      postResponse: postResponse.data,
      chatResponse: chatResponse.data,
    };
  } catch (err) {
    console.error("Error fetching profile data:", err.response?.status, err.message);
    
    if (err.response?.status === 401) {
      // Redirect to login for unauthorized errors
      throw new Error("Your session has expired. Please log in again.");
    }
    
    throw new Error("Failed to load profile data. Please try again later.");
  }
};
