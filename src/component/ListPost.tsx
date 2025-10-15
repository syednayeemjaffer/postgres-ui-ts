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
    fetchPosts();
  }, [page]);

  const deletePost = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`http://localhost:2000/api/deletepost/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("Post deleted");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error("Error deleting post:", err.message);
    }
  };

  const navigateToUpdate = (id: number) => {
    navigate(`/postUpdate/${id}`);
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
              {/* ✅ Bootstrap Carousel */}
              <div id={`carousel-${item.id}`} className="carousel slide">
                <div className="carousel-inner">
                  {item.imgs.map((img, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <img
                        src={`http://localhost:2000/post/${img}`}
                        className="d-block w-100"
                        alt="Post"
                      />
                    </div>
                  ))}
                </div>

                {item.imgs.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carousel-${item.id}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carousel-${item.id}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>

              <div className="post-details">
                <h4>
                  <strong>Post Name:</strong> {item.name}
                </h4>
              </div>
              <div
                className="post-description-wrapper"
                style={{ textAlign: "left" }}
              >
                <strong>Description:</strong>
                <div
                  className="post-description"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                  style={{ textAlign: "left", marginTop: "0.25rem" }}
                />
              </div>

              <div className="post-deleteUpdate">
                <button
                  className="delete-btn"
                  onClick={() => deletePost(item.id)}
                >
                  Delete
                </button>
                <button
                  className="update-btn"
                  onClick={() => navigateToUpdate(item.id)}
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
    </div>
  );
};

export default ListPost;
