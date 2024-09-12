import React, { useState } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import SideNavbar from '../SideNav/SideNavbar';
import { baseURL } from '../../Utils/Utils';

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
            const response = await axios.post(`${baseURL}api/admin/add-banner`, formData , {
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
            }
            else{
                errorNotify(response.data.message)
                setBtnDisable(false)
                setLoading(false)
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }

        } catch (error) {
            errorNotify(error.message)
            setBtnDisable(false)
            setLoading(false)
            setTimeout(() => {
                window.location.reload();
            }, 4000);
        }
    }

    return (
        <>
        
        <ToastContainer />
        <span className="loaderr" style={{ position: 'absolute', top: '45%', right: '45%', display: isLoading ? 'block' : 'none' }}></span>
        <div className="container-fluid" style={{opacity: isLoading ? 0.5 : 1}}>
            <div className="row roww">
            <SideNavbar />

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
