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

  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

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

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

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

      {currentBlogs.map((blog) => (
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
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
