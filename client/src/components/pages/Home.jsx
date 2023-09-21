import React, { useEffect, useRef, useState } from 'react'
import '../assets/CSS/CSS.css';
import { Document, Page } from 'react-pdf';
import axios from 'axios';

import first from '../assets/images/firstTemplateSample.png';
import secondSimple from '../assets/images/second-simple.png';
import thirdSimple from '../assets/images/third-simple.png';
import forthSimple from '../assets/images/fourth-simple.png';
import fifthSimple from '../assets/images/fifth-simple.png';
import sixthSimple from '../assets/images/sixth-simple.png';
import seventhSimple from '../assets/images/seventh-simple.png';
import eigthCreative from '../assets/images/eigth-creative.png';
import ninethSimple from '../assets/images/nineth-simple.png';
import tenthCreative from '../assets/images/tenth-creative.png';
import eleventhCreative from '../assets/images/eleventh-creative.png';
import doseSimple from '../assets/images/dose-simple.png';
import homeEditorIcon from '../assets/images/editor.png';

import { IoPersonCircleSharp } from "react-icons/io5";
import { BsStars } from 'react-icons/bs';
import { FaRegSmileBeam } from 'react-icons/fa';
import { VscFiles } from 'react-icons/vsc';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsFillEnvelopeFill } from 'react-icons/bs';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Home() {
    // initialize navigate
    const navigate = useNavigate();

    // get user login credectials on google
    const [userData, setUserData] = useState([]);
    const [isLoginGoogle, setIsLoginGoogle] = useState(false);

    useEffect(() => {
        if (isLoginGoogle) {
            const email = (userData.email).toString();
            const fullname = (userData.given_name + " " + userData.family_name).toString();
            const requestToInsert = { email, fullname };
            const insertUserData = async () => {
                try {
                    const response = await axios.post('https://resume-generator-backend-0cc9.onrender.com/api/insert-user', requestToInsert);
                    
                    if (response.status === 200){
                        console.log("inserted!");
                    }
                } catch (error) {
                    if (error.response && error.response.status === 401){
                        console.log(error.response.data.message);
                    }else{
                        console.log('Error: ', error);
                    }
                }
            }
            insertUserData();
        }
    }, [isLoginGoogle]);

    const started = sessionStorage.getItem('started');

    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isOpenLogin, setIsOpenLogin] = useState(false);

    const [templateOptions, setTemplateOptions] = useState({
        allDocument: true,
        simple: false,
        creative: false,
        professional: false
    });

    // get started
    const [getStarted, setGetStarted] = useState(started === 'false' ? false : true);

    // Create a ref for the target element
    const second = useRef(null);
    const third = useRef(null);
    const fourth = useRef(null);
    const [currentState, setCurrentState] = useState(1);

    // Function to handle the scroll
    const secondScroll = () => {
        setCurrentState(2);
        if (second.current) {
            second.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const thirdScroll = () => {
        setCurrentState(3);
        if (third.current) {
            third.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fourthScroll = () => {
        setCurrentState(4);
        if (fourth.current) {
            fourth.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <div className='welcome'>
                <div style={{ display: getStarted ? 'block' : 'none', width: '100%' }}>
                    <div className="welcome-container">
                        <div className='welcome-label'>
                            <div className="welcome-body">
                                {/* <TfiWrite size={100} /> */}
                                <img src={homeEditorIcon} style={{ height: '100px', width: '100px', color: 'black' }} alt="" />
                                <h1>Welcome to Online Resume Generator</h1>
                                <button className='next-button' onClick={secondScroll}>Next</button>
                            </div>
                        </div>
                        <div className='welcome-label' ref={second}>
                            <div className="welcome-body">
                                <h3>Your Path to Professional Success Begins Here</h3>
                                <p>Are you ready to take the first step towards your dream job? Look no further. Our Resume Generator is your ultimate tool for crafting a compelling resume that will make you stand out from the competition.</p>
                                <button className='next-button' onClick={thirdScroll}>Next</button>
                            </div>
                        </div>
                        <div className='welcome-label' ref={third}>
                            <div className="welcome-body">
                                <h3>Download Your Document</h3>
                                <p>Once you've created the perfect resume, it's time to take action. Click the "Download Document" button to save your resume in a professional format that's ready to impress potential employers. Your path to success is just a click away.</p>
                                <button className='next-button' onClick={fourthScroll}>Next</button>
                            </div>
                        </div>
                        <div className='welcome-label' ref={fourth}>
                            <div className="welcome-body">
                                <h3>Get Started Today</h3>
                                <p>Don't wait any longer. Try out Resume Generator now and embark on your journey towards your dream job with confidence. Your future career is in your hands, and we're here to help you make it a reality.</p>
                                <button className='next-button' onClick={() => setGetStarted(false)}>Get Started!</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="dots-indicators" style={{ display: getStarted ? 'block' : 'none' }}>
                    <span className={currentState === 1 ? 'dots active' : 'dots'}></span>
                    <span className={currentState === 2 ? 'dots active' : 'dots'}></span>
                    <span className={currentState === 3 ? 'dots active' : 'dots'}></span>
                    <span className={currentState === 4 ? 'dots active' : 'dots'}></span>
                </div>
            </div>

            <div style={{ display: getStarted ? 'none' : 'block' }}>
                <div className='container'>
                    <div className='home-document' onClick={() => setGetStarted(false)}>
                        {/* <FcDocument size={35} /> */}
                        <img src={homeEditorIcon} style={{ height: '35px', width: '35px' }} alt="" />
                        <span style={{ position: 'absolute' }}>Resume Maker</span>
                    </div>
                    <div onClick={() => setIsOpenPopup(true)} className='profile-header'>
                        <span className='dot'></span>
                        <IoPersonCircleSharp size={35} className='profile' />
                    </div>

                    <div className='title'>
                        <h1>Best Resume Templates</h1><br />
                        <p>Each template is skillfully created and adheres to the precise "resume rules" that employers want. Utilize tried-and-true resume formats to stand out and land a job faster.</p>

                        <div className="form-controls">
                            <button className='form-buttons' onClick={() => navigate('/creating', { state: { data: 'none' } })}>Create My Resume</button>
                        </div>

                        {/* template options */}
                        <div className="template-options">
                            <div className={templateOptions.allDocument ? 'list list-clicked' : 'list'} onClick={() => { setTemplateOptions((prevState) => ({ ...prevState, allDocument: true })); setTemplateOptions((prevState) => ({ ...prevState, simple: false }));; setTemplateOptions((prevState) => ({ ...prevState, creative: false })); setTemplateOptions((prevState) => ({ ...prevState, professional: false })) }}>
                                <VscFiles size={20} />
                                <span> All Templates</span>
                            </div>
                            <div className={templateOptions.simple ? 'list list-clicked' : 'list'} onClick={() => { setTemplateOptions((prevState) => ({ ...prevState, allDocument: false })); setTemplateOptions((prevState) => ({ ...prevState, simple: true }));; setTemplateOptions((prevState) => ({ ...prevState, creative: false })); setTemplateOptions((prevState) => ({ ...prevState, professional: false })) }}>
                                <BsStars size={20} />
                                <span> Simple</span>
                            </div>
                            <div className={templateOptions.creative ? 'list list-clicked' : 'list'} onClick={() => { setTemplateOptions((prevState) => ({ ...prevState, allDocument: false })); setTemplateOptions((prevState) => ({ ...prevState, simple: false }));; setTemplateOptions((prevState) => ({ ...prevState, creative: true })); setTemplateOptions((prevState) => ({ ...prevState, professional: false })) }}>
                                <FaRegSmileBeam size={20} />
                                <span> Creative</span>
                            </div>
                            <div className={templateOptions.professional ? 'list list-clicked' : 'list'} onClick={() => { setTemplateOptions((prevState) => ({ ...prevState, allDocument: false })); setTemplateOptions((prevState) => ({ ...prevState, simple: false }));; setTemplateOptions((prevState) => ({ ...prevState, creative: false })); setTemplateOptions((prevState) => ({ ...prevState, professional: true })) }}>
                                <BsFillEnvelopeFill size={20} />
                                <span> Professional</span>
                            </div>
                        </div>

                        {/* templates */}
                        <div className="templates" >
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.creative ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'one' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={first} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'two' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={secondSimple} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'three' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={thirdSimple} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'four' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={forthSimple} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'five' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={fifthSimple} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'six' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={sixthSimple} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'seven' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={seventhSimple} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.creative ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'eight' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={eigthCreative} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'nine' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={ninethSimple} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.creative ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'ten' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={tenthCreative} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.creative ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'eleven' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={eleventhCreative} alt="" />
                            </div>
                            <div className='template-list' style={{ display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none' }}>
                                <div className='bottom-template' onClick={() => navigate('/creating', { state: { data: 'twelve' } })}>
                                    <button>Use This Template</button>
                                </div>
                                <img src={doseSimple} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* bottom color */}
                <div className="bottom-color">

                </div>

                <div onClick={() => setIsOpenPopup(false)} className='popup' style={{ visibility: isOpenPopup ? 'visible' : 'hidden' }} >

                    <div onClick={(e) => e.stopPropagation()} className='popup-body' style={{ animation: isOpenPopup ? 'dropBottom .3s linear' : '' }} >
                        <div style={{ textAlign: 'center' }}>
                            <h3>Get Started</h3><br />
                        </div>
                        <div className="modal-close" onClick={() => setIsOpenPopup(false)}>
                            <AiOutlineCloseCircle size={20} />
                        </div>
                        <div className="form-control">
                            <GoogleOAuthProvider clientId="791915019480-6n1kepg7vfup1dnkggkekr8fvpjk6m5g.apps.googleusercontent.com">
                                <GoogleLogin
                                    className='form-input'
                                    onSuccess={credentialResponse => {
                                        // console.log(credentialResponse);
                                        const details = jwt_decode(credentialResponse.credential);
                                        // console.log(details);
                                        setUserData(details);
                                        setIsLoginGoogle(true);
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                            </GoogleOAuthProvider>
                        </div>
                        <br />
                        <hr />

                        <div className='form-control'>
                            <p >Name</p>
                            <input type="text" className='form-input' placeholder='Your Name' />
                        </div>

                        <div className='form-control'>
                            <p >Email</p>
                            <input type="email" className='form-input' placeholder='Your@gmail.com' />
                        </div>

                        <div className='form-control'>
                            <p >Password</p>
                            <input type="password" className='form-input' placeholder='*******' />
                        </div>

                        <div className='form-control'>
                            <p >Confirm Password</p>
                            <input type="password" className='form-input' placeholder='*******' />
                        </div>

                        <div className='form-control'>
                            <button className='form-input'>Register</button>
                        </div>

                        <div className='form-control' style={{ textAlign: 'center' }}>
                            <span>Already have an Account? <a style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }} onClick={() => { setIsOpenPopup(false); setIsOpenLogin(true); }}>Login</a></span>
                        </div>
                    </div>
                </div>

                {/* Login Popup */}
                <div onClick={() => setIsOpenLogin(false)} className='popup' style={{ visibility: isOpenLogin ? 'visible' : 'hidden' }} >
                    <div onClick={(e) => e.stopPropagation()} className='popup-body' style={{ animation: isOpenLogin ? 'dropBottom .3s linear' : '' }} >
                        <div style={{ textAlign: 'center' }}>
                            <h3>Login</h3><br />
                        </div>
                        <div className="modal-close" onClick={() => setIsOpenLogin(false)}>
                            <AiOutlineCloseCircle size={20} />
                        </div>
                        <div className="form-control">
                            <GoogleOAuthProvider clientId="791915019480-6n1kepg7vfup1dnkggkekr8fvpjk6m5g.apps.googleusercontent.com">
                                <GoogleLogin
                                    className='form-input'
                                    onSuccess={credentialResponse => {
                                        // console.log(credentialResponse);
                                        const details = jwt_decode(credentialResponse.credential);
                                        console.log(details);
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                            </GoogleOAuthProvider>
                        </div>
                        <br />
                        <hr />

                        <div className='form-control'>
                            <p >Email</p>
                            <input type="email" className='form-input' placeholder='Your@gmail.com' />
                        </div>

                        <div className='form-control'>
                            <p >Password</p>
                            <input type="password" className='form-input' placeholder='*******' />
                        </div>

                        <div className='form-control'>
                            <button className='form-input'>Login</button>
                        </div>

                        <div className="form-control" style={{ textAlign: 'center' }}>
                            <span style={{ color: 'red', cursor: 'pointer' }}>Forgot Password?</span>
                        </div>

                        <div className='form-control' style={{ textAlign: 'center' }}>
                            <span>Don't have an Account? <a style={{ textDecoration: 'underline', cursor: 'pointer', color: 'blue' }} onClick={() => { setIsOpenPopup(true); setIsOpenLogin(false); }}>Register</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home
