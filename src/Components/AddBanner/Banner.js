import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import companyLogo from '../../assets/images/filmsWorldLogo.jpeg';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

const Banner = () => {

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [btnDisable, setBtnDisable] = useState(false)
    const [isLoading, setLoading] = useState(false)

    const successToastStyle = {
        background: 'green',
        color: 'white',
        fontSize: '16px',
        borderRadius: '8px',
    };
    const successProgressStyle = {
        background: 'green',
    };
    
    const errorToastStyle = {
        background: 'red',
        color: 'white',
        fontSize: '16px',
        borderRadius: '8px',
    };
    const errorProgressStyle = {
        background: 'red',
    };

    const notify = (message) => toast(message , {
        toastStyle: successToastStyle,
        progressBar: true,
        progressStyle: successProgressStyle,
        progressClassName: 'toast-progress'
    });

    const errorNotify = (message) => toast(message , {
        toastStyle: errorToastStyle,
        progressBar: true,
        progressStyle: errorProgressStyle,
        progressClassName: 'toast-progress'
    });

    const handleThumbnailChange = (e) => {
        setThumbnailFile(e.target.files[0]);
    };

    const handlerSubmit = async (e) =>{
        e.preventDefault();
        setBtnDisable(true)
        setLoading(true)

        const formData = new FormData();
        formData.append('banner', thumbnailFile);

        try {
            const response = await axios.post('http://13.51.163.249:3020/api/admin/add-banner', formData , {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response.data.success === true) {
                notify(response.data.message)
                setBtnDisable(false)
                setLoading(false)
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
                console.log('Your status is: ', response.data.message)
            }
            else{
                errorNotify(response.data.message)
                setBtnDisable(false)
                setLoading(false)
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
                console.log('Your status is: ', response.data.message)
            }

        } catch (error) {
            errorNotify(error.message)
            setBtnDisable(false)
            setLoading(false)
            setTimeout(() => {
                window.location.reload();
            }, 4000);
            console.log('Error uploading files:', error);
        }
    }

    return (
        <>
        
        <ToastContainer />
        <span className="loaderr" style={{ position: 'absolute', top: '45%', right: '45%', display: isLoading ? 'block' : 'none' }}></span>
        <div className="container-fluid" style={{opacity: isLoading ? 0.5 : 1}}>
            <div className="row roww">
                <div className="col-md-3 col-sm-4 text-center" style={{ backgroundColor: "#0a0a0a" }}>
                    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                        <a className="d-flex align-items-center justify-content-center title" >
                            <div>
                                <img src={companyLogo} alt="BigCo Inc. logo" width={50} height={40} />
                            </div>
                            <div>FILMSWORLDPk</div>
                        </a>
                        <hr />
                        <li className="nav-item" style={{marginTop:"20px"}}>
                            <Link to='/users' className="nav-link">
                                <i className="fas fa-fw fa-users"></i>
                                <span>All Users</span></Link>
                        </li>
                        <li className="nav-item" style={{marginTop:"20px"}}>
                            <Link to='/add-movie' className="nav-link" >
                                <i className="fas fa-file-video"></i>
                                <span>Add Movie</span></Link>
                        </li>
                        <li className="nav-item" style={{marginTop:"20px"}}>
                            <Link to='/add-banner' className="nav-link">
                                <i className="fas fa-file-video"></i>
                                <span>Add Banner</span></Link>
                        </li>


                        <div className="text-center d-none d-md-inline">
                            <button className="rounded-circle border-0" id="sidebarToggle"></button>
                        </div>
                    </ul>
                </div>

                <div className="col-md-9 col-sm-8">

                    <div className="row">
                        <div className='col-12 formdiv'>
                            <h3 className="text-center text-danger shadow-lg" style={{ fontFamily: "fantasy", textDecoration: "underline" }}>ADD MOVIE BANNER</h3>
                            <form onSubmit={handlerSubmit}>

                                <div className="form-group mt-3">
                                    <label htmlFor="file">Movie Banner</label>
                                    <input type="file" className='form-control' required onChange={handleThumbnailChange} />
                                </div>
                                <div className="form-group mt-3">
                                    <input type="submit" className={btnDisable ? 'button-disabled' : 'button'}  disabled={btnDisable}/>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Banner
