import { useState, useEffect, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import DeleteButton from "../components/DeleteButton";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export function BlogList() {
  const [blogs, setBlogs] = useState([]);

  const { user } = useContext(AuthContext);

  const fetchBlogs = async () => {
    const snapshot = await getDocs(collection(db, "blogs"));
    const blogData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBlogs(blogData);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchBlogs();
    };

    loadData();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success("successfully logged out");
  };

  return (
    <div>
      <div className="header-bar">
        <h2>All Blogs</h2>
        <div className="button-group">
          <Link to="/add">
            <button>Add New Blog</button>
          </Link>

          {user && user.uid ? (
            <button onClick={handleLogout} className="danger">
              Logout
            </button>
          ) : (
            <Link to={"/login"}>
              <button className="login"> LogIn </button>
            </Link>
          )}
        </div>
      </div>

      {blogs.map((blog) => (
        <div key={blog.id} className="blog-card blog-card-layout">
          {blog.imageUrl && (
            <div className="blog-image-container">
              <img
                src={blog.imageUrl}
                alt="Blog Cover"
                className="blog-image"
              />
            </div>
          )}

          <div className="blog-content">
            <h3>{blog.title}</h3>
            <p>{blog.content}</p>

            <div className="blog-footer">
              <div className="button-group">
                {user && user.uid === blog.authorId && (
                  <>
                    <Link to={`/edit/${blog.id}`}>
                      <button>Edit</button>
                    </Link>
                    <DeleteButton id={blog.id} onDeleteSuccess={fetchBlogs} />
                  </>
                )}
              </div>

              <p className="author-email">{blog.authorEmail || "Anonymous"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
