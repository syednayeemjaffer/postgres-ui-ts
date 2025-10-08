import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";

interface PostData {
  name: string;
  description: string;
  postImgs: File[];
}

const Post = () => {
  const [data, setData] = useState<PostData>({
    name: "",
    description: "",
    postImgs: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "postImgs" && files) {
      setData({ ...data, postImgs: Array.from(files) });
    } else {
      setData({ ...data, [name]: value });
    }
  };
  const navigate = useNavigate();

  const handleDescriptionChange = (value: string) => {
    setData({ ...data, description: value });
  };

  const stripHtmlTags = (html: string): string => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strip HTML from description
    const plainDescription = stripHtmlTags(data.description);

    if (!data.name || !plainDescription.trim() || data.postImgs.length === 0) {
      alert("Name, description and at least one image are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", plainDescription); // Use plain text
    data.postImgs.forEach((file) => {
      formData.append("postImgs", file);
    });

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:2000/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      alert("Post uploaded successfully");
      console.log(res.data);
      setData({ name: "", description: "", postImgs: [] });
      navigate('/')
    } catch (err: any) {
      alert(err.response?.data?.message || "Server error");
      console.error(err);
    }
  };

  return (
    <div className="post-container">
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Post Name"
          value={data.name}
          onChange={handleInputChange}
        />
        <ReactQuill
          theme="snow"
          value={data.description}
          onChange={handleDescriptionChange}
          placeholder="Write your description..."
        />
        <input
          type="file"
          name="postImgs"
          multiple
          accept="image/*"
          onChange={handleInputChange}
        />
        <button type="submit">Upload Post</button>
      </form>
    </div>
  );
};

export default Post;