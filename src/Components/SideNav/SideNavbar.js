import React from 'react'
import { Link } from "react-router-dom";
import companyLogo from '../../assets/images/filmsWorldLogo.jpeg';

const SideNavbar = () => {
  return (
    <div className="col-md-3 col-sm-4 text-center" style={{ backgroundColor: "#0a0a0a" }}>
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
        <a className="d-flex align-items-center justify-content-center title" >
            <div>
                <img src={companyLogo} alt="BigCo Inc. logo" width={50} height={40} />
            </div>
            <div>FILMSWORLDPk</div>
        </a>
        <hr />
        <li className="nav-item" style={{ marginTop: "20px" }}>
            <Link to='/users' className="nav-link">
                <i className="fas fa-fw fa-users"></i>
                <span>All Users</span></Link>
        </li>
        <li className="nav-item" style={{ marginTop: "20px" }}>
            <Link to='/add-suggestion' className="nav-link">
                <i className="fa-solid fa-list"></i>
                <span>Any Suggestions</span></Link>
        </li>
        <li className="nav-item" style={{ marginTop: "20px" }}>
            <Link to='/add-movie' className="nav-link" >
                <i className="fas fa-file-video"></i>
                <span>Add Movie</span></Link>
        </li>
        <li className="nav-item" style={{ marginTop: "20px" }}>
            <Link to='/add-banner' className="nav-link">
                <i className="fas fa-file-video"></i>
                <span>Add Banner</span></Link>
        </li>
        <hr />
        <li className="nav-item" style={{ marginTop: "20px" }}>
            <Link to='/add-series' className="nav-link">
                <i className="fas fa-file-video"></i>
                <span>Add Series - Episodes</span></Link>
        </li>


        <div className="text-center d-none d-md-inline">
            <button className="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
    </ul>
</div>
  )
}

export default SideNavbar
