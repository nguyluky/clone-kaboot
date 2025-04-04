import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import './CanvasList.css';
// import api from '../../services/fakeApi.js';
import Loading from '../common/Loading/index.js';
import Error from '../common/Error/index.js';
import api from '../../services/apiService.js';
import { formatDateTime } from '../../help.js';


export default function CanvasList() {
    const navigate = useNavigate();
    /** @type {useStateReturnType<import('../../services/apiService.js').Canvas[]>} */
    const [canvases, setCanvases] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const fileInputRef = React.useRef(null);

    const handleCreateCanvas = () => {
        navigate('/canva/new');
    };

    const handleUploadXls = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Handle the uploaded file here
            console.log('File uploaded:', file);
            // Reset the input so the same file can be uploaded again
            event.target.value = '';
            
            // Implement actual file upload logic here
            // For example:
            // const formData = new FormData();
            // formData.append('xlsFile', file);
            // api.canvas.uploadXlsFile(formData).then(...);
        }
    };

    const handleEditCanvas = (id) => {
        navigate(`/canva/edit/${id}`);
    };

    const handleViewCanvas = (id) => {
        navigate(`/admin/canva/${id}`);
    };

    const loadData = () => {
        setIsLoading(true);
        api.canvas.getAllCanvas().then((e) => setCanvases(e)).catch(setError).finally(() => setIsLoading(false));
    }

    useEffect(() => {
        loadData();
    }, []);

    if (isLoading) return Loading({ message: 'Loading canvases', subMessage: 'Fetching your canvases' });
    if (error) return Error({ title: 'Canvas data unavailable', message: String(error), onRetry: loadData, onBack: () => navigate('/') });

    return (
        <div className="canvases-container">
            <div className="canvases-header">
                <h2>My Canvases</h2>
                <div className="header-buttons">
                    <button className="upload-xls-btn" onClick={handleUploadXls}>
                        <i className="fas fa-file-upload"></i> Upload XLS
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                        accept=".xls,.xlsx" 
                    />
                    <button className="create-canvas-btn" onClick={handleCreateCanvas}>
                        <i className="fas fa-plus"></i> Create New Canvas
                    </button>
                </div>
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
                {canvases.map(canvas => (
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
                            <span className="last-modified">Last modified: {formatDateTime(
                                'MMM DD, YYYY • hh:mm A'
                                , new Date(canvas.lastModified))}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
