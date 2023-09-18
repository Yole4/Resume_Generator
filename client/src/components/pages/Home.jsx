import React, { useState } from 'react'
import '../assets/CSS.css';

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

import { IoPersonCircleSharp } from "react-icons/io5";
import { FcDocument } from 'react-icons/fc';
import { BsStars } from 'react-icons/bs';
import { FaRegSmileBeam } from 'react-icons/fa';
import { VscFiles } from 'react-icons/vsc';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsFillEnvelopeFill } from 'react-icons/bs';
import { GoogleOAuthProvider, GoogleLogin, useGoogleOneTapLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

function Home() {
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const [isOpenLogin, setIsOpenLogin] = useState(false);

    const [templateOptions, setTemplateOptions] = useState({
        allDocument: true,
        simple: false,
        creative: false,
        professional: false
    });

    return (
        <div>
            <div className='container'>
                <div className='home-document'>
                    <FcDocument size={35} />
                    <span style={{ position: 'absolute' }}>Resume Maker</span>
                </div>
                <div onClick={() => setIsOpenPopup(true)} className='profile-header'>
                    <span className='dot'></span>
                    <IoPersonCircleSharp size={35} className='profile' />
                </div>

                <div className='title'>
                    <h1>Best Resume Templates</h1><br />
                    <p>Each template is skillfully created and adheres to the precise "resume rules" that employers want. Utilize tried-and-true resume formats to stand out and land a job faster.</p>

                    <div className="form-control">
                        <button className='form-button'>Create My Resume</button>
                    </div>

                    {/* template options */}
                    <div className="template-options">
                        <div className={templateOptions.allDocument ? 'list list-clicked' : 'list'} onClick={() => {setTemplateOptions((prevState) => ({...prevState, allDocument: true})); setTemplateOptions((prevState) => ({...prevState, simple: false}));; setTemplateOptions((prevState) => ({...prevState, creative: false})); setTemplateOptions((prevState) => ({...prevState, professional: false}))}}>
                            <VscFiles size={20} />
                            <span> All Templates</span>
                        </div>
                        <div className={templateOptions.simple ? 'list list-clicked' : 'list'} onClick={() => {setTemplateOptions((prevState) => ({...prevState, allDocument: false})); setTemplateOptions((prevState) => ({...prevState, simple: true}));; setTemplateOptions((prevState) => ({...prevState, creative: false})); setTemplateOptions((prevState) => ({...prevState, professional: false}))}}>
                            <BsStars size={20} />
                            <span> Simple</span>
                        </div>
                        <div className={templateOptions.creative ? 'list list-clicked' : 'list'} onClick={() => {setTemplateOptions((prevState) => ({...prevState, allDocument: false})); setTemplateOptions((prevState) => ({...prevState, simple: false}));; setTemplateOptions((prevState) => ({...prevState, creative: true})); setTemplateOptions((prevState) => ({...prevState, professional: false}))}}>
                            <FaRegSmileBeam size={20} />
                            <span> Creative</span>
                        </div>
                        <div className={templateOptions.professional ? 'list list-clicked' : 'list'} onClick={() => {setTemplateOptions((prevState) => ({...prevState, allDocument: false})); setTemplateOptions((prevState) => ({...prevState, simple: false}));; setTemplateOptions((prevState) => ({...prevState, creative: false})); setTemplateOptions((prevState) => ({...prevState, professional: true}))}}>
                            <BsFillEnvelopeFill size={20} />
                            <span> Professional</span>
                        </div>
                    </div>

                    {/* templates */}
                    <div className="templates" >
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.creative ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={first} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={secondSimple} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={thirdSimple} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={forthSimple} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={fifthSimple} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={sixthSimple} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={seventhSimple} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.creative ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={eigthCreative} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={ninethSimple} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.creative ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={tenthCreative} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.creative ? 'block' : 'none'}}>
                            <div className='bottom-template'>
                                <button>Use This Template</button>
                            </div>
                            <img src={eleventhCreative} alt="" />
                        </div>
                        <div className='template-list' style={{display: templateOptions.allDocument || templateOptions.simple ? 'block' : 'none'}}>
                            <div className='bottom-template'>
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
                        <AiOutlineCloseCircle size={20}/>
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
    )
}

export default Home
