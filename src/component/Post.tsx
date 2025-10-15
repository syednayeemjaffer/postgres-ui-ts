import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";

interface PostData {
  name: string;
  description: string;
  postImgs: File[];
}

interface ErrorInput {
  name?: string;
  description?: string;
  postImgs?: string;
}

const Post = () => {
  const [data, setData] = useState<PostData>({
    name: "",
    description: "",
    postImgs: [],
  });
  const [errorPop, setErrorPop] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [error, setError] = useState<ErrorInput>({});
  const navigate = useNavigate();

  const validateField = (name: string, value: any) => {
    let errorMsg = "";

    if (name === "name") {
      if (!value.trim()) errorMsg = "Name is required";
      else if (value.length > 100) errorMsg = "Name is too long (Max 100)";
    }

    if (name === "description") {
      const plainText = value.replace(/<[^>]+>/g, "").trim(); // strip html tags for validation
      if (!plainText) errorMsg = "Description is required";
      else if (plainText.length > 500) errorMsg = "Description is too long (Max 500)";
    }

    if (name === "postImgs") {
      if (value.length === 0) errorMsg = "At least one image is required";
    }

    setError((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "postImgs" && files) {
      const filesArray = Array.from(files);

      const invalidFile = filesArray.find(
        (file) => !["image/jpeg", "image/jpg", "image/png"].includes(file.type)
      );
      if (invalidFile) {
        setError((prev) => ({
          ...prev,
          postImgs: "Only JPEG, JPG, and PNG images are allowed",
        }));
        return;
      }

      setData({ ...data, postImgs: filesArray });
      validateField("postImgs", filesArray);
    } else {
      setData({ ...data, [name]: value });
      validateField(name, value);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setData({ ...data, description: value });
    validateField("description", value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    validateField("name", data.name);
    validateField("description", data.description);
    validateField("postImgs", data.postImgs);

    if (error.name || error.description || error.postImgs) return;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    data.postImgs.forEach((file) => formData.append("postImgs", file));

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:2000/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post is added successfully.")
      setData({ name: "", description: "", postImgs: [] });
      navigate("/");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message);
      setErrorPop(true);
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
        {error.name && <small className="text-danger">{error.name}</small>}

        <ReactQuill
          theme="snow"
          value={data.description}
          onChange={handleDescriptionChange}
          placeholder="Write your description..."
        />
        {error.description && (
          <small className="text-danger">{error.description}</small>
        )}

        <input
          type="file"
          name="postImgs"
          multiple
          accept="image/*"
          onChange={handleInputChange}
        />
        {error.postImgs && (
          <small className="text-danger">{error.postImgs}</small>
        )}

        <button type="submit">Upload Post</button>
      </form>

      {errorPop && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Error</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorPop(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{errorMsg}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setErrorPop(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
