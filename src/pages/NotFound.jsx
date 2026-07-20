import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1 className="notfound-code">404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn't exist .</p>
      
      <Link to="/">
        <button className="notfound-btn">Back to Home</button>
      </Link>
    </div>
  );
}