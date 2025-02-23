// About.tsx
"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../api";
import { toast } from "sonner";
interface AboutData {
  image: string;
  name: string;
  education: string;
  profession: string;
  phoneNo: string;
  email: string;
  adress: string;
  date_of_birth: string;
  description: string;
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true); // State للتحميل
  const [isEditing, setIsEditing] = useState(false); // State لوضع التعديل
  const [newAboutData, setNewAboutData] = useState({
    name: "",
    image: "" as string | File, // تغيير نوع image ليقبل string أو File
    description: "",
    education: "",
    adress: "",
    date_of_birth: "",
    email: "",
    phoneNo: "",
    profession: "",
  });
  const [error, setError] = useState<string | null>(null); // State للأخطاء

  // معالجة إرسال النموذج
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      image,
      name,
      description,
      education,
      phoneNo,
      email,
      profession,
      adress,
      date_of_birth,
    } = newAboutData;

    if (!image) {
      toast.warning("Please select an image.");
      return;
    }

    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", name); // Add title
      formData.append("description", description); // Add description
      formData.append("education", education); // Add description
      formData.append("phoneNo", phoneNo); // Add description
      formData.append("profession", profession); // Add description
      formData.append("adress", adress); // Add description
      formData.append("date_of_birth", date_of_birth); // Add description
      formData.append("email", email); // Add description

      // Check if the image is a Base64 string or a file
      if (typeof image === "string") {
        // If it's Base64, send it as a string
        formData.append("image", image);
      } else if (image instanceof File) {
        // If it's a file, send it directly
        formData.append("image", image);
      } else {
        throw new Error("Invalid image format");
      }

      // Send the request
      const response = await axios.post(`${BASE_URL}about`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Specify content type
        },
      });

      toast.success("Data saved successfully!");
      setAboutData(response.data); // Update the about data
      setIsEditing(false); // Exit edit mode
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error("Failed to save data.");
        console.error("Error saving data:", error.message);
        setError(error.message || "Failed to save data");
      } else {
        toast.error("Failed to save data.");
        console.error("Unknown error occurred", error);
        setError("An unknown error occurred.");
      }
    }
  };

  // جلب البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${BASE_URL}about`);
        setAboutData(response.data[0]); // Assume there's only one record
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching about data:", err.message);
          setError(err.message || "Failed to fetch data");
        } else {
          console.error("Unknown error occurred");
          setError("Unknown error occurred");
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);

  return (
    <div className=" mx-auto p-4 ">
      <button
        onClick={() => setIsEditing(!isEditing)}
        className={`bg-blue-500 py-2 px-4 rounded hover:bg-blue-400 ${
          isEditing
            ? "bg-red-500 hover:bg-red-400"
            : "bg-blue-500 hover:bg-blue-400"
        }`}
      >
        {isEditing ? " close" : "edit"}
      </button>
      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      )}
      {isEditing && (
        <div
          className="fixed  "
          style={{ overflowY: "auto", maxWidth: "700px" }}
        >
          <h1 className="text-2xl font-bold mb-4">Edit About Information</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 text-white  shadow-md rounded-lg p-6 py-[20px] mt-4"
          >
            {" "}
            <div className="flex items-center gap-4">
              <div className="w-1/2">
                {/* Image Upload */}
                <div>
                  <label
                    htmlFor="image"
                    className="block text-white text-sm font-medium"
                  >
                    Upload Image:
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewAboutData((prev) => ({ ...prev, image: file }));
                      }
                    }}
                    className="mt-1 text-white block w-full"
                  />
                </div>

                {/* Title Input */}
                <div className="mt-4">
                  <label htmlFor="name" className="block text-sm font-medium">
                    name:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newAboutData.name}
                    onChange={(e) =>
                      setNewAboutData({ ...newAboutData, name: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="profession"
                    className="block text-sm font-medium"
                  >
                    profession:
                  </label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={newAboutData.profession}
                    onChange={(e) =>
                      setNewAboutData({
                        ...newAboutData,
                        profession: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium"
                  >
                    education:
                  </label>
                  <input
                    type="text"
                    id="education"
                    name="education"
                    value={newAboutData.education}
                    onChange={(e) =>
                      setNewAboutData({
                        ...newAboutData,
                        education: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="phoneNo"
                    className="block text-sm font-medium"
                  >
                    phoneNo:
                  </label>
                  <input
                    type="text"
                    id="phoneNo"
                    name="phoneNo"
                    value={newAboutData.phoneNo}
                    onChange={(e) =>
                      setNewAboutData({
                        ...newAboutData,
                        phoneNo: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="w-1/2">
                <div>
                  <div className="mt-4">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium"
                    >
                      email:
                    </label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      value={newAboutData.email}
                      onChange={(e) =>
                        setNewAboutData({
                          ...newAboutData,
                          email: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="adress"
                      className="block text-sm font-medium"
                    >
                      adress:
                    </label>
                    <input
                      type="text"
                      id="adress"
                      name="adress"
                      value={newAboutData.adress}
                      onChange={(e) =>
                        setNewAboutData({
                          ...newAboutData,
                          adress: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="date_of_birth"
                      className="block text-sm font-medium"
                    >
                      date of birth:
                    </label>
                    <input
                      type="text"
                      id="date_of_birth"
                      name="date_of_birth"
                      value={newAboutData.date_of_birth}
                      onChange={(e) =>
                        setNewAboutData({
                          ...newAboutData,
                          date_of_birth: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  {/* Description Input */}
                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium"
                    >
                      Description:
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newAboutData.description}
                      onChange={(e) =>
                        setNewAboutData({
                          ...newAboutData,
                          description: e.target.value,
                        })
                      }
                      className="w-full text-black p-2 border rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Submit and Cancel Buttons */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Data Display or Edit Form */}
      {!loading && !error && aboutData && (
        <>
          <section className=" shadow-md rounded-lg bg-gray-800 p-6 text-white mt-4">
            {/* Display Image */}
            <div className="flex items-center justify-center mb-4">
              {aboutData.image && (
                <img
                  src={aboutData.image}
                  alt="Profile"
                  className="w-40 h-40  object-cover"
                />
              )}
            </div>
            <div className="flex flex-col items-senter justify-center w-full">
              <h1 className="text-2xl text-center font-bold mb-2">
                {aboutData.name}
              </h1>
              <h2 className="text-xl text-center ">{aboutData.profession}</h2>
            </div>

            {/* Display Description */}
            <h2 className="text-lg font-bold ">
              education: {aboutData.education}
            </h2>
            <p>phoneNo: {aboutData.phoneNo}</p>
            <p>email: {aboutData.email}</p>
            <p>date of birth: {aboutData.date_of_birth}</p>
            <p>description: {aboutData.description}</p>

            {/* Edit Button */}
            <button
              onClick={() => {
                setIsEditing(true);
                setNewAboutData(aboutData); // Populate the form with current data
              }}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Edit
            </button>
          </section>
        </>
      )}
    </div>
  );
}
