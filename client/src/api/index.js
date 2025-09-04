import axios from "axios";

// Create an Axios instance pointing to your backend API
const API = axios.create({ baseURL: "http://localhost:8080/api/v1" });

// Interceptor: This function runs before every request.
// It adds the authentication token to the header if the user is logged in.
API.interceptors.request.use((req) => {
  const profile = localStorage.getItem("profile");
  if (profile) {
    const token = JSON.parse(profile).token;
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Post Routes ---
export const fetchPosts = () => API.get("/post");
export const createPost = (newPost) => API.post("/post", newPost);
export const likePost = (id) => API.patch(`/post/${id}/like`);
export const deletePost = (id) => API.delete(`/post/${id}`);

// --- Comment Routes ---
export const addComment = (id, commentData) =>
  API.post(`/post/${id}/comment`, commentData);
// Add this to client/src/api/index.js
export const fetchCommentsForPost = (id) => API.get(`/post/${id}/comments`);
export const fetchPostById = (id) => API.get(`/post/${id}`); 

// --- Auth Routes ---
export const signIn = (formData) => API.post("/auth/login", formData);
export const signUp = (formData) => API.post("/auth/signup", formData);
// --- User Profile Routes (NEW) ---
export const fetchUserProfile = (id) => API.get(`/users/${id}`);
export const fetchPostsByUser = (id) => API.get(`/users/${id}/posts`);
// --- DALL-E Route ---
export const generateImage = (promptData) => API.post("/dalle", promptData);
//admin route to getch stats
export const getAdminStats = () => API.get("/admin/stats");
export const getMostLikedPosts = () => API.get("/admin/posts/most-liked");
export const getMostCommentedPosts = () =>
  API.get("/admin/posts/most-commented");
export const getPostStatsForChart = () => API.get("/admin/posts/chart-stats");
