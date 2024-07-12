import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/AddMovie.css';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import companyLogo from '../../assets/images/filmsWorldLogo.jpeg';

const customToastStyle = {
    background: 'green',
    color: 'white',
    fontSize: '16px',
    borderRadius: '8px',
};
const customProgressStyle = {
    background: 'green',
};

const customToastStyleErr = {
    background: 'red',
    color: 'white',
    fontSize: '16px',
    borderRadius: '8px',
};
const customProgressStyleErr = {
    background: 'red',
};

const Movie = () => {
    const [loaderState, setloaderState] = useState(false)
    const [disabledd, setDisabledd] = useState(false)
    const [status, SetStatus] = useState('')
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [movieTitle, setMovieTitle] = useState('');
    const [movieDescription, setMovieDescription] = useState('');
    const [videoProgress, setVideoProgress] = useState(0);
    const [progressComplete, setProgressComplete] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleChange = (event) => {
        const selectedValue = event.target.selectedOptions[0].value
        // console.log('selectedValue', selectedValue,)
        setSelectedCategories(prevSelectedCategories => {
            if (!prevSelectedCategories.includes(selectedValue)) {
                return [...prevSelectedCategories, selectedValue];
            }
            else {
                // console.log(1)
                setSelectedCategories([selectedCategories])
            }
        });
    };
    // console.log('selectedCategories', selectedCategories)

    const handleRemoveCategory = (category) => {
        const updatedCategories = selectedCategories.filter(cat => cat !== category);
        setSelectedCategories(updatedCategories);
    };

    const notify = () => toast("Your Video Has Been Uploaded", {
        toastStyle: customToastStyle,
        progressBar: true,
        progressStyle: customProgressStyle,
        progressClassName: 'toast-progress'
    });

    const errorNotify = () => toast("Network Error", {
        toastStyle: customToastStyleErr,
        progressBar: true,
        progressStyle: customProgressStyleErr,
        progressClassName: 'toast-progress'
    });

    const falseNotify = () => toast("Something Went Wrong.", {
        toastStyle: customToastStyleErr,
        progressBar: true,
        progressStyle: customProgressStyleErr,
        progressClassName: 'toast-progress'
    });

    const handleVideoChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleThumbnailChange = (e) => {
        setThumbnailFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setloaderState(true)
        setDisabledd(true);
        setVideoProgress(0);


        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('thumbnail', thumbnailFile);
        formData.append('movieTitle', movieTitle);
        formData.append('movieCategory', JSON.stringify(selectedCategories));
        formData.append('movieDescription', movieDescription);

        try {
            const response = await axios.post('http://13.51.163.249:3020/api/admin/add-movie', formData , {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // onUploadProgress: (progressEvent) => {
                //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                //     setVideoProgress(percentCompleted);
                // },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;
                    const percentCompleted = Math.round((loaded * 100) / total);
                    console.log('this is total :',total)
                    // Only update progress if upload is not yet complete
                    if (percentCompleted < 100) {
                        console.log('this is total in if condition:',total, ' percentCompleted :',percentCompleted)
                        setVideoProgress(percentCompleted);
                        setloaderState(false)
                    } else {
                        // Optional: Clear progress when upload is complete
                        setProgressComplete(true)
                        setVideoProgress(100);
                    }
                },
            });
            setloaderState(false)
            //   console.log('Upload successful:', response.data.success);
            if (response.data.success === true) {
                SetStatus(response.data.message)
                notify()
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
                console.log('Your status is: ', response.data.message)
            }
            else{
                falseNotify()
                // setTimeout(() => {
                //     window.location.reload();
                // }, 4000);
                console.log('Your status is: ', response.data.message)
            }

        } catch (error) {
            errorNotify()
            setTimeout(() => {
                window.location.reload();
            }, 4000);
            console.log('Error uploading files:', error);
        }
    };

    return (
        <>
        {
            loaderState && (<span className="loaderr" style={{position:'absolute',top:'45%',right:"45%"}}></span>)

        }

            <ToastContainer />
            <div className="container-fluid">
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
                                <h3 className="text-center text-danger shadow-lg" style={{ fontFamily: "fantasy", textDecoration: "underline" }}>ADD MOVIE</h3>
                                <form onSubmit={handleSubmit}>

                                    <div className="mb-3 ">
                                        <label htmlFor="region">Choose a category:</label>

                                        <select
                                            name="mregion"
                                            className="form-select"
                                            required
                                            id="categorySelect"
                                            onChange={handleChange}
                                        >
                                            <option value="Action" disabled={selectedCategories.includes("Action")}>Action</option>
                                            <option value="Adventure" disabled={selectedCategories.includes("Adventure")}>Adventure</option>
                                            <option value="Bollywood" disabled={selectedCategories.includes("Bollywood")}>Bollywood</option>
                                            <option value="Comedies" disabled={selectedCategories.includes("Comedies")}>Comedies</option>
                                            <option value="Dramas" disabled={selectedCategories.includes("Dramas")}>Dramas</option>
                                            <option value="Hollywood" disabled={selectedCategories.includes("Hollywood")}>Hollywood</option>
                                            <option value="Horror" disabled={selectedCategories.includes("Horror")}>Horror</option>
                                            <option value="Pakistani" disabled={selectedCategories.includes("Pakistani")}>Pakistani</option>
                                            <option value="Punjabi" disabled={selectedCategories.includes("Punjabi")}>Punjabi</option>
                                            <option value="Romance" disabled={selectedCategories.includes("Romance")}>Romance</option>
                                            <option value="Science fiction" disabled={selectedCategories.includes("Science fiction")}>Science fiction</option>
                                            <option value="Tamil" disabled={selectedCategories.includes("Tamil")}>Tamil</option>
                                            <option value="Thriller" disabled={selectedCategories.includes("Thriller")}>Thriller</option>
                                            <option value="Action & Adventure" disabled={selectedCategories.includes("Action & Adventure")}>Action & Adventure</option>
                                            <option value="Action Comedies" disabled={selectedCategories.includes("Action Comedies")}>Action Comedies</option>
                                            <option value="Action Sci-Fi & Fantasy" disabled={selectedCategories.includes("Action Sci-Fi & Fantasy")}>Action Sci-Fi & Fantasy</option>
                                            <option value="Action Thrillers" disabled={selectedCategories.includes("Action Thrillers")}>Action Thrillers</option>
                                            <option value="Adult Animation" disabled={selectedCategories.includes("Adult Animation")}>Adult Animation</option>
                                            <option value="African Movies" disabled={selectedCategories.includes("African Movies")}>African Movies</option>
                                            <option value="Alien Sci-Fi" disabled={selectedCategories.includes("Alien Sci-Fi")}>Alien Sci-Fi</option>
                                            <option value="Animal Tales" disabled={selectedCategories.includes("Animal Tales")}>Animal Tales</option>
                                            <option value="Anime" disabled={selectedCategories.includes("Anime")}>Anime</option>
                                            <option value="Anime Action" disabled={selectedCategories.includes("Anime Action")}>Anime Action</option>
                                            <option value="Anime Comedies" disabled={selectedCategories.includes("Anime Comedies")}>Anime Comedies</option>
                                            <option value="Anime Dramas" disabled={selectedCategories.includes("Anime Dramas")}>Anime Dramas</option>
                                            <option value="Anime Fantasy" disabled={selectedCategories.includes("Anime Fantasy")}>Anime Fantasy</option>
                                            <option value="Anime Features" disabled={selectedCategories.includes("Anime Features")}>Anime Features</option>
                                            <option value="Anime Horror" disabled={selectedCategories.includes("Anime Horror")}>Anime Horror</option>
                                            <option value="Anime Sci-Fi" disabled={selectedCategories.includes("Anime Sci-Fi")}>Anime Sci-Fi</option>
                                            <option value="Anime Series" disabled={selectedCategories.includes("Anime Series")}>Anime Series</option>
                                            <option value="Art House Movies" disabled={selectedCategories.includes("Art House Movies")}>Art House Movies</option>
                                            <option value="Asian Action Movies" disabled={selectedCategories.includes("Asian Action Movies")}>Asian Action Movies</option>
                                            <option value="Australian Movies" disabled={selectedCategories.includes("Australian Movies")}>Australian Movies</option>
                                            <option value="B-Horror Movies" disabled={selectedCategories.includes("B-Horror Movies")}>B-Horror Movies</option>
                                            <option value="Baseball Movies" disabled={selectedCategories.includes("Baseball Movies")}>Baseball Movies</option>
                                            <option value="Basketball Movies" disabled={selectedCategories.includes("Basketball Movies")}>Basketball Movies</option>
                                            <option value="Belgian Movies" disabled={selectedCategories.includes("Belgian Movies")}>Belgian Movies</option>
                                            <option value="Biographical Documentaries" disabled={selectedCategories.includes("Biographical Documentaries")}>Biographical Documentaries</option>
                                            <option value="Biographical Dramas" disabled={selectedCategories.includes("Biographical Dramas")}>Biographical Dramas</option>
                                            <option value="Boxing Movies" disabled={selectedCategories.includes("Boxing Movies")}>Boxing Movies</option>
                                            <option value="British Movies" disabled={selectedCategories.includes("British Movies")}>British Movies</option>
                                            <option value="British TV Shows" disabled={selectedCategories.includes("British TV Shows")}>British TV Shows</option>
                                            <option value="Campy Movies" disabled={selectedCategories.includes("Campy Movies")}>Campy Movies</option>
                                            <option value="Children & Family Movies" disabled={selectedCategories.includes("Children & Family Movies")}>Children & Family Movies</option>
                                            <option value="Chinese Movies" disabled={selectedCategories.includes("Chinese Movies")}>Chinese Movies</option>
                                            <option value="Classic Action & Adventure" disabled={selectedCategories.includes("Classic Action & Adventure")}>Classic Action & Adventure</option>
                                            <option value="Classic Comedies" disabled={selectedCategories.includes("Classic Comedies")}>Classic Comedies</option>
                                            <option value="Classic Dramas" disabled={selectedCategories.includes("Classic Dramas")}>Classic Dramas</option>
                                            <option value="Classic Foreign Movies" disabled={selectedCategories.includes("Classic Foreign Movies")}>Classic Foreign Movies</option>
                                            <option value="Classic Movies" disabled={selectedCategories.includes("Classic Movies")}>Classic Movies</option>
                                            <option value="Classic Musicals" disabled={selectedCategories.includes("Classic Musicals")}>Classic Musicals</option>
                                            <option value="Classic Romantic Movies" disabled={selectedCategories.includes("Classic Romantic Movies")}>Classic Romantic Movies</option>
                                            <option value="Classic Sci-Fi & Fantasy" disabled={selectedCategories.includes("Classic Sci-Fi & Fantasy")}>Classic Sci-Fi & Fantasy</option>
                                            <option value="Classic Thrillers" disabled={selectedCategories.includes("Classic Thrillers")}>Classic Thrillers</option>
                                            <option value="Classic TV Shows" disabled={selectedCategories.includes("Classic TV Shows")}>Classic TV Shows</option>
                                            <option value="Classic War Movies" disabled={selectedCategories.includes("Classic War Movies")}>Classic War Movies</option>
                                            <option value="Classic Westerns" disabled={selectedCategories.includes("Classic Westerns")}>Classic Westerns</option>
                                            <option value="Comic Book and Superhero Movies" disabled={selectedCategories.includes("Comic Book and Superhero Movies")}>Comic Book and Superhero Movies</option>
                                            <option value="Country & Western/Folk" disabled={selectedCategories.includes("Country & Western/Folk")}>Country & Western/Folk</option>
                                            <option value="Courtroom Dramas" disabled={selectedCategories.includes("Courtroom Dramas")}>Courtroom Dramas</option>
                                            <option value="Creature Features" disabled={selectedCategories.includes("Creature Features")}>Creature Features</option>
                                            <option value="Crime Action & Adventure" disabled={selectedCategories.includes("Crime Action & Adventure")}>Crime Action & Adventure</option>
                                            <option value="Crime Documentaries" disabled={selectedCategories.includes("Crime Documentaries")}>Crime Documentaries</option>
                                            <option value="Crime Dramas" disabled={selectedCategories.includes("Crime Dramas")}>Crime Dramas</option>
                                            <option value="Crime Thrillers" disabled={selectedCategories.includes("Crime Thrillers")}>Crime Thrillers</option>
                                            <option value="Crime TV Shows" disabled={selectedCategories.includes("Crime TV Shows")}>Crime TV Shows</option>
                                            <option value="Cult Comedies" disabled={selectedCategories.includes("Cult Comedies")}>Cult Comedies</option>
                                            <option value="Cult Horror Movies" disabled={selectedCategories.includes("Cult Horror Movies")}>Cult Horror Movies</option>
                                            <option value="Cult Movies" disabled={selectedCategories.includes("Cult Movies")}>Cult Movies</option>
                                            <option value="Cult Sci-Fi & Fantasy" disabled={selectedCategories.includes("Cult Sci-Fi & Fantasy")}>Cult Sci-Fi & Fantasy</option>
                                            <option value="Cult TV Shows" disabled={selectedCategories.includes("Cult TV Shows")}>Cult TV Shows</option>
                                            <option value="Dark Comedies" disabled={selectedCategories.includes("Dark Comedies")}>Dark Comedies</option>
                                            <option value="Deep Sea Horror Movies" disabled={selectedCategories.includes("Deep Sea Horror Movies")}>Deep Sea Horror Movies</option>
                                            <option value="Disney" disabled={selectedCategories.includes("Disney")}>Disney</option>
                                            <option value="Disney Musicals" disabled={selectedCategories.includes("Disney Musicals")}>Disney Musicals</option>
                                            <option value="Documentaries" disabled={selectedCategories.includes("Documentaries")}>Documentaries</option>
                                            <option value="Dramas based on Books" disabled={selectedCategories.includes("Dramas based on Books")}>Dramas based on Books</option>
                                            <option value="Dramas based on real life" disabled={selectedCategories.includes("Dramas based on real life")}>Dramas based on real life</option>
                                            <option value="Dutch Movies" disabled={selectedCategories.includes("Dutch Movies")}>Dutch Movies</option>
                                            <option value="Eastern European Movies" disabled={selectedCategories.includes("Eastern European Movies")}>Eastern European Movies</option>
                                            <option value="Education for Kids" disabled={selectedCategories.includes("Education for Kids")}>Education for Kids</option>
                                            <option value="Epics" disabled={selectedCategories.includes("Epics")}>Epics</option>
                                            <option value="Experimental Movies" disabled={selectedCategories.includes("Experimental Movies")}>Experimental Movies</option>
                                            <option value="Faith & Spirituality" disabled={selectedCategories.includes("Faith & Spirituality")}>Faith & Spirituality</option>
                                            <option value="Faith & Spirituality Movies" disabled={selectedCategories.includes("Faith & Spirituality Movies")}>Faith & Spirituality Movies</option>
                                            <option value="Family Features" disabled={selectedCategories.includes("Family Features")}>Family Features</option>
                                            <option value="Fantasy Movies" disabled={selectedCategories.includes("Fantasy Movies")}>Fantasy Movies</option>
                                            <option value="Film Noir" disabled={selectedCategories.includes("Film Noir")}>Film Noir</option>
                                            <option value="Food & Travel TV" disabled={selectedCategories.includes("Food & Travel TV")}>Food & Travel TV</option>
                                            <option value="Football Movies" disabled={selectedCategories.includes("Football Movies")}>Football Movies</option>
                                            <option value="Foreign Action & Adventure" disabled={selectedCategories.includes("Foreign Action & Adventure")}>Foreign Action & Adventure</option>
                                            <option value="Foreign Comedies" disabled={selectedCategories.includes("Foreign Comedies")}>Foreign Comedies</option>
                                            <option value="Foreign Documentaries" disabled={selectedCategories.includes("Foreign Documentaries")}>Foreign Documentaries</option>
                                            <option value="Foreign Dramas" disabled={selectedCategories.includes("Foreign Dramas")}>Foreign Dramas</option>
                                            <option value="Foreign Gay & Lesbian Movies" disabled={selectedCategories.includes("Foreign Gay & Lesbian Movies")}>Foreign Gay & Lesbian Movies</option>
                                            <option value="Foreign Horror Movies" disabled={selectedCategories.includes("Foreign Horror Movies")}>Foreign Horror Movies</option>
                                            <option value="Foreign Movies" disabled={selectedCategories.includes("Foreign Movies")}>Foreign Movies</option>
                                            <option value="Foreign Sci-Fi & Fantasy" disabled={selectedCategories.includes("Foreign Sci-Fi & Fantasy")}>Foreign Sci-Fi & Fantasy</option>
                                            <option value="Foreign Thrillers" disabled={selectedCategories.includes("Foreign Thrillers")}>Foreign Thrillers</option>
                                            <option value="French Movies" disabled={selectedCategories.includes("French Movies")}>French Movies</option>
                                            <option value="Gangster Movies" disabled={selectedCategories.includes("Gangster Movies")}>Gangster Movies</option>
                                            <option value="Gay & Lesbian Dramas" disabled={selectedCategories.includes("Gay & Lesbian Dramas")}>Gay & Lesbian Dramas</option>
                                            <option value="German Movies" disabled={selectedCategories.includes("German Movies")}>German Movies</option>
                                            <option value="Greek Movies" disabled={selectedCategories.includes("Greek Movies")}>Greek Movies</option>
                                            <option value="Historical Documentaries" disabled={selectedCategories.includes("Historical Documentaries")}>Historical Documentaries</option>
                                            <option value="Horror Comedy" disabled={selectedCategories.includes("Horror Comedy")}>Horror Comedy</option>
                                            <option value="Horror Movies" disabled={selectedCategories.includes("Horror Movies")}>Horror Movies</option>
                                            <option value="Independent Action & Adventure" disabled={selectedCategories.includes("Independent Action & Adventure")}>Independent Action & Adventure</option>
                                            <option value="Independent Comedies" disabled={selectedCategories.includes("Independent Comedies")}>Independent Comedies</option>
                                            <option value="Independent Dramas" disabled={selectedCategories.includes("Independent Dramas")}>Independent Dramas</option>
                                            <option value="Independent Movies" disabled={selectedCategories.includes("Independent Movies")}>Independent Movies</option>
                                            <option value="Independent Thrillers" disabled={selectedCategories.includes("Independent Thrillers")}>Independent Thrillers</option>
                                            <option value="Indian Movies" disabled={selectedCategories.includes("Indian Movies")}>Indian Movies</option>
                                            <option value="Irish Movies" disabled={selectedCategories.includes("Irish Movies")}>Irish Movies</option>
                                            <option value="Italian Movies" disabled={selectedCategories.includes("Italian Movies")}>Italian Movies</option>
                                            <option value="Japanese Movies" disabled={selectedCategories.includes("Japanese Movies")}>Japanese Movies</option>
                                            <option value="Jazz & Easy Listening" disabled={selectedCategories.includes("Jazz & Easy Listening")}>Jazz & Easy Listening</option>
                                            <option value="Kids Faith & Spirituality" disabled={selectedCategories.includes("Kids Faith & Spirituality")}>Kids Faith & Spirituality</option>
                                            <option value="Kids Music" disabled={selectedCategories.includes("Kids Music")}>Kids Music</option>
                                            <option value="Kids’ TV" disabled={selectedCategories.includes("Kids’ TV")}>Kids’ TV</option>
                                            <option value="Korean Movies" disabled={selectedCategories.includes("Korean Movies")}>Korean Movies</option>
                                            <option value="Korean TV Shows" disabled={selectedCategories.includes("Korean TV Shows")}>Korean TV Shows</option>
                                            <option value="Late Night Comedies" disabled={selectedCategories.includes("Late Night Comedies")}>Late Night Comedies</option>
                                            <option value="Latin American Movies" disabled={selectedCategories.includes("Latin American Movies")}>Latin American Movies</option>
                                            <option value="Latin Music" disabled={selectedCategories.includes("Latin Music")}>Latin Music</option>
                                            <option value="Martial Arts Movies" disabled={selectedCategories.includes("Martial Arts Movies")}>Martial Arts Movies</option>
                                            <option value="Martial Arts, Boxing & Wrestling" disabled={selectedCategories.includes("Martial Arts, Boxing & Wrestling")}>Martial Arts, Boxing & Wrestling</option>
                                            <option value="Middle Eastern Movies" disabled={selectedCategories.includes("Middle Eastern Movies")}>Middle Eastern Movies</option>
                                            <option value="Military Action & Adventure" disabled={selectedCategories.includes("Military Action & Adventure")}>Military Action & Adventure</option>
                                            <option value="Military Documentaries" disabled={selectedCategories.includes("Military Documentaries")}>Military Documentaries</option>
                                            <option value="Military Dramas" disabled={selectedCategories.includes("Military Dramas")}>Military Dramas</option>
                                            <option value="Military TV Shows" disabled={selectedCategories.includes("Military TV Shows")}>Military TV Shows</option>
                                            <option value="Miniseries" disabled={selectedCategories.includes("Miniseries")}>Miniseries</option>
                                            <option value="Mockumentaries" disabled={selectedCategories.includes("Mockumentaries")}>Mockumentaries</option>
                                            <option value="Monster Movies" disabled={selectedCategories.includes("Monster Movies")}>Monster Movies</option>
                                            <option value="Movies based on children’s books" disabled={selectedCategories.includes("Movies based on children’s books")}>Movies based on children’s books</option>
                                            <option value="Movies for ages 0 to 2" disabled={selectedCategories.includes("Movies for ages 0 to 2")}>Movies for ages 0 to 2</option>
                                            <option value="Movies for ages 2 to 4" disabled={selectedCategories.includes("Movies for ages 2 to 4")}>Movies for ages 2 to 4</option>
                                            <option value="Movies for ages 5 to 7" disabled={selectedCategories.includes("Movies for ages 5 to 7")}>Movies for ages 5 to 7</option>
                                            <option value="Movies for ages 8 to 10" disabled={selectedCategories.includes("Movies for ages 8 to 10")}>Movies for ages 8 to 10</option>
                                            <option value="Movies for ages 11 to 12" disabled={selectedCategories.includes("Movies for ages 11 to 12")}>Movies for ages 11 to 12</option>
                                            <option value="Music & Concert Documentaries" disabled={selectedCategories.includes("Music & Concert Documentaries")}>Music & Concert Documentaries</option>
                                            <option value="Music" disabled={selectedCategories.includes("Music")}>Music</option>
                                            <option value="Musicals" disabled={selectedCategories.includes("Musicals")}>Musicals</option>
                                            <option value="Mysteries" disabled={selectedCategories.includes("Mysteries")}>Mysteries</option>
                                            <option value="New Zealand Movies" disabled={selectedCategories.includes("New Zealand Movies")}>New Zealand Movies</option>
                                            <option value="Period Pieces" disabled={selectedCategories.includes("Period Pieces")}>Period Pieces</option>
                                            <option value="Political Comedies" disabled={selectedCategories.includes("Political Comedies")}>Political Comedies</option>
                                            <option value="Political Documentaries" disabled={selectedCategories.includes("Political Documentaries")}>Political Documentaries</option>
                                            <option value="Political Dramas" disabled={selectedCategories.includes("Political Dramas")}>Political Dramas</option>
                                            <option value="Political Thrillers" disabled={selectedCategories.includes("Political Thrillers")}>Political Thrillers</option>
                                            <option value="Psychological Thrillers" disabled={selectedCategories.includes("Psychological Thrillers")}>Psychological Thrillers</option>
                                            <option value="Quirky Romance" disabled={selectedCategories.includes("Quirky Romance")}>Quirky Romance</option>
                                            <option value="Reality TV" disabled={selectedCategories.includes("Reality TV")}>Reality TV</option>
                                            <option value="Religious Documentaries" disabled={selectedCategories.includes("Religious Documentaries")}>Religious Documentaries</option>
                                            <option value="Rock & Pop Concerts" disabled={selectedCategories.includes("Rock & Pop Concerts")}>Rock & Pop Concerts</option>
                                            <option value="Romantic Comedies" disabled={selectedCategories.includes("Romantic Comedies")}>Romantic Comedies</option>
                                            <option value="Romantic Dramas" disabled={selectedCategories.includes("Romantic Dramas")}>Romantic Dramas</option>
                                            <option value="Romantic Favorites" disabled={selectedCategories.includes("Romantic Favorites")}>Romantic Favorites</option>
                                            <option value="Romantic Foreign Movies" disabled={selectedCategories.includes("Romantic Foreign Movies")}>Romantic Foreign Movies</option>
                                            <option value="Romantic Independent Movies" disabled={selectedCategories.includes("Romantic Independent Movies")}>Romantic Independent Movies</option>
                                            <option value="Romantic Movies" disabled={selectedCategories.includes("Romantic Movies")}>Romantic Movies</option>
                                            <option value="Russian" disabled={selectedCategories.includes("Russian")}>Russian</option>
                                            <option value="Satanic Stories" disabled={selectedCategories.includes("Satanic Stories")}>Satanic Stories</option>
                                            <option value="Satires" disabled={selectedCategories.includes("Satires")}>Satires</option>
                                            <option value="Scandinavian Movies" disabled={selectedCategories.includes("Scandinavian Movies")}>Scandinavian Movies</option>
                                            <option value="Sci-Fi & Fantasy" disabled={selectedCategories.includes("Sci-Fi & Fantasy")}>Sci-Fi & Fantasy</option>
                                            <option value="Sci-Fi Adventure" disabled={selectedCategories.includes("Sci-Fi Adventure")}>Sci-Fi Adventure</option>
                                            <option value="Sci-Fi Dramas" disabled={selectedCategories.includes("Sci-Fi Dramas")}>Sci-Fi Dramas</option>
                                            <option value="Sci-Fi Horror Movies" disabled={selectedCategories.includes("Sci-Fi Horror Movies")}>Sci-Fi Horror Movies</option>
                                            <option value="Sci-Fi Thrillers" disabled={selectedCategories.includes("Sci-Fi Thrillers")}>Sci-Fi Thrillers</option>
                                            <option value="Science & Nature Documentaries" disabled={selectedCategories.includes("Science & Nature Documentaries")}>Science & Nature Documentaries</option>
                                            <option value="Science & Nature TV" disabled={selectedCategories.includes("Science & Nature TV")}>Science & Nature TV</option>
                                            <option value="Screwball Comedies" disabled={selectedCategories.includes("Screwball Comedies")}>Screwball Comedies</option>
                                            <option value="Showbiz Dramas" disabled={selectedCategories.includes("Showbiz Dramas")}>Showbiz Dramas</option>
                                            <option value="Showbiz Musicals" disabled={selectedCategories.includes("Showbiz Musicals")}>Showbiz Musicals</option>
                                            <option value="Silent Movies" disabled={selectedCategories.includes("Silent Movies")}>Silent Movies</option>
                                            <option value="Slapstick Comedies" disabled={selectedCategories.includes("Slapstick Comedies")}>Slapstick Comedies</option>
                                            <option value="Slasher and Serial Killer Movies" disabled={selectedCategories.includes("Slasher and Serial Killer Movies")}>Slasher and Serial Killer Movies</option>
                                            <option value="Soccer Movies" disabled={selectedCategories.includes("Soccer Movies")}>Soccer Movies</option>
                                            <option value="Social & Cultural Documentaries" disabled={selectedCategories.includes("Social & Cultural Documentaries")}>Social & Cultural Documentaries</option>
                                            <option value="Social Issue Dramas" disabled={selectedCategories.includes("Social Issue Dramas")}>Social Issue Dramas</option>
                                            <option value="Southeast Asian Movies" disabled={selectedCategories.includes("Southeast Asian Movies")}>Southeast Asian Movies</option>
                                            <option value="Spanish Movies" disabled={selectedCategories.includes("Spanish Movies")}>Spanish Movies</option>
                                            <option value="Spiritual Documentaries" disabled={selectedCategories.includes("Spiritual Documentaries")}>Spiritual Documentaries</option>
                                            <option value="Sports & Fitness" disabled={selectedCategories.includes("Sports & Fitness")}>Sports & Fitness</option>
                                            <option value="Sports Comedies" disabled={selectedCategories.includes("Sports Comedies")}>Sports Comedies</option>
                                            <option value="Sports Documentaries" disabled={selectedCategories.includes("Sports Documentaries")}>Sports Documentaries</option>
                                            <option value="Sports Dramas" disabled={selectedCategories.includes("Sports Dramas")}>Sports Dramas</option>
                                            <option value="Sports Movies" disabled={selectedCategories.includes("Sports Movies")}>Sports Movies</option>
                                            <option value="Spy Action & Adventure" disabled={selectedCategories.includes("Spy Action & Adventure")}>Spy Action & Adventure</option>
                                            <option value="Spy Thrillers" disabled={selectedCategories.includes("Spy Thrillers")}>Spy Thrillers</option>
                                            <option value="Stage Musicals" disabled={selectedCategories.includes("Stage Musicals")}>Stage Musicals</option>
                                            <option value="Stand-up Comedy" disabled={selectedCategories.includes("Stand-up Comedy")}>Stand-up Comedy</option>
                                            <option value="Steamy Romantic Movies" disabled={selectedCategories.includes("Steamy Romantic Movies")}>Steamy Romantic Movies</option>
                                            <option value="Steamy Thrillers" disabled={selectedCategories.includes("Steamy Thrillers")}>Steamy Thrillers</option>
                                            <option value="Supernatural Horror Movies" disabled={selectedCategories.includes("Supernatural Horror Movies")}>Supernatural Horror Movies</option>
                                            <option value="Supernatural Thrillers" disabled={selectedCategories.includes("Supernatural Thrillers")}>Supernatural Thrillers</option>
                                            <option value="Tearjerkers" disabled={selectedCategories.includes("Tearjerkers")}>Tearjerkers</option>
                                            <option value="Teen Comedies" disabled={selectedCategories.includes("Teen Comedies")}>Teen Comedies</option>
                                            <option value="Teen Dramas" disabled={selectedCategories.includes("Teen Dramas")}>Teen Dramas</option>
                                            <option value="Teen Screams" disabled={selectedCategories.includes("Teen Screams")}>Teen Screams</option>
                                            <option value="Teen TV Shows" disabled={selectedCategories.includes("Teen TV Shows")}>Teen TV Shows</option>
                                            <option value="Thrillers" disabled={selectedCategories.includes("Thrillers")}>Thrillers</option>
                                            <option value="Travel & Adventure Documentaries" disabled={selectedCategories.includes("Travel & Adventure Documentaries")}>Travel & Adventure Documentaries</option>
                                            <option value="TV Action & Adventure" disabled={selectedCategories.includes("TV Action & Adventure")}>TV Action & Adventure</option>
                                            <option value="TV Cartoons" disabled={selectedCategories.includes("TV Cartoons")}>TV Cartoons</option>
                                            <option value="TV Comedies" disabled={selectedCategories.includes("TV Comedies")}>TV Comedies</option>
                                            <option value="TV Documentaries" disabled={selectedCategories.includes("TV Documentaries")}>TV Documentaries</option>
                                            <option value="TV Dramas" disabled={selectedCategories.includes("TV Dramas")}>TV Dramas</option>
                                            <option value="TV Horror" disabled={selectedCategories.includes("TV Horror")}>TV Horror</option>
                                            <option value="TV Mysteries" disabled={selectedCategories.includes("TV Mysteries")}>TV Mysteries</option>
                                            <option value="TV Sci-Fi & Fantasy" disabled={selectedCategories.includes("TV Sci-Fi & Fantasy")}>TV Sci-Fi & Fantasy</option>
                                            <option value="TV Shows" disabled={selectedCategories.includes("TV Shows")}>TV Shows</option>
                                            <option value="Urban & Dance Concerts" disabled={selectedCategories.includes("Urban & Dance Concerts")}>Urban & Dance Concerts</option>
                                            <option value="Vampire Horror Movies" disabled={selectedCategories.includes("Vampire Horror Movies")}>Vampire Horror Movies</option>
                                            <option value="Werewolf Horror Movies" disabled={selectedCategories.includes("Werewolf Horror Movies")}>Werewolf Horror Movies</option>
                                            <option value="Westerns" disabled={selectedCategories.includes("Westerns")}>Westerns</option>
                                            <option value="World Music Concerts" disabled={selectedCategories.includes("World Music Concerts")}>World Music Concerts</option>
                                            <option value="Zombie Horror Movies" disabled={selectedCategories.includes("Zombie Horror Movies")}>Zombie Horror Movies</option>
                                        </select>
                                        <div className="selected-options mt-3">
                                            {selectedCategories.length > 0 && (
                                                <div>
                                                    <p>Selected Categories:</p>
                                                    <ul className="list-unstyled">
                                                        {selectedCategories.map(category => (
                                                            <li key={category} className="mb-2" style={{ display: "inline-block", paddingLeft: "5px", paddingRight: "5px" }}>
                                                                <span className="badge bg-primary">
                                                                    {category}
                                                                    <button
                                                                        type="button"
                                                                        className="btn-close ms-2"
                                                                        aria-label="Close"
                                                                        onClick={() => handleRemoveCategory(category)}
                                                                    ></button>
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className=" mt-3 ">
                                        <label htmlFor="">Movie Title</label>
                                        <input type="text" value={movieTitle} onChange={(e) => setMovieTitle(e.target.value)} className='form-control'  required/>
                                    </div>

                                    <div className="form-group mt-3 ">
                                        <label htmlFor="">Movie Description</label>
                                        <textarea
                                            className='form-control'
                                            value={movieDescription}
                                            onChange={(e) => setMovieDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="file">Movie Thubmnai</label>
                                        <input type="file" onChange={handleThumbnailChange} className='form-control' required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="">Movie File</label>
                                        <input type="file" onChange={handleVideoChange} className='form-control' required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <input type="submit" className={disabledd ? 'button-disabled' : 'button'}  disabled={disabledd}/>
                                    </div>
                                </form>
                                {progressComplete === false && videoProgress > 0 &&
                                    <p style={{ backgroundColor: "red", borderRadius: "5px", textAlign: "center", color: "whitesmoke" }}>Video Upload Progress: {videoProgress}%</p>}
                                {progressComplete === true && <p style={{ backgroundColor: "green", borderRadius: "5px", textAlign: "center", color: "whitesmoke", padding: 8 }}>Video uploaded successfully but wait for upload to server. This may take a few seconds or a few minutes. Please wait.</p>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Movie
