import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

interface PostInt {
  id: number;
  userid: number;
  name: string;
  created_at: string;
  imgs: string[];
  description: string;
}

const ListPost = () => {
  const [posts, setPosts] = useState<PostInt[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentPostImgs, setCurrentPostImgs] = useState<string[]>([]);

  const postFetch = async () => {
    try {
      const res = await axios.get(`http://localhost:2000/api/getPosts?page=1&limit=3`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPosts(res.data.posts);
    } catch (err: any) {
      console.log(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    postFetch();
  }, []);

  const openLightbox = (imgs: string[], index: number) => {
    setCurrentPostImgs(imgs);
    setCurrentImgIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-images">
            {post.imgs?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:2000/post/${img}`}
                alt={post.name}
                className="post-image"
                onClick={() => openLightbox(post.imgs, index)}
              />
            ))}
          </div>
          <h3 className="post-name">Name:{post.name}</h3>
        <h4 className="post-desc">description:{post.description}</h4>
        <h5 className='post-created'>posted:{post.created_at}</h5>
        </div>
      ))}

      {lightboxOpen && currentPostImgs.length > 0 && (
        <Lightbox
          mainSrc={`http://localhost:2000/post/${currentPostImgs[currentImgIndex]}`}
          nextSrc={`http://localhost:2000/post/${
            currentPostImgs[(currentImgIndex + 1) % currentPostImgs.length]
          }`}
          prevSrc={`http://localhost:2000/post/${
            currentPostImgs[(currentImgIndex + currentPostImgs.length - 1) % currentPostImgs.length]
          }`}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setCurrentImgIndex((currentImgIndex + currentPostImgs.length - 1) % currentPostImgs.length)
          }
          onMoveNextRequest={() =>
            setCurrentImgIndex((currentImgIndex + 1) % currentPostImgs.length)
          }
        />
      )}
    </div>
  );
};

export default ListPost;
