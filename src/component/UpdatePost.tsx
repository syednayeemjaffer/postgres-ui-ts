import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Post {
  id: number;
  userid: number;
  name: string;
  imgs: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

interface UpdateData {
  name: string;
  description: string;
  newImgs: File[];
  deleteImgs: string[];
}

interface Popup {
  show: boolean;
  message: string;
  type: "success" | "error";
}

const UpdatePost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [popup, setPopup] = useState<Popup>({ show: false, message: "", type: "success" });

  const [data, setData] = useState<UpdateData>({
    name: "",
    description: "",
    newImgs: [],
    deleteImgs: [],
  });

  const validate = () => {
    if (!data.name.trim()) {
      setPopup({ show: true, message: "Post name is required", type: "error" });
      return false;
    }
    if (data.name.length > 100) {
      setPopup({ show: true, message: "Post name must be less than 100 characters", type: "error" });
      return false;
    }
    if (!data.description.trim()) {
      setPopup({ show: true, message: "Description is required", type: "error" });
      return false;
    }
    if (data.description.length > 500) {
      setPopup({ show: true, message: "Description must be less than 500 characters", type: "error" });
      return false;
    }
    if (data.newImgs.length > 0) {
      for (let file of data.newImgs) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          setPopup({ show: true, message: "Image must be jpeg, jpg, or png", type: "error" });
          return false;
        }
        if (file.size > 3 * 1024 * 1024) {
          setPopup({ show: true, message: "Image must be less than 3MB", type: "error" });
          return false;
        }
      }
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files, value } = e.target;
    if (name === "newImgs" && files) {
      setData({ ...data, newImgs: Array.from(files) });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleDeleteToggle = (imgName: string) => {
    setData((prev) => ({
      ...prev,
      deleteImgs: prev.deleteImgs.includes(imgName)
        ? prev.deleteImgs.filter((i) => i !== imgName)
        : [...prev.deleteImgs, imgName],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (!id) return;
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      data.deleteImgs.forEach((img) => formData.append("deleteImg", img));
      data.newImgs.forEach((file) => formData.append("postImgs", file));

      await axios.put(`http://localhost:2000/api/updatePost/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setPopup({ show: true, message: "Post updated successfully!", type: "success" });
    } catch (err: any) {
      console.error("Error updating post:", err.message);
      setPopup({ show: true, message: err.response?.data?.message || "Error updating post", type: "error" });
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:2000/api/getPosts/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const fetchedPost = res.data.post;
        setPost(fetchedPost);
        setData({
          name: fetchedPost.name,
          description: fetchedPost.description,
          newImgs: [],
          deleteImgs: [],
        });
      } catch (err: any) {
        console.error("Error fetching post:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!post) return <p className="not-found">Post not found.</p>;

  return (
    <div className="updatePostContainer">
      <div className="postUpdate-carousel">
        <div id="carouselExample" className="carousel slide">
          <div className="carousel-inner">
            {post.imgs.map((img, index) => {
              const isMarked = data.deleteImgs.includes(img);
              return (
                <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <div className="carousel-img-wrapper">
                    <img
                      src={`http://localhost:2000/post/${img}`}
                      className={`d-block w-100 ${isMarked ? "img-deleted" : ""}`}
                      alt={`Post image ${index + 1}`}
                    />
                    <button
                      type="button"
                      className={`delete-btn-upt ${isMarked ? "marked" : ""}`}
                      onClick={() => handleDeleteToggle(img)}
                    >
                      {isMarked ? "Undo" : "Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="updateForm">
        <form onSubmit={handleSubmit}>
          <label>Post Name</label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            className="form-control"
          />

          <label>Description</label>
          <ReactQuill
            theme="snow"
            value={data.description}
            onChange={(value) => setData({ ...data, description: value })}
            className="quill-editor"
          />

          <label>Add New Images</label>
          <input
            type="file"
            name="newImgs"
            multiple
            className="form-control"
            onChange={handleChange}
          />

          <button type="submit" disabled={updating} className="update-btn">
            {updating ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>

      {popup.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{popup.type === "success" ? "Success" : "Error"}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setPopup({ ...popup, show: false });
                  if (popup.type === "success") navigate("/");
                }}></button>
              </div>
              <div className="modal-body">
                <p>{popup.message}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setPopup({ ...popup, show: false });
                    if (popup.type === "success") navigate("/");
                  }}
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

export default UpdatePost;
