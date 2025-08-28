import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader } from "../components";
import { useAuth } from "../context/AuthContext";
import * as api from "../api";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user, updateUserCredits } = useAuth();
  const [form, setForm] = useState({
    prompt: "",
    photo: "",
    cloudinaryPublicId: "", // Add this to store the Cloudinary ID
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("You must be logged in to create a post.");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const { data } = await api.generateImage({ prompt: form.prompt });

        // --- THIS IS THE FIX ---
        // The 'photo' from the API is now a direct URL.
        // We also receive the cloudinaryPublicId.
        setForm({
          ...form,
          photo: data.photo,
          cloudinaryPublicId: data.cloudinaryPublicId,
        });

        // Update credits in the global context
        updateUserCredits(data.credits);
        toast.success("Image generated successfully!");
      } catch (err) {
        if (err.response && err.response.status === 402) {
          toast.error("You are out of credits!");
          navigate("/pricing");
        } else {
          toast.error(err.response?.data?.message || "Error generating image.");
        }
      } finally {
        setGeneratingImg(false);
      }
    } else {
      toast.error("Please provide a proper prompt.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        // We now send the full form, including the cloudinaryPublicId
        const postData = {
          name: user.result.username, // Name is from the logged-in user
          prompt: form.prompt,
          photo: form.photo,
          cloudinaryPublicId: form.cloudinaryPublicId,
        };
        await api.createPost(postData);
        toast.success("Post shared successfully!");
        navigate("/");
      } catch (err) {
        toast.error(err.response?.data?.message || "Error sharing post.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please generate an image first.");
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">
          Generate an imaginative image and share it with the community
        </p>
      </div>
      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers..."
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>
        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created the image you want, you can share it with
            others in the community.
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share with the Community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
