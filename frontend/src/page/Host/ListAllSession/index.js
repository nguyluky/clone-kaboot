
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import api from '../../../services/api.js';

export default function ListAllSession() {
    const { canva_id } = useParams();
    const [data, setdata] = useState([]);
    const nav = useNavigate();

    const getSessions = async () => {
        try {
            const response = await api.session.getSessionsByCanvaId(canva_id);
            setdata(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getSessions();
    }, [])

    return <div>

        <h1>List all session</h1>
        <table>
            <thead>
                <tr>
                    <th>Session ID</th>
                    <th>Title</th>
                    <th>Code Join</th>
                    <th>Canva ID</th>
                    <th>Start Time</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => {
                    return <tr key={index}>
                        <td>{item.session_id}</td>
                        <td>{item.title}</td>
                        <td>{item.code_join}</td>
                        <td>{item.canva_id}</td>
                        <td>{item.thoi_gian_bat_dau}</td>
                        <td>{item.trang_thai}</td>
                        <td>
                            <button onClick={() => {
                                nav('/host/' + item.session_id)
                            }}>View</button>
                            <button>Delete</button>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    </div>
}