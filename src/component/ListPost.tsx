import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface postInt {
  id: number;
  userid: number;
  firstname: string;
  lastname: string;
  email: string;
  name: string;
  imgs: string[];
  profile: string;
  description: string;
  created_at: string;
}

const ListPost = () => {
  const [posts, setPosts] = useState<postInt[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const limit = 3;
  const navigate = useNavigate();

  const fetchPosts = async () => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `http://localhost:2000/api/getPosts?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const fetchedPosts = res.data.posts;
      setPosts((prev) => [...prev, ...fetchedPosts]);
      if (fetchedPosts.length < limit) setHasMore(false);
    } catch (err: any) {
      console.error("Error fetching posts:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;
      if (scrollTop + windowHeight >= fullHeight - 50 && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const confirmDelete = (id: number) => {
    setSelectedPostId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPostId) return;

    try {
      await axios.delete(
        `http://localhost:2000/api/deletepost/${selectedPostId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPosts((prev) => prev.filter((p) => p.id !== selectedPostId));
    } catch (err: any) {
      console.error("Error deleting post:", err.message);
    } finally {
      setShowDeleteModal(false);
      setSelectedPostId(null);
    }
  };

  return (
    <div className="list-container">
      <h1 className="list-title">All Posts</h1>

      <div className="post-list">
        {posts.map((item) => (
          <div key={item.id} className="postCard">
            <div className="postCard-top">
              <img
                src={`http://localhost:2000/profile/${item.profile}`}
                alt={`${item.firstname} ${item.lastname} profile`}
                className="profile-img"
              />
              <div className="user-info">
                <p>
                  <strong>Name:</strong> {item.firstname} {item.lastname}
                </p>
                <p>
                  <strong>Email:</strong> {item.email}
                </p>
              </div>
            </div>

            <div className="postCard-main">
              {item.imgs.length > 0 && (
                <div
                  id={`carousel${item.id}`}
                  className="carousel slide post-image-wrapper"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-indicators">
                    {item.imgs.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        data-bs-target={`#carousel${item.id}`}
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : undefined}
                        aria-label={`Slide ${index + 1}`}
                      ></button>
                    ))}
                  </div>
                  <div className="carousel-inner">
                    {item.imgs.map((img, index) => (
                      <div
                        key={index}
                        className={`carousel-item ${
                          index === 0 ? "active" : ""
                        }`}
                      >
                        <img
                          src={`http://localhost:2000/post/${img}`}
                          className="d-block w-100 post-img"
                          alt={`Slide ${index + 1}`}
                          style={{ height: "300px", objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                  {item.imgs.length > 1 && (
                    <>
                      <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target={`#carousel${item.id}`}
                        data-bs-slide="prev"
                      >
                        <span
                          className="carousel-control-prev-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target={`#carousel${item.id}`}
                        data-bs-slide="next"
                      >
                        <span
                          className="carousel-control-next-icon"
                          aria-hidden="true"
                        ></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </>
                  )}
                </div>
              )}

              <div className="post-details">
                <h4>
                  <strong>Post Name:</strong> {item.name}
                </h4>
                <p>
                  <strong>Description:</strong>{" "}
                  <span
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </p>
              </div>

              <div className="post-deleteUpdate">
                <button
                  className="delete-btn"
                  onClick={() => confirmDelete(item.id)}
                >
                  Delete
                </button>
                <button
                  className="update-btn"
                  onClick={() => navigate(`/postUpdate/${item.id}`)}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {!hasMore && <p style={{ textAlign: "center" }}>No more posts</p>}

      {showDeleteModal && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this post?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPost;
