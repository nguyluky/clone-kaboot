import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import CauHoi from './CauHoi';
import api from '../../../services/api.js'
import './CanvaEdit.css';
import { toast } from 'react-toastify';

export default function CanvaEdit() {
    const { id } = useParams();
    const [name, setName] = React.useState('');
    const [canva, setCanva] = React.useState(null);
    const [cau_hoi, setCauHoi] = React.useState(null);

    const nav = useNavigate();
    useEffect(() => {
        api.cau_hoi.getCauHoiByCanvaId(id).then(data => {
            setCauHoi(data.data);
        }).catch(error => {
            console.error('Error fetching cau hoi:', error);
            toast.error('Error fetching cau hoi');
        });

        api.canva.getCanvaById(id).then(data => setCanva(data.data))
            .catch(error => {
                toast.error('Error fetching canva');
                console.error('Error fetching canva:', error);
            });

    }, []);

    const handleAddCauHoi = () => {
        api.cau_hoi.createCauHoi({
            canva_id: id,
            noi_dung: '',
            dinh_dang: 'markdown',
            thoi_gian: 30
        }).then(data => {
            setCauHoi([...cau_hoi || [], {
                lua_chon: [],
                cau_hoi_id: data.data.insertId,
                canva_id: id,
                noi_dung: '',
                dinh_dang: 'markdown',
                thoi_gian: 30
            }]);
        }).catch(error => {
            console.error('Error adding cau hoi:', error);
            toast.error('Error adding cau hoi');
        });
    };

    const handleSave = () => {
        api.canva.updateCanva({
            tieu_de: name,
        }).catch(error => {
            console.error('Error updating canva:', error);
            toast.error('Error updating canva');
        });
    };

    return (
        <div className='CanvaEdit'>
            <h1 className='CanvaEdit-title'><button onClick={() =>
                nav('/admin/')
            }>back</button> <input value={name} onChange={e => setName(e.target.value)} onBlur={handleSave}></input></h1>
            <div className='CanvaEdit-info'>
            </div>

            <div className='CanvaEdit-cau-hoi'>
                {cau_hoi?.map((item, index) => (
                    <CauHoi key={index} index={index} item={item} onDelete={() => {
                        console.log('delete');
                        try {
                            setCauHoi([...cau_hoi?.filter(e => e.cau_hoi_id !== item.cau_hoi_id)]);
                        } catch (error) {
                            console.error(error);
                        }
                    }} />
                ))}
                <div className='CanvaEdit-cau-hoi-add'>
                    <button onClick={handleAddCauHoi}>Thêm câu hỏi</button>
                </div>
            </div>

        </div>
    );
}
