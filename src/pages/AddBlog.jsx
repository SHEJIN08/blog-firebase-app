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
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const validateForm = () => {
    let formErrors = {};
    if (!title.trim()) formErrors.title = "Title is required";
    if (!content.trim()) formErrors.content = "Content cannot be empty";

    if (imageUrl && !imageUrl.match(/^https?:\/\/.+/)) {
      formErrors.imageUrl =
        "Please enter a valid URL starting with http:// or https://";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warning("Please correct the errors before saving.");
      return;
    }

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
    <form onSubmit={handleSubmit} noValidate>
      <h2>Add Blog</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      {errors.title && <span className="error-text">{errors.title}</span>}
      <br />
      <br />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      {errors.content && <span className="error-text">{errors.content}</span>}
      <br />
      <br />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL (Optional)"
      />
      {errors.imageUrl && <span className="error-text">{errors.imageUrl}</span>}
      <button type="submit">Save Blog</button>
    </form>
  );
}
