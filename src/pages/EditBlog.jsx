import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function EditBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.warning("Please correct the errors before saving.");
      return;
    }

    updateDoc(doc(db, "blogs", id), { title, content, imageUrl });
    toast.info("Blog updated");
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Edit Blog</h2>
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
      <button type="submit">Update Blog</button>
    </form>
  );
}
