import React, { useEffect, useState } from "react";
import api_config from "../../../config/api_config";
import { useNavigate } from "react-router";
import './ListAllCanva.css';

function randomCodeJoin() {
    let code = '';
    const char = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < 10; i++) {
        code += char.charAt(Math.floor(Math.random() * char.length));
    }
    return code;
}

export default function ListAllCanva() {
    const [canva, setCanva] = useState([]);
    const [loading, setLoading] = useState(true);

    const nav = useNavigate();

    useEffect(() => {
        fetch(api_config.canva.getAllCanva, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(async (res) => {
            if (res.status === 200) {
                const data = await res.json();
                setCanva(data);
                setLoading(false);
            }
            else {
                alert('Login failed');
            }
        })
    }, [])

    const handleDeleteCanva = (canva_id) => {
        fetch(api_config.canva.deleteCanva + canva_id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(async (res) => {
            if (res.ok) {
                const newCanva = canva.filter(item => item.canva_id !== canva_id);
                setCanva(newCanva);
            } else {
                alert('Delete failed');
            }
        }).catch(error => {
            console.error('Error deleting canva:', error);
            alert('Error deleting canva');
        });
    }

    const handleAddCanva = () => {
        fetch(api_config.canva.addCanva, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tieu_de: 'New canva',
            })
        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                setCanva([...canva, data]);
            } else {
                alert('Add failed');
            }
        }).catch(error => {
            console.error('Error adding canva:', error);
            alert('Error adding canva');
        });
    }

    const handleCreateSession = (canva_id) => {
        fetch(api_config.session.addSession, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: "New session", 
                code_join: randomCodeJoin(), 
                canva_id, 
                thoi_gian_bat_dau: null, 
                trang_thai: 'doi'
            })

        }).then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                nav('/host/' + data.insertId);
            }
            else {
                alert('Create session failed');
            }
        })
    }

    return (
        <div className="list-all-canva">
            <h1>List all canva</h1>
            <div className="list-cart">
                {loading ? <h2>loading</h2>: (
                    <> {

                    canva.map((item) => (
                        <div className="cart" onClick={() => nav('/admin/canva/' + item.canva_id)}>
                            <div className="cart-thumbnail">
                                
                            </div>
                            <div className="cart-body">
                                <h3>{item.tieu_de}</h3>
                                <p>{item.so_cau_hoi} questions</p>
                                <p>{item.so_session} sessions</p>
                            </div>
                            <div className="cart-action">
                                <button className="btn" onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    nav('/admin/session/' + item.canva_id)
                                }}>
                                    xem kết quả
                                </button>
                                <button className="btn" onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleCreateSession(item.canva_id)
                                }}>Tạo bài thi</button>
                                <button className="btn btn-danger" onClick={e => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleDeleteCanva(item.canva_id)
                                }}>Delete</button>
                            </div>
                        </div>
                    ))

                    }
                    <div className="cart cart-add" onClick={handleAddCanva}>
                        <div className="cart-body" >
                            <h3>Thêm mới</h3>
                        </div>
                    </div>
                    </>
                )}
            </div>
        </div>
    );
}