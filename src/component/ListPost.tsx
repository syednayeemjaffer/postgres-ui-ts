import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const limit = 3; // posts per fetch
  const navigate = useNavigate();

  // -------------------------
  // Fetch Posts
  // -------------------------
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // -------------------------
  // Delete Post
  // -------------------------
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

  // -------------------------
  // Navigate to Update
  // -------------------------
  const navigateToUpdate = (id: number) => {
    navigate(`/postUpdate/${id}`);
  };

  // -------------------------
  // Open Lightbox
  // -------------------------
  const openLightbox = (imgs: string[], index: number = 0) => {
    setCurrentImages(imgs.map((img) => `http://localhost:2000/post/${img}`));
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  // -------------------------
  // Render
  // -------------------------
  return (
    <div className="list-container">
      <h1 className="list-title">All Posts</h1>

      <div className="post-list">
        {posts.map((item) => (
          <div key={item.id} className="postCard">
            {/* Top Section: Profile + User Info */}
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

            {/* Main Post Section: Image + Details */}
            <div className="postCard-main">
              <div
                className="post-image-wrapper"
                onClick={() => openLightbox(item.imgs)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={`http://localhost:2000/post/${item.imgs[0]}`}
                  alt="Post"
                  className="post-img"
                />
                {item.imgs.length > 1 && (
                  <div className="overlay">
                    <h1>{item.imgs.length} +</h1>
                  </div>
                )}
              </div>

              <div className="post-details">
                <h4>
                  <strong>Post Name:</strong> {item.name}
                </h4>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
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

      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={currentImages.map((src) => ({ src }))}
          index={currentIndex}
        />
      )}
    </div>
  );
};

export default ListPost;


// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Lightbox from "yet-another-react-lightbox";
// import "yet-another-react-lightbox/styles.css";

// interface postInt {
//   id: number;
//   userid: number;
//   firstname: string;
//   lastname: string;
//   email: string;
//   name: string;
//   imgs: string[];
//   profile: string;
//   description: string;
//   created_at: string;
// }

// const ListPost = () => {
//   const [posts, setPosts] = useState<postInt[]>([]);
//   const [page, setPage] = useState<number>(1);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [loading, setLoading] = useState<boolean>(false);

//   const [lightboxOpen, setLightboxOpen] = useState(false);
//   const [currentImages, setCurrentImages] = useState<string[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const limit = 3; // posts per fetch
//   const navigate = useNavigate();

//   // Fetch posts
//   const fetchPosts = async () => {
//     if (!hasMore) return;
//     setLoading(true);

//     try {
//       const res = await axios.get(
//         `http://localhost:2000/api/getPosts?page=${page}&limit=${limit}`,
//         {
//           headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//         }
//       );

//       const fetchedPosts = res.data.posts;

//       setPosts((prev) => [...prev, ...fetchedPosts]);

//       if (fetchedPosts.length < limit) setHasMore(false);
//     } catch (err: any) {
//       console.error("Error fetching posts:", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Scroll listener
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const windowHeight = window.innerHeight;
//       const fullHeight = document.body.scrollHeight;

//       // If near bottom, load next page
//       if (scrollTop + windowHeight >= fullHeight - 50 && hasMore && !loading) {
//         setPage((prev) => prev + 1);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [hasMore, loading]);

//   // Fetch posts when page changes
//   useEffect(() => {
//     fetchPosts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page]);

//   // Delete post
//   const deletePost = async (id: number) => {
//     if (!window.confirm("Are you sure you want to delete this post?")) return;
//     try {
//       await axios.delete(`http://localhost:2000/api/deletepost/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });
//       alert("Post deleted");
//       setPosts((prev) => prev.filter((p) => p.id !== id));
//     } catch (err: any) {
//       console.error("Error deleting post:", err.message);
//     }
//   };

//   // Open lightbox
//   const openLightbox = (imgs: string[], index: number = 0) => {
//     setCurrentImages(imgs.map((img) => `http://localhost:2000/post/${img}`));
//     setCurrentIndex(index);
//     setLightboxOpen(true);
//   };

//   return (
//     <div className="list-container">
//       <h1 className="list-title">All Posts</h1>

//       <div className="post-list">
//         {posts.map((item) => (
//           <div key={item.id} className="postCard">
//             <div className="postCard-top">
//               <img
//                 src={`http://localhost:2000/profile/${item.profile}`}
//                 alt={`${item.firstname} ${item.lastname} profile`}
//                 className="profile-img"
//               />
//               <div className="user-info">
//                 <p>
//                   <strong>Name:</strong> {item.firstname} {item.lastname}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {item.email}
//                 </p>
//               </div>
//             </div>

//             <div className="postCard-main">
//               <div
//                 className="post-image-wrapper"
//                 onClick={() => openLightbox(item.imgs)}
//                 style={{ cursor: "pointer" }}
//               >
//                 <img
//                   src={`http://localhost:2000/post/${item.imgs[0]}`}
//                   alt="Post"
//                   className="post-img"
//                 />
//                 {item.imgs.length > 1 && (
//                   <div className="overlay">
//                     <h1>{item.imgs.length} +</h1>
//                   </div>
//                 )}
//               </div>

//               <div className="post-details">
//                 <h4>
//                   <strong>Post Name:</strong> {item.name}
//                 </h4>
//                 <p>
//                   <strong>Description:</strong> {item.description}
//                 </p>
//               </div>

//               <div className="post-deleteUpdate">
//                 <button
//                   className="delete-btn"
//                   onClick={() => deletePost(item.id)}
//                 >
//                   Delete
//                 </button>
//                 <button
//                   className="update-btn"
//                   onClick={() => navigate(`/postUpdate/${item.id}`)}
//                 >
//                   Update
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
//       {!hasMore && <p style={{ textAlign: "center" }}>No more posts</p>}

//       {lightboxOpen && (
//         <Lightbox
//           open={lightboxOpen}
//           close={() => setLightboxOpen(false)}
//           slides={currentImages.map((src) => ({ src }))}
//           index={currentIndex}
//         />
//       )}
//     </div>
//   );
// };

// export default ListPost;
