import React, { useEffect } from 'react';
import MDEditor, {commands} from '@uiw/react-md-editor';
import { useNavigate, useParams } from 'react-router';
import api_config from '../../../config/api_config';
import './CanvaEdit.css';

function CauHoi({ index, item, onChange , onDelete}) {


    const [noi_dung, setNoiDung] = React.useState(item.noi_dung);
    const [lua_chon, setLuaChon] = React.useState(item.lua_chon);
    const [thoi_gian, setThoiGian] = React.useState(item.thoi_gian);

    const handleSave = () => {
        let prom = []
        const updateCanva = fetch(api_config.cau_hoi.updateCauHoi + item.cau_hoi_id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                canva_id: item.canva_id, 
                noi_dung, 
                dinh_dang: item.dinh_dang, 
                thoi_gian: thoi_gian
            })
        })

        prom.push(updateCanva);

        lua_chon?.forEach((e) => {
            const updataLuaChon = fetch(api_config.cau_hoi.updateLuaChon + e.lua_chon_id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(e)
            })
            prom.push(updataLuaChon);
        })

        Promise.all(prom).then(() => {
            alert('Save success');
        }).catch(() => {
            alert('Save fail');
        })
    }

    const handleDelete = () => {
        fetch(api_config.cau_hoi.deleteCauHoi + item.cau_hoi_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((data) => {
                onDelete();
            }).catch(error => {
                console.error(error);
                alert('Delete fail');
            })
    }

    const handleAddLuaChon = () => {
        fetch(api_config.cau_hoi.addLuaChon, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cau_hoi_id: item.cau_hoi_id,
                noi_dung: '',
                dung: false
            })
        })
            .then((res) => res.json())
            .then((data) => {
                setLuaChon([...lua_chon || [], {
                    lua_chon_id: data.insertId,
                    noi_dung: '',
                    dung: false
                }]);
            }).catch(error => {
                console.error(error);
                alert('Add fail');
            })
        }
    
    const handleDeleteLuaChon = (lua_chon_id) => {
        fetch(api_config.cau_hoi.updateLuaChon + lua_chon_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((data) => {
                setLuaChon([...lua_chon?.filter(e => e.lua_chon_id !== lua_chon_id)]);
            }).catch(error => {
                console.error(error);
                alert('Delete fail');
            })
    }


    return <div className='CanvaEdit-cau-hoi-item'>
        <div className='CanvaEdit-cau-hoi-item-info'>
            <p className='CanvaEdit-cau-hoi-item-info-title'>
                <h3>
                    Câu hỏi {index + 1}:
                </h3>
                <p>
                <input className='CanvaEdit-cau-hoi-tiem-thoi-gian' value={thoi_gian} onChange={(e) => setThoiGian(e.target.value)}></input>
                S
                </p>
            </p>
            <span>
                <button className='btn btn-danger' onClick={handleDelete}>delete</button>
                <button className='btn' onClick={handleSave}>Save</button>
            </span>
        </div>
        <div className='CanvaEdit-cau-hoi-item-noi-dung'>
            <MDEditor value={noi_dung} onChange={setNoiDung} preview="edit" commands={[ ]} />
        </div>
        <div className='CanvaEdit-cau-hoi-item-lua-chon'>
            {lua_chon?.map((item, index) => (
                <div key={index} className={'CanvaEdit-cau-hoi-item-lua-chon-item'}>
                    <input type='checkbox' checked={item.dung} onChange={e => {
                        const newLuaChon = [...lua_chon];
                        newLuaChon[index].dung = e.target.checked;
                        setLuaChon(newLuaChon);
                    }}/>
                    <button className='btn btn-danger' onClick={() => handleDeleteLuaChon(item.lua_chon_id)}>delete</button>
                    <p>Lựa chọn {index + 1}</p>
                    <MDEditor value={item.noi_dung} onChange={(e) => {
                        const newLuaChon = [...lua_chon];
                        newLuaChon[index].noi_dung = e;
                        setLuaChon(newLuaChon);
                    }} preview="edit" commands={[ ]} height={'auto'} />
                </div>
            ))}
            <div className='CanvaEdit-cau-hoi-item-lua-chon-add' onClick={handleAddLuaChon}>
                Thêm lựa chọn
            </div>
        </div>
    </div>
}

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


    }, [])

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
                console.log(error)
                alert('Add fail');
            })
    }

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
    }

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
                    }}/>
                ))}
                <div className='CanvaEdit-cau-hoi-add'>
                    <button onClick={handleAddCauHoi}>Thêm câu hỏi</button>
                </div>
            </div>

        </div>
    );
}
