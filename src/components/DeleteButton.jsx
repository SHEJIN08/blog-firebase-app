import { toast } from "react-toastify";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export default function DeleteButton({ id, onDeleteSuccess }) {
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      await deleteDoc(doc(db, "blogs", id));
      toast.error("Blog deleted.");
      onDeleteSuccess();
    }
  };

  return (
    <button onClick={handleDelete} className="danger">
      Delete
    </button>
  );
}
