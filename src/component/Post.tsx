import React, { useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

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
  const [errorPop, setErrorPop] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "postImgs" && files) {
      setData({ ...data, postImgs: Array.from(files) });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleDescriptionChange = (value: string) => {
    setData({ ...data, description: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.name || !data.description.trim() || data.postImgs.length === 0) {
      setError('Name, description and at least one image are required');
      setErrorPop(true);
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description); 
    data.postImgs.forEach((file) => {
      formData.append("postImgs", file);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:2000/api/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });
      alert("Post uploaded successfully");
      setData({ name: "", description: "", postImgs: [] });
      navigate("/");
    } catch (err: any) {
      setError(err.message);
      setErrorPop(true);
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

      {errorPop ? (
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
                <p>{error}</p>
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
      ) : (
        <></>
      )}
    </div>
  );
};

export default Post;
