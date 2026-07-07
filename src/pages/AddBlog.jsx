import { useState, useContext } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export function AddBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "blogs"), {
      title,
      content,
      imageUrl,
      authorEmail: user.email,
      authorId: user.uid,
    });
    toast.success("Blog published successfully");
    navigate("/");
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Blog</h2>
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
      <button type="submit">Save Blog</button>
    </form>
  );
}
