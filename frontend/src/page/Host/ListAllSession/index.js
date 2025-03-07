
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import api_config from '../../../config/api_config';

export default function ListAllSession() {
    const { canva_id } = useParams();
    const [data, setdata] = useState([]);
    const nav = useNavigate();

    const getSessions = async () => {
        try {
            const response = await fetch(api_config.canva.addCanva + '/' + canva_id + '/session');
            const data = await response.json();
            setdata(data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getSessions();
    }, [])

    //  "session_id": 10,
    // "title": "New session",
    // "code_join": "HKPYQBSZEU",
    // "canva_id": 6,
    // "thoi_gian_bat_dau": "2025-03-07T01:17:37.000Z",
    // "trang_thai": "dang_choi"

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