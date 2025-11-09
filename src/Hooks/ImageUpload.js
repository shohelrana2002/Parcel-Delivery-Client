import toast from "react-hot-toast";

const ImageUpload = async (imageFile) => {
  if (!imageFile) {
    // toast.error("No image selected!");
    return null;
  }
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${
        import.meta.env.VITE_IMAGE_UPLOAD_KEY
      }`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data;
  } catch (error) {
    toast.error(error.message || "Something went wrong while uploading");
  }
};

export default ImageUpload;
