import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AddMovie.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import SideNavbar from '../SideNav/SideNavbar';

const successToastStyle = {
    background: 'green',
    color: 'white',
    fontSize: '16px',
    borderRadius: '8px',
};
const successProgressStyle = {
    background: 'green',
};

const ErrorToastStyle = {
    background: 'red',
    color: 'white',
    fontSize: '16px',
    borderRadius: '8px',
};
const ErrorProgressStyle = {
    background: 'red',
};

const Series = () => {
    // useSelector
    const token = useSelector(state => state.user.token)

    const [loaderState, setloaderState] = useState(false)
    const [allSeries, setAllSeries] = useState([])
    const [disabledd, setDisabledd] = useState(false)
    const [btnDisable, setBtnDisable] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, SetStatus] = useState('')
    const [videoFile, setVideoFile] = useState(null);
    const [seriesTitle, setSeriesTitle] = useState('');
    const [seriesThumbnailImage, setSeriesThumbnailImage] = useState(null);


    useEffect(()=>{
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'http://13.51.163.249:3020/api/user/get-series',
            headers: { 
              'Authorization': `Bearer ${token}`,
            }
          };
          
          axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            setAllSeries(response.data.data)
          })
          .catch((error) => {
            console.log(error);
          });
    },[])

    const successnotify = (message) => toast(message, {
        toastStyle: successToastStyle,
        progressBar: true,
        progressStyle: successProgressStyle,
        progressClassName: 'toast-progress'
    });

    const errorNotify = (message) => toast(message, {
        toastStyle: ErrorToastStyle,
        progressBar: true,
        progressStyle: ErrorProgressStyle,
        progressClassName: 'toast-progress'
    });

    const handleThumbnailChange = (e) => {
        setSeriesThumbnailImage(e.target.files[0]);
    };


    const handleSubmitSeries = async (e) => {
        e.preventDefault();

        setBtnDisable(true)
        setLoading(true)

        const formData = new FormData();
        formData.append('Title', seriesTitle);
        formData.append('series', seriesThumbnailImage);

        try {
            const response = await axios.post('http://13.51.163.249:3020/api/user/add-series', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
    
            if (response.data.success === true) {
                successnotify(response.data.message)
                setBtnDisable(false)
                setLoading(false)
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
                console.log('Your status is: ', response.data.message)
            }
            else {
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
        }
    };

    const handleSubmitSeriesSeason = async(e) =>{
        e.preventDefault()
    }

    return (
        <>
            {
                loading && (<span className="loaderr" style={{ position: 'absolute', top: '45%', right: "45%" }}></span>)

            }

            <ToastContainer />
            <div className="container-fluid" style={{ opacity: loading ? 0.5 : 1 }}>
                <div className="row roww">

                <SideNavbar />
                    <div className="col-md-9 col-sm-8">

                        <div className="row">
                            <div className='col-12 formdiv'>

                                <h3 className="text-center text-danger shadow-lg" style={{ fontFamily: "fantasy", textDecoration: "underline" }}>ADD SERIES</h3>

                                <form onSubmit={handleSubmitSeries}>

                                    <div style={{ display: "flex", justifyContent: "space-evenly", backgroundColor: "#212529", borderRadius: "10px" }}>

                                        <div className="mb-3 col-5" style={{ padding: '10px' }}>
                                            <label htmlFor="region" style={{ color: "whitesmoke" }}>Add A New Series Title :</label>
                                            <input type="text" name="" id="" className='form-control' onChange={(e) => setSeriesTitle(e.target.value)} placeholder='Enter a series title' required/>
                                        </div>
                                        <div className="mb-3 col-5" style={{ padding: '10px' }}>
                                            <label htmlFor="region" style={{ color: "whitesmoke" }}>Add A New Series Image :</label>
                                            <input type="file" name="" id="" className='form-control' onChange={handleThumbnailChange} required/>
                                        </div>
                                        <div className="form-group mt-3" style={{ paddingTop: '11px' }}>
                                            <input type="submit" className={btnDisable ? 'button-disabled' : 'button'} disabled={btnDisable} />
                                        </div>
                                    </div>

                                </form>





                                <h3 className="text-center text-danger shadow-lg" style={{ fontFamily: "fantasy", textDecoration: "underline" }}>ADD SEASON</h3>
                                <form onSubmit={handleSubmitSeriesSeason}>
                                    <div style={{ display: "flex", justifyContent: "space-evenly", backgroundColor: "#212529", borderRadius: "10px" }}>

                                        <div className="mb-3 col-4" style={{ padding: '10px' }}>
                                            <label htmlFor="region" style={{ color: "whitesmoke" }}>Add a season :</label>
                                            <select className="form-select">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                            </select>
                                        </div>

                                        <div className="form-group mt-3 col-4 text-center" style={{ paddingTop: '11px' }}>
                                            <input type="submit" className={disabledd ? 'button-disabled' : 'button'} disabled={disabledd} />
                                        </div>
                                    </div>

                                </form>
                                {/* <h3 className="text-center text-danger shadow-lg" style={{ fontFamily: "fantasy", textDecoration: "underline" }}>ADD EPISODE</h3>
                                <form >
                                    <div className="card p-3" style={{ backgroundColor: "#212529", borderRadius: "10px" }}>
                                        <div className="row">
                                            <div className="mb-3 col-12 col-md-6">
                                                <label htmlFor="series" style={{ color: "whitesmoke" }}>Select a Series:</label>
                                                <select id="series" className="form-select">
                                                    <option>hello</option>
                                                    <option>hello</option>
                                                    <option>hello</option>
                                                    <option>hello</option>
                                                </select>
                                            </div>
                                            <div className="mb-3 col-12 col-md-6">
                                                <label htmlFor="season" style={{ color: "whitesmoke" }}>Select a season:</label>
                                                <select id="season" className="form-select">
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-lg-3 col-md-3 col-sm-12">
                                                <label htmlFor="episodeTitle" style={{ color: "whitesmoke" }}>Enter an episode title:</label>
                                                <input type="text" id="episodeTitle" className="form-control" />
                                            </div>
                                            <div className="mb-3 col-lg-3 col-md-3 col-sm-12">
                                                <label htmlFor="episodeTitle" style={{ color: "whitesmoke" }}>Enter an episode number:</label>
                                                <input type="number" id="episodeTitle" className="form-control" />
                                            </div>
                                            <div className="mb-3 col-lg-3 col-md-3 col-sm-12">
                                                <label htmlFor="episodeTitle" style={{ color: "whitesmoke" }}>Enter an episode thumbnail:</label>
                                                <input type="file" id="episodeTitle" className="form-control" />
                                            </div>
                                            <div className="mb-3 col-lg-3 col-md-3 col-sm-12">
                                                <label htmlFor="episodeTitle" style={{ color: "whitesmoke" }}>Enter an episode video:</label>
                                                <input type="file" id="episodeTitle" className="form-control" />
                                            </div>
                                            <div className="form-group col-12 text-center">
                                                <input type="submit" className={disabledd ? 'button-disabled' : 'button'} disabled={disabledd} />
                                            </div>
                                        </div>
                                    </div>
                                </form> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Series

