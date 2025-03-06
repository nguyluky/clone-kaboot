import ListAllCanva from "../ListAllCanva";
import './Admin.css'
import { Outlet } from "react-router";

export default function Admin() {
    return (
        <div className="admin-container" data-color-mode="light">
            <div className="admin-side-bar">
                Chưa làm
            </div> 
            <div className="admin-content">
                <Outlet />                
            </div>
        </div>
    )

}