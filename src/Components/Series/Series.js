import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/AddMovie.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import SideNavbar from '../SideNav/SideNavbar';
import { baseURL } from '../../Utils/Utils';


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

    const [allSeries, setAllSeries] = useState([])
    const [seriesId, setSeriesId] = useState('')
    const [seriesData, setSeriesData] = useState({})
    const [seasonNo, setSeasonNo] = useState('')
    const [seriesBtnDisable, setSeriesBtnDisable] = useState(false)
    const [seasonBtnDisable, setSeasonBtnDisable] = useState(false)
    const [loading, setLoading] = useState(false)
    const [seriesTitle, setSeriesTitle] = useState('');
    const [seriesThumbnailImage, setSeriesThumbnailImage] = useState(null);
    const [selectEpisodeSeries, setSelectEpisodeSeries] = useState(false)
  
    // Series Season Episode
    const [srId, setSrId] = useState('')
    const [snNo, setSnNo] = useState('')
    const [epTitle, setEpisodeTitle] = useState('')
    const [episodeNumber, setEpisodeNumber] = useState('')
    const [episodeThumbnail, setEpisodeThumbnail] = useState(null)
    const [episodeVideoLink, setEpisodeVideoLink] = useState('')


    useEffect(() => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${baseURL}api/user/get-series`,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };

        axios.request(config)
            .then((response) => {
                // console.log(response.data.data[0].Title);
                setAllSeries(response.data.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }, [])

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

        setSeriesBtnDisable(true)
        setLoading(true)

        const formData = new FormData();
        formData.append('Title', seriesTitle);
        formData.append('series', seriesThumbnailImage);

        try {
            const response = await axios.post(`${baseURL}api/user/add-series`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success === true) {
                successnotify(response.data.message)
                setSeriesBtnDisable(false)
                setLoading(false)
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }
            else {
                errorNotify(response.data.message)
                setSeriesBtnDisable(false)
                setLoading(false)
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }
        } catch (error) {
            errorNotify(error.message)
        }
    };

    const handleSubmitSeriesSeason = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSeasonBtnDisable(true)

        if (!seriesId || !seasonNo) {
            errorNotify(!seasonNo ? 'Please enter the valid season no': 'Please enter the valid series')
            setSeasonBtnDisable(false)
            return
        }

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseURL}api/admin/add-season/${seriesId}/${seasonNo}`,
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        };

        axios.request(config)
            .then((response) => {
                setSeasonBtnDisable(false)
                if (response.data.success === true) {
                    setLoading(false)
                    successnotify(response.data.message)
                    setTimeout(() => {
                        window.location.reload();
                    }, 4000);
                } else {
                    setLoading(false)
                    errorNotify(response.data.message)
                    setTimeout(() => {
                        window.location.reload();
                    }, 4000);
                }
            })
            .catch((error) => {
                setLoading(false)
                errorNotify(error.message)
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            });

    }

    const seriesEpisodeSection = (e) => {
        e.preventDefault(); 
        const selectedValue = e.target.value;
        setSrId(e.target.value)

        if(selectedValue){
            setSelectEpisodeSeries(true)
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${baseURL}api/admin/get-all-season-by-series/${selectedValue}`,
                headers: { 
                  'Authorization': `Bearer ${token}`
                }
            };
              
            axios.request(config)
            .then((response) => {
                setSeriesData(response.data.data)
                // console.log('this is series dtata',response.data.data);
            })
            .catch((error) => {
                errorNotify(error.message)
                // console.log('this is series dtata error',error.message);
            });
        }
        else{
            setSelectEpisodeSeries(false)
        }
    }

    const episodeThumbnailHandler = (e) => {
        setEpisodeThumbnail(e.target.files[0]);
    };

    const handleSubmitSeriesEpisode = (e) => {
        e.preventDefault();
        setLoading(true)

        const FormData = require('form-data');
        let data = new FormData();
        data.append('EpisodeTitle', epTitle);
        data.append('EpisodeNumber', episodeNumber);
        data.append('episodeThumbnail', episodeThumbnail);
        data.append('EpisodeVideoLink', episodeVideoLink);
        data.append('seasonNo', snNo);
        data.append('seriesId', srId);
        
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseURL}api/user/addepisodes`,
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            data : data
        };
        
        axios.request(config)
        .then((response) => {
            if(response.data.success === true){
                setLoading(false)
                successnotify(response.data.message)
                setTimeout(() => {
                    window.location.reload();
                }, 3500);
            }
            else{
                setLoading(false)
                errorNotify(response.data.message)
                setTimeout(() => {
                    window.location.reload();
                }, 3500);
            }
        })
        .catch((error) => {
            setLoading(false)
            errorNotify(error.message)
            setTimeout(() => {
                window.location.reload();
            }, 3500);
        });

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
                                            <input type="text" name="" id="" className='form-control' onChange={(e) => setSeriesTitle(e.target.value)} placeholder='Enter a series title' required />
                                        </div>
                                        <div className="mb-3 col-5" style={{ padding: '10px' }}>
                                            <label htmlFor="region" style={{ color: "whitesmoke" }}>Add A New Series Image :</label>
                                            <input type="file" name="" id="" className='form-control' onChange={handleThumbnailChange} required />
                                        </div>
                                        <div className="form-group mt-3" style={{ paddingTop: '11px' }}>
                                            <input type="submit" className={seriesBtnDisable ? 'button-disabled' : 'button'} disabled={seriesBtnDisable} />
                                        </div>
                                    </div>

                                </form>

                                <h3 className="text-center text-danger shadow-lg" style={{ fontFamily: "fantasy", textDecoration: "underline" }}>ADD SEASON</h3>
                                <form onSubmit={handleSubmitSeriesSeason}>
                                    <div style={{ display: "flex", justifyContent: "space-evenly", backgroundColor: "#212529", borderRadius: "10px" }}>

                                        <div className="mb-3 col-5" style={{ padding: '10px' }}>
                                            <label htmlFor="region" style={{ color: "whitesmoke" }}>Series :</label>
                                            <select className="form-select" onChange={(e) => setSeriesId(e.target.value)} required>
                                                <option value="">Select the series</option>
                                                {
                                                    allSeries.map((e, i)=>{
                                                        return (
                                                            <option key={i} value={e._id}>{e.Title}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className="mb-3 col-5" style={{ padding: '10px' }}>
                                            <label htmlFor="region" style={{ color: "whitesmoke" }}>Add a season :</label>
                                            <select className="form-select" onChange={(e) => setSeasonNo(e.target.value)} required>
                                                <option value="">Season no</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                                <option value="6">6</option>
                                                <option value="7">7</option>
                                                <option value="8">8</option>
                                                <option value="9">9</option>
                                                <option value="10">10</option>
                                            </select>
                                        </div>

                                        <div className="form-group mt-3 col-2 text-center" style={{ paddingTop: '11px' }}>
                                            <input type="submit" className={seasonBtnDisable ? 'button-disabled' : 'button'} disabled={seasonBtnDisable} />
                                        </div>
                                    </div>

                                </form>

                                <h3 className="text-center text-danger shadow-lg" style={{ fontFamily: "fantasy", textDecoration: "underline" }}>ADD EPISODE</h3>
                                <form onSubmit={handleSubmitSeriesEpisode}>
                                    <div className="card p-3" style={{ backgroundColor: "#212529", borderRadius: "10px" }}>
                                        <div className="row">
                                            <div className="mb-3 col-12 col-md-6">
                                                <label htmlFor="series" style={{ color: "whitesmoke" }}>Select a Series:</label>
                                                <select 
                                                    id="series" 
                                                    name="series" 
                                                    className="form-select" 
                                                    onChange={seriesEpisodeSection}
                                                    required
                                                    >
                                                    <option value="">Series name</option>
                                                    {
                                                        allSeries.map((e, i)=>{
                                                            return(
                                                                <option key={i} value={e._id}>{e.Title}</option>
                                                            )
                                                            
                                                        })
                                                    }
                                                    
                                                </select>
                                            </div>
                                            <div className="mb-3 col-12 col-md-6">
                                                <label htmlFor="season" style={{ color: "whitesmoke" }}>Select a season:</label>
                                                <select 
                                                    id="season" 
                                                    name="season" 
                                                    className="form-select" 
                                                    disabled={selectEpisodeSeries == false ?? true}
                                                    onChange={(e)=>setSnNo(e.target.value)}
                                                    required
                                                    >
                                                    <option value="">Season no</option>
                                                    {
                                                        seriesData.Season?.map((e, i)=>{
                                                            return(
                                                                <option key={i} value={e}>{e}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="mb-3 col-lg-3 col-md-3 col-sm-12">
                                                <label htmlFor="episodeTitle" style={{ color: "whitesmoke" }}>Episode title :</label>
                                                <input 
                                                    type="text" 
                                                    name="episodeTitle" 
                                                    id="episodeTitle" 
                                                    className="form-control"
                                                    disabled={selectEpisodeSeries == false ?? true} 
                                                    placeholder='Episode name'
                                                    onChange={(e)=>setEpisodeTitle(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-lg-3 col-md-3 col-sm-12">
                                                <label htmlFor="episodeNumber" style={{ color: "whitesmoke" }}>Episode number :</label>
                                                <input 
                                                    type="number" 
                                                    id="episodeNumber" 
                                                    name="episodeNumber" 
                                                    className="form-control" 
                                                    disabled={selectEpisodeSeries == false ?? true} placeholder='Episode no'
                                                    onChange={(e)=>setEpisodeNumber(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-lg-3 col-md-3 col-sm-12">
                                                <label htmlFor="episodeThumbnail" style={{ color: "whitesmoke" }}>Episode thumbnail :</label>
                                                <input 
                                                    type="file" 
                                                    id="episodeThumbnail" 
                                                    name="episodeThumbnail" 
                                                    className="form-control" 
                                                    disabled={selectEpisodeSeries == false ?? true}
                                                    onChange={episodeThumbnailHandler}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3 col-lg-3 col-md-3 col-sm-12">
                                                <label htmlFor="episodeVideoLink" style={{ color: "whitesmoke" }}>Episode video link :</label>
                                                <input 
                                                    type="text" 
                                                    id="episodeVideoLink" 
                                                    name="episodeVideoLink" 
                                                    className="form-control" 
                                                    disabled={selectEpisodeSeries == false ?? true} placeholder='Episode video link'
                                                    onChange={(e)=>setEpisodeVideoLink(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="form-group col-12 text-center">
                                                <input type="submit" className={seasonBtnDisable ? 'button-disabled' : 'button'} disabled={seasonBtnDisable} />
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Series

