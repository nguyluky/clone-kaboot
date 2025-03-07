import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import api_config from '../../../config/api_config';
import CauHoi from './CauHoi';
import './CanvaEdit.css';

export default function CanvaEdit() {
    const { id } = useParams();
    const [name, setName] = React.useState('');
    const [canva, setCanva] = React.useState(null);
    const [cau_hoi, setCauHoi] = React.useState(null);

    const nav = useNavigate();
    useEffect(() => {
        fetch(api_config.cau_hoi.getCauHoiByCanvaId + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (res) => {
                if (res.status == 404 || !res.ok) {
                    return;
                }
                const data = await res.json();
                setCauHoi(data);
            })
            .catch((err) => {
                // TODO: handle err
                console.log(err);
                alert('Error');
            });

        fetch(api_config.canva.getCanvaById + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(async (res) => {

                if (res.status == 404 || !res.ok) {
                    return;
                }

                const data = await res.json();
                setCanva(data);
                setName(data.tieu_de);
            })
            .catch((err) => {
                console.log(err);
                alert('Error');
            });


    }, []);

    const handleAddCauHoi = () => {
        fetch(api_config.cau_hoi.createCauHoi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                canva_id: id,
                noi_dung: '',
                dinh_dang: 'markdown',
                thoi_gian: 30
            })
        })
            .then((res) => res.json())
            .then((data) => {
                setCauHoi([...cau_hoi || [], {
                    lua_chon: [],
                    cau_hoi_id: data.insertId,
                    canva_id: id,
                    noi_dung: '',
                    dinh_dang: 'markdown',
                    thoi_gian: 30
                }]);
            }).catch(error => {
                console.log(error);
                alert('Add fail');
            });
    };

    const handleSave = () => {
        fetch(api_config.canva.updateCanva + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tieu_de: name,
            })
        })
            .then((res) => {
                if (res.status == 404 || !res.ok) {
                    return;
                }
                // alert('Save success');
            })
            .catch((err) => {
                console.log(err);
                alert('Error');
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
