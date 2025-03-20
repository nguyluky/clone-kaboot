import React from 'react';
import { useNavigate } from 'react-router';
import './CanvasList.css';

// Sample data for demonstration
const sampleCanvases = [
  { id: 1, title: 'Marketing Quiz', category: 'Business', questions: 12, lastModified: '2023-08-15' },
  { id: 2, title: 'JavaScript Fundamentals', category: 'Programming', questions: 20, lastModified: '2023-08-10' },
  { id: 3, title: 'World Geography', category: 'Education', questions: 15, lastModified: '2023-08-05' },
  { id: 4, title: 'Pop Culture 2023', category: 'Entertainment', questions: 18, lastModified: '2023-07-28' },
  { id: 5, title: 'Science Quiz', category: 'Education', questions: 25, lastModified: '2023-07-20' },
  { id: 6, title: 'History Timeline', category: 'Education', questions: 22, lastModified: '2023-07-15' },
];

export default function CanvasList() {
  const navigate = useNavigate();

  const handleCreateCanvas = () => {
    navigate('/canva/new');
  };

  const handleEditCanvas = (id) => {
    navigate(`/canva/edit/${id}`);
  };

  const handleViewCanvas = (id) => {
    navigate(`/admin/canva/${id}`);
  };

  return (
    <div className="canvases-container">
      <div className="canvases-header">
        <h2>My Canvases</h2>
        <button className="create-canvas-btn" onClick={handleCreateCanvas}>
          <i className="fas fa-plus"></i> Create New Canvas
        </button>
      </div>
      
      <div className="canvas-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input type="text" placeholder="Search canvases..." />
        </div>
        <select className="filter-dropdown">
          <option>All Categories</option>
          <option>Business</option>
          <option>Education</option>
          <option>Entertainment</option>
          <option>Programming</option>
        </select>
        <select className="sort-dropdown">
          <option>Latest Modified</option>
          <option>Oldest Modified</option>
          <option>Name A-Z</option>
          <option>Name Z-A</option>
        </select>
      </div>
      
      <div className="canvas-grid">
        {sampleCanvases.map(canvas => (
          <div className="canvas-card" key={canvas.id} onClick={() => handleViewCanvas(canvas.id)}>
            <div className="canvas-card-header">
              <span className="canvas-category">{canvas.category}</span>
              <div className="canvas-actions">
                <button className="action-btn" onClick={(e) => {
                  e.stopPropagation();
                  handleEditCanvas(canvas.id);
                }}>
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn" onClick={(e) => e.stopPropagation()}>
                  <i className="fas fa-trash"></i>
                </button>
                <button className="action-btn" onClick={(e) => e.stopPropagation()}>
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>
            <div className="canvas-card-body">
              <h3 className="canvas-title">{canvas.title}</h3>
              <p className="canvas-info">{canvas.questions} questions</p>
            </div>
            <div className="canvas-card-footer">
              <span className="last-modified">Last modified: {canvas.lastModified}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
