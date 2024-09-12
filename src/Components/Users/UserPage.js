import React, { useState } from 'react'
import axios from 'axios';
import { Link } from "react-router-dom";
import '../../styles/User.css'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';
import SideNavbar from '../SideNav/SideNavbar';
import { useEffect } from 'react';
import { baseURL } from '../../Utils/Utils';

const UserPage = () => {

    const token = useSelector(state => state.user.token)

    const Dispatch = useDispatch();
    const handleLogout = ()=>{
        Dispatch(logout())

    }

    const [allUsers, setAllUsers] = useState([])

    useEffect(()=>{
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${baseURL}api/user/get-all-user`,
                headers: { 
                  'Authorization': `Bearer ${token}`,
                }
            };
              
            axios.request(config)
            .then((response) => {
                console.log(response.data);
                setAllUsers(response.data.data)
            })
            .catch((error) => {
                console.log(error);
            });
        
    }, [])

    return (
        <div className="container-fluid">
            <div className="row roww">
            <SideNavbar/>

                <div className="col-md-9 col-sm-8">
                    <div className='userHeading d-flex shadow-lgg mb-3' style={{justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                        <h3 className='text-danger' style={{fontFamily:"fantasy",textDecoration:"underline"}}>All User Info</h3>

                        </div>
                        <div className='logoutDiv'>
                            <Link to="/" style={{textDecoration:"none",color:"black"}}>
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <span onClick={handleLogout}>Log-Out</span>
                            </Link>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3 col-sm-4">
                            <div className="mainCard">
                                <div className="cardTitle d-flex">
                                    <div className='iconDiv'>
                                        <i className="fa-sharp fa-solid fa-users"></i>
                                    </div>
                                    <div style={{ color: "black", fontSize: 20, fontWeight: 500 }}>
                                        Active Users
                                    </div>
                                </div>
                                <p className='userCountDiv'>{allUsers.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-5" style={{border:'1px solid black',borderRadius:'10px'}}>
                            <h3 className='text-center' style={{fontFamily:"fantasy"}}>User List</h3>
                            <table className="table userTable table-dark">
                                {
                                    allUsers.length > 0 ? (
                                        <>
                                        <thead>
                                    <tr className='text-center'>
                                        <th scope="col">ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Email</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    {
                                        allUsers.map((e, i)=>{
                                            return(
                                                <tr>
                                                    <th scope="row">{i+1}</th>
                                                    <td>{e.name}</td>
                                                    <td>{e.email}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                                </>
                                    ) : (
                                        <p style={{color:"black", textAlign:"center", fontWeight:700, fontSize:"22px"}}>Loading ...</p>
                                    )
                                }
                                
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserPage
