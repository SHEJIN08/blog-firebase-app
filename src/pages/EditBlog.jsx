import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function EditBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getDoc(doc(db, "blogs", id)).then((val) => {
      if (val.exists()) {
        setTitle(val.data().title);
        setContent(val.data().content);
        setImageUrl(val.data().imageUrl || "");
      }
    });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDoc(doc(db, "blogs", id), { title, content, imageUrl });
    toast.info("Blog updated");
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Blog</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <br />
      <br />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <br />
      <br />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (Optional)"
      />
      <button type="submit">Update Blog</button>
    </form>
  );
}
