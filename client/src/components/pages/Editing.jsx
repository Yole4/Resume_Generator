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
import { TbDownload } from 'react-icons/tb';
import { LuRefreshCw } from 'react-icons/lu';

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
    const [resumeData, setResumeData] = useState('');
    const [forResume, setForResume] = useState(false);

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

                                    const fetchResume = async () => {
                                        try {

                                            const response = await axios.post(`${backendUrl}/api/get-resume-data`, { userId }, {
                                                headers: {
                                                    'Authorization': `Bearer ${token}`
                                                }
                                            });

                                            if (response.status === 200) {
                                                const resumeResponseData = response.data.message;
                                                setIsLoading(false);
                                                setFetchLoading(false);
                                                setResumeData(resumeResponseData);
                                                setForResume(forResume ? false : true);
                                                setPersonalDetails((prev) => ({
                                                    ...prev, firstName: resumeResponseData[0].first_name,
                                                    middleName: resumeResponseData[0].middle_name,
                                                    lastName: resumeResponseData[0].last_name,
                                                    phoneNumber: resumeResponseData[0].phone_number,
                                                    address: resumeResponseData[0].address,
                                                    email: resumeResponseData[0].email,
                                                    course: resumeResponseData[0].course,
                                                    gender: resumeResponseData[0].gender,
                                                    civilStatus: resumeResponseData[0].civil_status,
                                                    religion: resumeResponseData[0].religion,
                                                    nationality: resumeResponseData[0].nationality,
                                                    placeOfBirth: resumeResponseData[0].place_of_birth,
                                                    age: resumeResponseData[0].age,
                                                    birthDate: resumeResponseData[0].birth_date,
                                                    objectives: resumeResponseData[0].objectives,
                                                }));

                                                setIsGenerate(true);
                                            }

                                        } catch (error) {
                                            setIsLoading(false);
                                            setFetchLoading(false);
                                            if (error.response && error.response.status === 401) {
                                                console.log(error.response.data.message);
                                            } else {
                                                console.log('Error: ', error);
                                            }
                                        }
                                    }
                                    fetchResume();
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

    // others designs
    const { data } = location.state || {};

    const [viewPdf, setViewPdf] = useState(null);
    useEffect(() => {
        if (resumeData && resumeData[0].file_name.length > 0) {
            setViewPdf(`${backendUrl}/pdfFiles/${resumeData[0].file_name}`);
        }
    }, [forResume]);

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

    // // skills list
    // const [skills, setSkills] = useState(['']); // Initialize with one empty skill

    // const addSkill = () => {
    //     setSkills([...skills, '']);
    // };

    // const removeSkill = (index) => {
    //     const updatedSkills = [...skills];
    //     updatedSkills.splice(index, 1);
    //     setSkills(updatedSkills);
    // };

    // const handleSkillChange = (index, value) => {
    //     const updatedSkills = [...skills];
    //     updatedSkills[index] = value;
    //     setSkills(updatedSkills);
    // };

    // ######################################################   SKILLS STATE    #############################################################
    const [computerLiterate, setComputerLiterate] = useState(['']);
    const [programming, setProgramming] = useState(['']);
    const [webDevelopment, setWebDevelopment] = useState(['']);
    const [database, setDatabase] = useState(['']);

    // computer literate
    const addComputerLiterate = () => {
        setComputerLiterate([...computerLiterate, '']);
    };
    const removeComputerLiterate = (index) => {
        const updatedSkills = [...computerLiterate];
        updatedSkills.splice(index, 1);
        setComputerLiterate(updatedSkills);
    };
    const handleComputerLiterateChange = (index, value) => {
        const updatedSkills = [...computerLiterate];
        updatedSkills[index] = value;
        setComputerLiterate(updatedSkills);
    };

    // programming
    const addProgramming = () => {
        setProgramming([...programming, '']);
    };
    const removeProgramming = (index) => {
        const updatedSkills = [...programming];
        updatedSkills.splice(index, 1);
        setProgramming(updatedSkills);
    };
    const handleProgrammingChange = (index, value) => {
        const updatedSkills = [...programming];
        updatedSkills[index] = value;
        setProgramming(updatedSkills);
    };

    // web development
    const addWebDevelopment = () => {
        setWebDevelopment([...webDevelopment, '']);
    };
    const removeDevelopment = (index) => {
        const updatedSkills = [...webDevelopment];
        updatedSkills.splice(index, 1);
        setWebDevelopment(updatedSkills);
    };
    const handleWebDevelopmentChange = (index, value) => {
        const updatedSkills = [...webDevelopment];
        updatedSkills[index] = value;
        setWebDevelopment(updatedSkills);
    };

    // database
    const addDatabase = () => {
        setDatabase([...database, '']);
    };
    const removeDatabase = (index) => {
        const updatedSkills = [...database];
        updatedSkills.splice(index, 1);
        setDatabase(updatedSkills);
    };
    const handleDatabaseChange = (index, value) => {
        const updatedSkills = [...database];
        updatedSkills[index] = value;
        setDatabase(updatedSkills);
    };



    //  #####################################################################   LANGUAGE STATE  #################################################################
    const [language, setLanguage] = useState(['']);

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

    // ##############################################################   EDITING AUTO REQUEST    ###################################################################################
    const [personalDetails, setPersonalDetails] = useState({
        // image: [],
        firstName: '',
        middleName: '',
        lastName: '',
        phoneNumber: '',
        address: '',
        email: '',
        course: '',
        gender: '',
        civilStatus: '',
        religion: '',
        nationality: '',
        placeOfBirth: '',
        age: '',
        birthDate: '',
        objectives: '',
    });
    const [fetchLoading, setFetchLoading] = useState(false);
    const [isGenerate, setIsGenerate] = useState(false);

    const generateResume = async (e) => {
        e.preventDefault();

        setFetchLoading(true);
        const userId = userCredentials[0].id;
        const dataRequest = { personalDetails, computerLiterate, webDevelopment, programming, database, language, userId };

        try {
            const response = await axios.post(`${backendUrl}/api/auto-fetch-document`, dataRequest, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                // console.log("success");
                setAutoFetchChecker(autoFetchChecker ? false : true);
                setFetchLoading(false);
                setIsGenerate(true);
                setViewPdf('');
            }
        } catch (error) {
            setFetchLoading(false);
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
    }

    useEffect(() => {
        if (personalDetails || computerLiterate || programming || webDevelopment || database || language) {
            setIsGenerate(false);
        } else {
            setIsGenerate(true);
        }
    }, [personalDetails, computerLiterate, programming, webDevelopment, database, language]);

    // #######################################  DOWNLOAD RESUME ####################################################    
    const downloadResume = async () => {
        const pdfUrl = viewPdf;

        try {
            // Fetch the PDF file
            const response = await fetch(pdfUrl);

            // Check if the response is successful
            if (response.ok) {
                // Convert the response to a blob
                const pdfBlob = await response.blob();

                // Create a URL for the blob
                const pdfBlobUrl = URL.createObjectURL(pdfBlob);

                // Create an invisible link and trigger the download
                const link = document.createElement('a');
                link.href = pdfBlobUrl;
                link.download = `${personalDetails.lastName} ${personalDetails.firstName} ${personalDetails.middleName}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up the URL object after download
                URL.revokeObjectURL(pdfBlobUrl);
            } else {
                console.error('Failed to fetch the PDF:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('An error occurred while fetching the PDF:', error);
        }
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
                                        {/* <div className="form-control">
                                            <span>Wanted Job Title</span>
                                            <input type="text" className='form-input' placeholder='e.g. Programmer' />
                                        </div> */}
                                        <div className="form-control">
                                            <p>Image</p>
                                            <label htmlFor="fileInput" className="custom-file-input" style={{ marginTop: '-5px' }}>
                                                {/* <span className="icon-container"><IoPersonCircleSharp size={40} className='person-label' /></span> */}
                                                <span className="icon-container"><img className='person-label' src={userCredentials && userCredentials[0].image[0] === "h" ? userCredentials[0].image : userCredentials && userCredentials[0].image[0] && userCredentials[0].image[0].match(/^\d/) ? `${backendUrl}/assets/image uploads/${userCredentials[0].image}` : givenProfile} alt="" style={{ borderRadius: '50%', height: '40px', width: '40px', border: '3px solid #ccc' }} /></span>
                                                Upload photo
                                            </label>
                                            <input type="file" id="fileInput" className="form-input" />
                                        </div>
                                        <div className="form-control">
                                            <span>First Name</span>
                                            <input type="text" className='form-input' value={personalDetails.firstName} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, firstName: e.target.value }))} placeholder='First Name' />
                                        </div>
                                        <div className="form-control">
                                            <span>Middle Name</span>
                                            <input type="text" className='form-input' placeholder='Middle Name' value={personalDetails.middleName} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, middleName: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Last Name</span>
                                            <input type="text" className='form-input' placeholder='Last Name' value={personalDetails.lastName} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, lastName: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Address</span>
                                            <input type="text" className='form-input' placeholder='Address' value={personalDetails.address} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, address: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Phone Number</span>
                                            <input type="number" className='form-input' placeholder='Phone Number' value={personalDetails.phoneNumber} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, phoneNumber: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Email</span>
                                            <input type="email" className='form-input' placeholder='Your@gmail.com' value={personalDetails.email} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, email: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Course</span>
                                            <input type="text" className='form-input' placeholder='e.g BS Computer Science' value={personalDetails.course} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, course: e.target.value }))} />
                                        </div>
                                    </div>

                                    <div className="left-right-side">
                                        <div className="form-control">
                                            <span>Gender</span>
                                            <select name="" id="" className='form-input' value={personalDetails.gender} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, gender: e.target.value }))}>
                                                <option value="" disabled>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Gay">Gay</option>
                                                <option value="Lesbian">Lesbian</option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <span>Civil Status</span>
                                            <select name="" id="" className='form-input' value={personalDetails.civilStatus} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, civilStatus: e.target.value }))}>
                                                <option value="" disabled>Select Civil Status</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                                <option value="divorced">divorced</option>
                                                <option value="widowed">widowed</option>
                                                <option value="Complicated">Complicated</option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <span>Religion</span>
                                            <input type="text" className='form-input' placeholder='Religion' value={personalDetails.religion} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, religion: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Nationality</span>
                                            <input type="text" className='form-input' placeholder='Nationality' value={personalDetails.nationality} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, nationality: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Place of Birth</span>
                                            <input type="text" className='form-input' placeholder='Place of Birth' value={personalDetails.placeOfBirth} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, placeOfBirth: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Age</span>
                                            <input type="number" className='form-input' placeholder='Age' value={personalDetails.age} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, age: e.target.value }))} />
                                        </div>
                                        <div className="form-control">
                                            <span>Birth Date</span>
                                            <input type="date" className='form-input' placeholder='Birth Date' value={personalDetails.birthDate} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, birthDate: e.target.value }))} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Website & Social Links */}
                            {/* <div onClick={() => setIsSocialLinks(isSocialLinks ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
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
                            </div> */}

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
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Write your objectives here...' value={personalDetails.objectives} onChange={(e) => setPersonalDetails((prev) => ({ ...prev, objectives: e.target.value }))}></textarea>
                                    </div>
                                </div>
                            </div>

                            {/* EMPLOYMENT HISTORY */}
                            {/* <div onClick={() => setEmploymentHistory(employmentHistory ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
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

                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left' }}>
                                        <span>Description</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Description'></textarea>
                                    </div>
                                </div>
                            </div> */}

                            {/* EDUCATION BACKGROUND */}
                            {/* <div onClick={() => setEducationBackground(educationBackground ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', marginBottom: '', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
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

                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left' }}>
                                        <span>Description</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Description'></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='add-more' onClick={() => setEducationList((prev) => ({ ...prev, second: true }))} style={{ display: educationBackground || educationList.second ? 'none' : 'block' }}>
                                <span><PiPlusBold /> Add more education</span>
                            </div> */}

                            {/* another second education */}
                            {/* <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: educationBackground || !educationList.second ? 'none' : 'block' }}>
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

                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left' }}>
                                        <span>Description</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Description'></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className='add-more' onClick={() => { setEducationList((prev) => ({ ...prev, third: true })); setEducationList((prev) => ({ ...prev, testing: true })) }} style={{ display: educationBackground || !educationList.third && !educationList.second || educationList.testing ? 'none' : 'block' }}>
                                <span><PiPlusBold /> Add more education</span>
                            </div> */}

                            {/* another Third education */}
                            {/* <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '10px', display: educationBackground || !educationList.third ? 'none' : 'block' }}>
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

                                <div className="description-container">
                                    <div className="form-control" style={{ textAlign: 'left' }}>
                                        <span>Description</span>
                                        <textarea name="" id="" cols="30" rows="8" style={{ height: 'auto', padding: '10px' }} className='form-input' placeholder='Description'></textarea>
                                    </div>
                                </div>
                            </div> */}

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
                                {/* Computer Literate */}
                                <div style={{ border: '2px solid #F1F2F6', padding: '10px', borderRadius: '4px' }}>
                                    <h3 style={{ marginBottom: '20px' }}>Computer Literate</h3>
                                    {computerLiterate.map((skill, index) => (
                                        <div key={index} className="left-side-container" style={{ marginTop: index === 0 ? '-25px' : '10px' }}>
                                            <div className="left-left-side">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-30px', marginTop: '10px' }}>
                                                    <input
                                                        style={{ marginRight: '10px' }}
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="e.g. React.js"
                                                        value={skill}
                                                        onChange={(e) => handleComputerLiterateChange(index, e.target.value)}
                                                    />
                                                    <p className="delete-icon" onClick={() => removeComputerLiterate(index)}>
                                                        <FiDelete size={25} style={{ marginTop: '4px' }} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="add-more" style={{ marginTop: '50px' }} onClick={addComputerLiterate}>
                                        <span><PiPlusBold /> Add more skill</span>
                                    </div>
                                </div>

                                {/* Programming */}
                                <div style={{ border: '2px solid #F1F2F6', padding: '10px', borderRadius: '4px', marginTop: '15px' }}>
                                    <h3 style={{ marginBottom: '20px' }}>Programming</h3>
                                    {programming.map((skill, index) => (
                                        <div key={index} className="left-side-container" style={{ marginTop: index === 0 ? '-25px' : '10px' }}>
                                            <div className="left-left-side">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-30px', marginTop: '10px' }}>
                                                    <input
                                                        style={{ marginRight: '10px' }}
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="e.g. React.js"
                                                        value={skill}
                                                        onChange={(e) => handleProgrammingChange(index, e.target.value)}
                                                    />
                                                    <p className="delete-icon" onClick={() => removeProgramming(index)}>
                                                        <FiDelete size={25} style={{ marginTop: '4px' }} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="add-more" style={{ marginTop: '50px' }} onClick={addProgramming}>
                                        <span><PiPlusBold /> Add more skill</span>
                                    </div>
                                </div>

                                {/* Web Development */}
                                <div style={{ border: '2px solid #F1F2F6', padding: '10px', borderRadius: '4px', marginTop: '15px' }}>
                                    <h3 style={{ marginBottom: '20px' }}>Web Development</h3>
                                    {webDevelopment.map((skill, index) => (
                                        <div key={index} className="left-side-container" style={{ marginTop: index === 0 ? '-25px' : '10px' }}>
                                            <div className="left-left-side">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-30px', marginTop: '10px' }}>
                                                    <input
                                                        style={{ marginRight: '10px' }}
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="e.g. React.js"
                                                        value={skill}
                                                        onChange={(e) => handleWebDevelopmentChange(index, e.target.value)}
                                                    />
                                                    <p className="delete-icon" onClick={() => removeDevelopment(index)}>
                                                        <FiDelete size={25} style={{ marginTop: '4px' }} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="add-more" style={{ marginTop: '50px' }} onClick={addWebDevelopment}>
                                        <span><PiPlusBold /> Add more skill</span>
                                    </div>
                                </div>

                                {/* Database */}
                                <div style={{ border: '2px solid #F1F2F6', padding: '10px', borderRadius: '4px', marginTop: '15px' }}>
                                    <h4 style={{ marginBottom: '20px' }}>Database</h4>
                                    {database.map((skill, index) => (
                                        <div key={index} className="left-side-container" style={{ marginTop: index === 0 ? '-25px' : '10px' }}>
                                            <div className="left-left-side">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-30px', marginTop: '10px' }}>
                                                    <input
                                                        style={{ marginRight: '10px' }}
                                                        type="text"
                                                        className="form-input"
                                                        placeholder="e.g. React.js"
                                                        value={skill}
                                                        onChange={(e) => handleDatabaseChange(index, e.target.value)}
                                                    />
                                                    <p className="delete-icon" onClick={() => removeDatabase(index)}>
                                                        <FiDelete size={25} style={{ marginTop: '4px' }} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="add-more" style={{ marginTop: '50px' }} onClick={addDatabase}>
                                        <span><PiPlusBold /> Add more skill</span>
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            {/* <div onClick={() => setSkillList(skillsList ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%' }}>
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
                            </div> */}

                            {/* Language */}
                            <div onClick={() => setLanguageList(languageList ? false : true)} style={{ cursor: 'pointer', display: 'flex', marginTop: '30px', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F1F2F6', borderRadius: '5px', padding: '10px', width: '100%', marginBottom: '20px' }}>
                                <h3>Language</h3>
                                {languageList ? (
                                    <IoIosArrowDown />
                                ) : (
                                    <IoIosArrowUp />
                                )}
                            </div>
                            <div style={{ border: '2px solid #F1F2F6', padding: '20px', marginTop: '-10px', marginBottom: '20px', display: languageList ? 'none' : 'block' }}>
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

                                {/* <div className="generate-button" onClick={downloadResume}>
                                    <button><TbDownload size={20} /> Download</button>
                                </div> */}
                                <div className="download-button" onClick={generateResume}>
                                    <button><LuRefreshCw size={20} /> Refresh</button>
                                </div>
                            </div>
                        </div>
                        {/* fetching document loading */}
                        <div className={preview ? 'modal-pop-up-fetchLoading-responsive' : 'modal-pop-up-fetchLoading'} style={{ display: fetchLoading ? 'block' : 'none' }}>
                            <div className="modal-pop-up-loading-spiner"></div>
                            <p>fetching...</p>
                        </div>
                    </div>
                </div>
                <div className="profile-header" onClick={(e) => { e.stopPropagation(); setIsProfile(isProfile ? false : true) }}>
                    {/* <IoPersonCircleSharp size={35} className='profiles' /> */}
                    <img className='profile' src={userCredentials && userCredentials[0].image[0] === "h" ? userCredentials[0].image : userCredentials && userCredentials[0].image[0] && userCredentials[0].image[0].match(/^\d/) ? `${backendUrl}/assets/image uploads/${userCredentials[0].image}` : givenProfile} alt="" style={{ borderRadius: '50%', height: '40px', width: '40px', border: '3px solid #ccc' }} />
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
                    <div className="profile-list" style={{ marginTop: '5px' }} onClick={() => { localStorage.removeItem('token'); navigate('/', { state: { data: 'logout' } }); }}>
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
                            <img src={userCredentials && userCredentials[0].image[0] === "h" ? userCredentials[0].image : userCredentials && userCredentials[0].image[0] && userCredentials[0].image[0].match(/^\d/) ? `${backendUrl}/assets/image uploads/${userCredentials[0].image}` : givenProfile} alt="" style={{ borderRadius: '50%', height: '130px', width: '130px', border: '3px solid #ccc' }} />
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
