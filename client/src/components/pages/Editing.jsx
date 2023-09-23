import React, { useEffect, useState } from 'react'
import '../assets/CSS/Editing.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoPersonCircleSharp, } from "react-icons/io5";
import { VscHome, VscDeviceCamera } from "react-icons/vsc";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { BsFillPersonFill } from "react-icons/bs";
import { MdSaveAlt, MdLogout } from "react-icons/md";
import { PiPlusBold } from "react-icons/pi";
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { FiDelete } from 'react-icons/fi';

import one from '../assets/templates/one.pdf';
import two from '../assets/templates/two.pdf';
import three from '../assets/templates/three.pdf';
import four from '../assets/templates/four.pdf';
import five from '../assets/templates/five.pdf';
import six from '../assets/templates/six.pdf';
import seven from '../assets/templates/seven.pdf';
import eight from '../assets/templates/eight.pdf';
import nine from '../assets/templates/nine.pdf';
import ten from '../assets/templates/ten.pdf';
import eleven from '../assets/templates/eleven.pdf';
import twelve from '../assets/templates/twelve.pdf';
import none from '../assets/templates/my cv.pdf';

// images
import givenProfile from '../assets/images/givenProfile.webp';

import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import axios from 'axios';
import BackendURL from './backend URL/BackendURL';

function Editing() {
    const navigate = useNavigate();
    const location = useLocation();

    const backendUrl = BackendURL();
    const token = localStorage.getItem('token');

    const [isLoading, setIsLoading] = useState(true);
    const [userCredentials, setUserCredentials] = useState('');
    const [profileUpload, setProfileUpload] = useState([]);
    const [autoFetchChecker, setAutoFetchChecker] = useState(false);

    // error message
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    // #####################################################    AUTO PROFILE IMAGE UPLOAD    ########################################
    useEffect(() => {
        if (profileUpload) {
            if (profileUpload.length === 0) {
                // console.log('nothing change!')
            }
            else {
                setIsLoading(true);
                const autoUpload = async () => {

                    const requestImageToUpload = new FormData();
                    requestImageToUpload.append('image', profileUpload);
                    requestImageToUpload.append('userId', userCredentials[0].id);

                    try {
                        const response = await axios.post(`${backendUrl}/api/auto-image-upload`, requestImageToUpload, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (response.status === 200) {
                            setIsLoading(false);
                            setAutoFetchChecker(autoFetchChecker ? false : true);


                            setErrorMessage(response.data.message);
                            setIsSuccess(true);

                            setTimeout(() => {
                                setIsSuccess(false);
                            }, 5000);
                        }
                    } catch (error) {
                        setIsLoading(false);
                        if (error.response && error.response.status === 401) {
                            setErrorMessage(error.response.data.message);
                            setIsError(true);

                            setTimeout(() => {
                                setIsError(false);
                            }, 5000);
                        } else {
                            console.log('Error: ', error);
                        }
                    }
                };
                autoUpload();
            }
        }
    }, [profileUpload]);

    // #####################################################    FETCH USER DATA    ########################################
    useEffect(() => {
        if (token !== "") {
            const checkProtected = async () => {
                setIsLoading(true);
                try {
                    const response = await axios.get(`${backendUrl}/protected`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.status === 200) {
                        const userId = (response.data.user.id).toString();

                        const fetchUserCredentials = async () => {
                            try {
                                const response = await axios.post(`${backendUrl}/fetch/api/credentials`, { userId }, {
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });
                                if (response.status === 200) {
                                    setUserCredentials(response.data.message);
                                    setIsLoading(false);
                                }
                            } catch (error) {
                                setIsLoading(false);
                                if (error.response && error.response.status === 401) {
                                    console.log(error.response.data.message);
                                } else {
                                    console.log('Error: ', error);
                                }
                            }
                        }
                        fetchUserCredentials();
                    }

                } catch (error) {
                    setIsLoading(false);
                    if (error.response && error.response.status === 401) {
                        console.log(error.response.data.message);
                    } else {
                        console.log('Error: ', error);
                    }
                }
            }
            checkProtected();
        }
    }, [token, autoFetchChecker]);

    const { data } = location.state || {};

    const [viewPdf, setViewPdf] = useState(null);

    useEffect(() => {
        if (data === "none") {
            setViewPdf(none);
        }
        else if (data === "one") {
            setViewPdf(one);
        }
        else if (data === "two") {
            setViewPdf(two);
        }
        else if (data === "three") {
            setViewPdf(three);
        }
        else if (data === "four") {
            setViewPdf(four);
        }
        else if (data === "five") {
            setViewPdf(five);
        }
        else if (data === "six") {
            setViewPdf(six);
        }
        else if (data === "seven") {
            setViewPdf(seven);
        }
        else if (data === "eight") {
            setViewPdf(eight);
        }
        else if (data === "nine") {
            setViewPdf(nine);
        }
        else if (data === "ten") {
            setViewPdf(ten);
        }
        else if (data === "eleven") {
            setViewPdf(eleven);
        }
        else if (data === "twelve") {
            setViewPdf(twelve);
        }
    }, []);

    const [isProfile, setIsProfile] = useState(false);
    const [isProfileClicked, setIsProfileClicked] = useState(false);
    const [profileList, setProfileList] = useState(false);
    const [employmentHistory, setEmploymentHistory] = useState(true);
    const [educationBackground, setEducationBackground] = useState(true);
    const [skillsList, setSkillList] = useState(true);
    const [languageList, setLanguageList] = useState(true);
    const [objectives, setObjectives] = useState(true);
    const [preview, setPreview] = useState(false);
    const [isSocialLinks, setIsSocialLinks] = useState(true);

    const [educationList, setEducationList] = useState({
        second: false,
        third: false,
        testing: false
    });

    // Social and Links
    const [socialName, setSocialName] = useState(['']); // Initialize with one empty skill
    const [socialLinks, setSocialLinks] = useState(['']); // Initialize with one empty skill

    const handleAddSocialLinks = () => {
        setSocialName([...socialName, '']);
        setSocialLinks([...socialLinks, '']);
    }

    const removeSocialLinks = (index) => {
        const updatedSocialName = [...socialName];
        const updatedSocialLinks = [...socialLinks];
        updatedSocialName.splice(index, 1);
        updatedSocialLinks.splice(index, 1);
        setSocialName(updatedSocialName);
        setSocialLinks(updatedSocialLinks);
    };

    const handleSocialLinkChange = (index, value) => {
        const updatedSocial = [...socialName];
        updatedSocial[index] = value;
        setSocialLinks(updatedSocial);
    };

    const handleSocialNameChange = (index, value) => {
        const updatedName = [...socialName];
        updatedName[index] = value;
        setSocialName(updatedName);
    }

    // skills list
    const [skills, setSkills] = useState(['']); // Initialize with one empty skill

    const addSkill = () => {
        setSkills([...skills, '']);
    };

    const removeSkill = (index) => {
        const updatedSkills = [...skills];
        updatedSkills.splice(index, 1);
        setSkills(updatedSkills);
    };

    const handleSkillChange = (index, value) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = value;
        setSkills(updatedSkills);
    };

    //  language list
    const [language, setLanguage] = useState(['']); // Initialize with one empty skill

    const addLanguage = () => {
        setLanguage([...language, '']);
    };

    const removeLanguage = (index) => {
        const updatedSkills = [...language];
        updatedSkills.splice(index, 1);
        setLanguage(updatedSkills);
    };

    const handleLanguage = (index, value) => {
        const updatedSkills = [...language];
        updatedSkills[index] = value;
        setLanguage(updatedSkills);
    };

    return (
        <>
            <div onClick={() => setIsProfile(false)} style={{ pointerEvents: isLoading ? 'none' : '', background: isLoading ? 'rgba(0,0,0,0.6)' : '' }}>
                <div className='container'>
                    <div className="left-side">
                        <div className="overFlow" >
                            <div onClick={() => setProfileList(profileList ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
                                <h3>Personal Details</h3>
                                {profileList ? (
                                    <IoIosArrowDown />
                                ) : (
                                    <IoIosArrowUp />
                                )}
                            </div>
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: profileList ? 'none' : 'block' }}>
                                <div className="left-side-container" style={{ marginTop: '-25px' }}>
                                    <div className="left-left-side">
                                        <div className="form-control">
                                            <span>Wanted Job Title</span>
                                            <input type="text" className='form-input' placeholder='e.g. Programmer' />
                                        </div>
                                        <div className="form-control">
                                            <p>Image</p>
                                            <label htmlFor="fileInput" className="custom-file-input" style={{ marginTop: '-5px' }}>
                                                {/* <span className="icon-container"><IoPersonCircleSharp size={40} className='person-label' /></span> */}
                                                <span className="icon-container"><img className='person-label' src={userCredentials && userCredentials[0].image[0] === "h" ? userCredentials[0].image : userCredentials && userCredentials[0].image[0] && userCredentials[0].image[0].match(/^\d/) ? `${backendUrl}/uploads/${userCredentials[0].image}` : givenProfile} alt="" style={{ borderRadius: '50%', height: '40px', width: '40px', border: '3px solid #ccc' }} /></span>
                                                Upload photo
                                            </label>
                                            <input type="file" id="fileInput" className="form-input" />
                                        </div>
                                        <div className="form-control">
                                            <span>First Name</span>
                                            <input type="text" className='form-input' placeholder='First Name' />
                                        </div>
                                        <div className="form-control">
                                            <span>Middle Name</span>
                                            <input type="text" className='form-input' placeholder='Middle Name' />
                                        </div>
                                        <div className="form-control">
                                            <span>Last Name</span>
                                            <input type="text" className='form-input' placeholder='Last Name' />
                                        </div>
                                        <div className="form-control">
                                            <span>Phone Number</span>
                                            <input type="text" className='form-input' placeholder='Phone Number' />
                                        </div>
                                        <div className="form-control">
                                            <span>Email</span>
                                            <input type="email" className='form-input' placeholder='Your@gmail.com' />
                                        </div>
                                    </div>

                                    <div className="left-right-side">
                                        <div className="form-control">
                                            <span>City</span>
                                            <input type="text" className='form-input' placeholder='City' />
                                        </div>
                                        <div className="form-control">
                                            <span>Country</span>
                                            <input type="text" className='form-input' placeholder='Country' />
                                        </div>
                                        <div className="form-control">
                                            <span>Address</span>
                                            <input type="text" className='form-input' placeholder='Address' />
                                        </div>
                                        <div className="form-control">
                                            <span>Zip Code</span>
                                            <input type="text" className='form-input' placeholder='Zip Code' />
                                        </div>
                                        <div className="form-control">
                                            <span>Nationality</span>
                                            <input type="text" className='form-input' placeholder='Nationality' />
                                        </div>
                                        <div className="form-control">
                                            <span>Place of Birth</span>
                                            <input type="text" className='form-input' placeholder='Place of Birth' />
                                        </div>
                                        <div className="form-control">
                                            <span>Date of Birth</span>
                                            <input type="text" className='form-input' placeholder='Date of Birth' />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Website & Social Links */}
                            <div onClick={() => setIsSocialLinks(isSocialLinks ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
                                <h3>Website & Social Links</h3>
                                {isSocialLinks ? (
                                    <IoIosArrowDown />
                                ) : (
                                    <IoIosArrowUp />
                                )}
                            </div>
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: isSocialLinks ? 'none' : 'block' }}>
                                {socialName.map((name, index) => (
                                    <div key={index} className="left-side-container" style={{ marginTop: index === 0 ? '-25px' : '10px' }}>
                                        <div className="left-left-side">
                                            <div style={{ marginTop: '20px' }}>
                                                <span>Name</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-30px' }}>
                                                <input
                                                    style={{ marginRight: '10px' }}
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="e.g. Resume Generator"
                                                    value={name}
                                                    onChange={(e) => handleSocialNameChange(index, e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="left-right-side social-links">
                                            <div style={{ marginTop: '20px' }}>
                                                <span>Link</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-30px' }}>

                                                <input
                                                    style={{ marginRight: '10px' }}
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="e.g. https://resume-generator-liard.vercel.app/"
                                                    value={socialLinks[index]}
                                                    onChange={(e) => handleSocialLinkChange(index, e.target.value)}
                                                />
                                                <p className="delete-icon" onClick={() => removeSocialLinks(index)}>
                                                    <FiDelete size={25} style={{ marginTop: '4px' }} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="add-more" style={{ marginTop: '50px' }} onClick={handleAddSocialLinks}>
                                    <span><PiPlusBold /> Add more social & links</span>
                                </div>
                            </div>

                            {/* Objectives */}
                            <div onClick={() => setObjectives(objectives ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
                                <h3>Objectives</h3>
                                {objectives ? (
                                    <IoIosArrowDown />
                                ) : (
                                    <IoIosArrowUp />
                                )}
                            </div>
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: objectives ? 'none' : 'block' }}>

                                {/* Description textarea container */}
                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left', marginTop: '0' }}>
                                        <span>Objectives</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Write your objectives here...'></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* EMPLOYMENT HISTORY */}
                            <div onClick={() => setEmploymentHistory(employmentHistory ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
                                <h3>Employment History</h3>
                                {employmentHistory ? (
                                    <IoIosArrowDown />
                                ) : (
                                    <IoIosArrowUp />
                                )}
                            </div>
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: employmentHistory ? 'none' : 'block' }}>
                                <div className="left-side-container" style={{ marginTop: '-25px' }}>
                                    <div className="left-left-side">
                                        <div className="form-control">
                                            <span>Job Title</span>
                                            <input type="text" className='form-input' placeholder='e.g. Programmer' />
                                        </div>
                                        <div className="form-control">
                                            <span>Address</span>
                                            <input type="text" className='form-input' placeholder='Address' />
                                        </div>
                                    </div>

                                    <div className="left-right-side">
                                        <div className="form-control">
                                            <span>Start Date</span>
                                            <input type="date" className='form-input' placeholder='Start Date' />
                                        </div>
                                        <div className="form-control">
                                            <span>End Date</span>
                                            <input type="date" className='form-input' placeholder='End Date' />
                                        </div>
                                    </div>
                                </div>
                                {/* Description textarea container */}
                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left' }}>
                                        <span>Description</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Description'></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* EDUCATION BACKGROUND */}
                            <div onClick={() => setEducationBackground(educationBackground ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', marginBottom: '', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
                                <h3>Education Background</h3>
                                {educationBackground ? (
                                    <IoIosArrowDown />
                                ) : (
                                    <IoIosArrowUp />
                                )}
                            </div>
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: educationBackground ? 'none' : 'block' }}>
                                <div className="left-side-container" style={{ marginTop: '-25px' }}>
                                    <div className="left-left-side">
                                        <div className="form-control">
                                            <span>School</span>
                                            <input type="text" className='form-input' placeholder='School' />
                                        </div>
                                        <div className="form-control">
                                            <span>Education Level</span>
                                            <input type="text" className='form-input' placeholder='e.g College' />
                                        </div>
                                        <div className="form-control">
                                            <span>Address</span>
                                            <input type="text" className='form-input' placeholder='Address' />
                                        </div>
                                    </div>

                                    <div className="left-right-side">
                                        <div className="form-control">
                                            <span>Course <span style={{ color: '#ccc' }}>(Optional for Elementary)</span></span>
                                            <input type="text" className='form-input' placeholder='Course' />
                                        </div>
                                        <div className="form-control">
                                            <span>Start Date</span>
                                            <input type="date" className='form-input' placeholder='Start Date' />
                                        </div>
                                        <div className="form-control">
                                            <span>End Date</span>
                                            <input type="date" className='form-input' placeholder='End Date' />
                                        </div>
                                    </div>
                                </div>
                                {/* Description textarea container */}
                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left' }}>
                                        <span>Description</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Description'></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='add-more' onClick={() => setEducationList((prev) => ({ ...prev, second: true }))} style={{ display: educationBackground || educationList.second ? 'none' : 'block' }}>
                                <span><PiPlusBold /> Add more education</span>
                            </div>

                            {/* another second education */}
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: educationBackground || !educationList.second ? 'none' : 'block' }}>
                                <div onClick={() => setEducationList((prev) => ({ ...prev, second: false }))} style={{ position: 'relative', textAlign: 'right', right: '-10px', cursor: 'pointer', top: '-10px' }}>
                                    <AiOutlineCloseCircle />
                                </div>
                                <div className="left-side-container" style={{ marginTop: '-25px', marginTop: '-40px' }}>
                                    <div className="left-left-side">
                                        <div className="form-control">
                                            <span>School</span>
                                            <input type="text" className='form-input' placeholder='School' />
                                        </div>
                                        <div className="form-control">
                                            <span>Education Level</span>
                                            <input type="text" className='form-input' placeholder='e.g College' />
                                        </div>
                                        <div className="form-control">
                                            <span>Address</span>
                                            <input type="text" className='form-input' placeholder='Address' />
                                        </div>
                                    </div>

                                    <div className="left-right-side">
                                        <div className="form-control">
                                            <span>Course <span style={{ color: '#ccc' }}>(Optional for Elementary)</span></span>
                                            <input type="text" className='form-input' placeholder='Course' />
                                        </div>
                                        <div className="form-control">
                                            <span>Start Date</span>
                                            <input type="date" className='form-input' placeholder='Start Date' />
                                        </div>
                                        <div className="form-control">
                                            <span>End Date</span>
                                            <input type="date" className='form-input' placeholder='End Date' />
                                        </div>
                                    </div>
                                </div>
                                {/* Description textarea container */}
                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left' }}>
                                        <span>Description</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Description'></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='add-more' onClick={() => { setEducationList((prev) => ({ ...prev, third: true })); setEducationList((prev) => ({ ...prev, testing: true })) }} style={{ display: educationBackground || !educationList.third && !educationList.second || educationList.testing ? 'none' : 'block' }}>
                                <span><PiPlusBold /> Add more education</span>
                            </div>

                            {/* another Third education */}
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: educationBackground || !educationList.third ? 'none' : 'block' }}>
                                <div onClick={() => { setEducationList((prev) => ({ ...prev, third: false })); setEducationList((prev) => ({ ...prev, testing: false })) }} style={{ position: 'relative', textAlign: 'right', right: '-10px', cursor: 'pointer', top: '-10px' }}>
                                    <AiOutlineCloseCircle />
                                </div>
                                <div className="left-side-container" style={{ marginTop: '-25px', marginTop: '-40px' }}>
                                    <div className="left-left-side">
                                        <div className="form-control">
                                            <span>School</span>
                                            <input type="text" className='form-input' placeholder='School' />
                                        </div>
                                        <div className="form-control">
                                            <span>Education Level</span>
                                            <input type="text" className='form-input' placeholder='e.g College' />
                                        </div>
                                        <div className="form-control">
                                            <span>Address</span>
                                            <input type="text" className='form-input' placeholder='Address' />
                                        </div>
                                    </div>

                                    <div className="left-right-side">
                                        <div className="form-control">
                                            <span>Course <span style={{ color: '#ccc' }}>(Optional for Elementary)</span></span>
                                            <input type="text" className='form-input' placeholder='Course' />
                                        </div>
                                        <div className="form-control">
                                            <span>Start Date</span>
                                            <input type="date" className='form-input' placeholder='Start Date' />
                                        </div>
                                        <div className="form-control">
                                            <span>End Date</span>
                                            <input type="date" className='form-input' placeholder='End Date' />
                                        </div>
                                    </div>
                                </div>
                                {/* Description textarea container */}
                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left' }}>
                                        <span>Description</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Description'></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div onClick={() => setSkillList(skillsList ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
                                <h3>Skills</h3>
                                {skillsList ? (
                                    <IoIosArrowDown />
                                ) : (
                                    <IoIosArrowUp />
                                )}
                            </div>
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: skillsList ? 'none' : 'block' }}>
                                {skills.map((skill, index) => (
                                    <div key={index} className="left-side-container" style={{ marginTop: index === 0 ? '-25px' : '10px' }}>
                                        <div className="left-left-side">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-30px', marginTop: '10px' }}>
                                                <input
                                                    style={{ marginRight: '10px' }}
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="e.g. React.js"
                                                    value={skill}
                                                    onChange={(e) => handleSkillChange(index, e.target.value)}
                                                />
                                                <p className="delete-icon" onClick={() => removeSkill(index)}>
                                                    <FiDelete size={25} style={{ marginTop: '4px' }} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="add-more" style={{ marginTop: '50px' }} onClick={addSkill}>
                                    <span><PiPlusBold /> Add more skill</span>
                                </div>
                            </div>

                            {/* Language */}
                            <div onClick={() => setLanguageList(languageList ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
                                <h3>Language</h3>
                                {languageList ? (
                                    <IoIosArrowDown />
                                ) : (
                                    <IoIosArrowUp />
                                )}
                            </div>
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: languageList ? 'none' : 'block' }}>
                                {language.map((skill, index) => (
                                    <div key={index} className="left-side-container" style={{ marginTop: index === 0 ? '-25px' : '10px' }}>
                                        <div className="left-left-side">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-30px', marginTop: '10px' }}>
                                                <input
                                                    style={{ marginRight: '10px' }}
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="e.g. English"
                                                    value={skill}
                                                    onChange={(e) => handleLanguage(index, e.target.value)}
                                                />
                                                <p className="delete-icon" onClick={() => removeLanguage(index)}>
                                                    <FiDelete size={25} style={{ marginTop: '4px' }} />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="add-more" style={{ marginTop: '50px' }} onClick={addLanguage}>
                                    <span><PiPlusBold /> Add more language</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={preview ? 'right-side-responsive' : 'right-side'} style={{ animation: preview ? 'animatePreview .4s linear' : 'animateClose .4s linear' }}>
                        <div className='close-preview' onClick={() => setPreview(false)} style={{ display: preview ? 'block' : 'none' }}>
                            <AiOutlineCloseCircle size={30} />
                        </div>
                        <div className='imageSample'>
                            <div className='imageSample-img'>
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.10.111/build/pdf.worker.min.js">
                                    {viewPdf ? (
                                        <Viewer fileUrl={viewPdf} />
                                    ) : (
                                        <>
                                            No PDF
                                        </>
                                    )}
                                </Worker>
                                <div className="download-button">
                                    <button>Download</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="profile-header" onClick={(e) => { e.stopPropagation(); setIsProfile(isProfile ? false : true) }}>
                    {/* <IoPersonCircleSharp size={35} className='profiles' /> */}
                    <img className='profile' src={userCredentials && userCredentials[0].image[0] === "h" ? userCredentials[0].image : userCredentials && userCredentials[0].image[0] && userCredentials[0].image[0].match(/^\d/) ? `${backendUrl}/uploads/${userCredentials[0].image}` : givenProfile} alt="" style={{ borderRadius: '50%', height: '40px', width: '40px', border: '3px solid #ccc' }} />
                </div>
                <div onClick={(e) => e.stopPropagation()} style={{ display: isProfile ? 'block' : 'none', animation: isProfile ? 'profileView .1s linear' : '' }} className='profile-popup'>
                    <div className='profile-list' onClick={() => { setIsProfileClicked(true); setIsProfile(false) }}>
                        <span>< BsFillPersonFill /> {userCredentials && userCredentials[0].fullname}</span>
                    </div>
                    <div className='profile-list' onClick={() => { navigate('/'); sessionStorage.setItem('started', false) }}>
                        <span><VscHome /> Go to Dashboard</span>
                    </div>
                    <div className='profile-list'>
                        <span><MdSaveAlt /> Saved File</span>
                    </div>
                    <hr />
                    <div className="profile-list" style={{ marginTop: '5px' }} onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
                        <span><MdLogout /> Logout</span>
                    </div>
                </div>
                <div className="responsive-file" onClick={() => setPreview(true)}>
                    <span style={{ color: 'darkcyan' }}>Preview</span>
                </div>

                {/* Profile Account */}
                <div onClick={() => setIsProfileClicked(false)} className='popup' style={{ visibility: isProfileClicked ? 'visible' : 'hidden' }} >

                    {/* Register page */}
                    <div onClick={(e) => e.stopPropagation()} className='popup-body' style={{ animation: isProfileClicked ? 'dropBottom .3s linear' : '' }} >
                        <div className="modal-close" onClick={() => setIsProfileClicked(false)}>
                            <AiOutlineCloseCircle size={30} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <img src={userCredentials && userCredentials[0].image[0] === "h" ? userCredentials[0].image : userCredentials && userCredentials[0].image[0] && userCredentials[0].image[0].match(/^\d/) ? `${backendUrl}/uploads/${userCredentials[0].image}` : givenProfile} alt="" style={{ borderRadius: '50%', height: '130px', width: '130px', border: '3px solid #ccc' }} />
                            <label htmlFor="uploadPhoto" style={{ marginTop: '100px', marginLeft: '-40px', cursor: 'pointer', zIndex: '3', color: 'white' }}>
                                <VscDeviceCamera size={30} style={{ backgroundColor: 'rgb(71, 71, 98)', padding: '3px', borderRadius: '50%' }} />
                                <input type="file" id="uploadPhoto" onChange={(e) => setProfileUpload(e.target.files[0])} style={{ display: 'none' }} />
                            </label>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div>
                                <h2>{userCredentials && userCredentials[0].fullname}</h2>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <span>{userCredentials && userCredentials[0].email}</span>
                            </div><br />
                        </div>
                        <hr />
                        <div className="form-control" style={{ textAlign: 'center' }}>
                            <span>Other profile view</span>
                        </div>
                        <div className="form-control" style={{ textAlign: 'center' }}>
                            <span>(User position)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* fetching data screen */}
            <div className="modal-pop-up-loading" style={{ display: isLoading ? 'block' : 'none' }}>
                <div className="modal-pop-up-loading-spiner"></div>
                <p>Loading...</p>
            </div>

            {/* Loading div */}
            <div className='error-respond' style={{ display: isError || isSuccess ? 'block' : 'none', backgroundColor: isSuccess && !isError ? '#7b4ae4' : '#fb7d60' }}>
                <div>
                    <h5>{errorMessage}</h5>
                </div>
            </div>
        </>
    )
}

export default Editing
