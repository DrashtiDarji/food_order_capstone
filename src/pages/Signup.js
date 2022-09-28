import { useRef, useState } from 'react';
import '../css/Signup.css'
import {Link} from 'react-router-dom';

function Signup(){

    let [signupModal, setSignupModal] = useState(true);
    let [userSignup, setUserSignup] = useState(true);
    let [ restaurantSignup, setRestaurantSignup] = useState(false);

    let user ={};
    let form = useRef();
    function readValue(property,value){
        user[property]=value;
    }


    function signup(){
        if(userSignup === true){
            user['atype'] = 'customer';
        }
        else if(restaurantSignup === true){
            user['atype'] = 'admin';
        }
        fetch("http://localhost:8000/users/signup",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(user)
            })
            .then((response)=>response.json())
            .then((responseData)=>{
                if(responseData.success===true){
                    form.current.reset();
                }
                else{
                    console.log(responseData)
                }
                
            })
            .catch((err)=>{
                console.log(err)
            })
    }


    return (
        <>  
        <div className="signup_main">
            <div className="container-fluid d-flex justify-content-between signup_head pt-4">
                <h1 className='pl-3 logo fs-1'>Dinette</h1>
                
                <div className="d-flex justify-content-around about_login">
                    <h1>About</h1>
                    <h1 onClick={()=>{
                        setSignupModal(true);
                    }}>Signup</h1>
                    <Link to='/login'><h1>Login</h1></Link>
                </div>
            </div>
        </div>
        {
            signupModal === true?(
                <div className='modal' onClick={()=>{
                    setSignupModal(false);
                    setUserSignup(true);
                    setRestaurantSignup(false);
                }}>
                    <div className='modal_child' onClick={(event)=>{
                         event.stopPropagation();
                    }}>
                        <div className='modal_head d-flex justify-content-between mt-3 align-item-center'>
                            <div className='userh1'>
                                
                                {
                                    userSignup === true?(
                                        <>
                                            <h1 className='pl-1 '>User Sign Up</h1>
                                            <h5 onClick={()=>{
                                                setUserSignup(false);
                                                setRestaurantSignup(true);
                                            }}>Restaurant Signup</h5>
                                        </>

                                    ):
                                    (
                                        <>
                                            <h1 className='pl-1 '>Restaurant Sign Up</h1>
                                            <h5 onClick={()=>{
                                                setUserSignup(true);
                                                setRestaurantSignup(false);
                                            }}>User Signup</h5>
                                        </>
                                    )
                                }
                            
                            </div>
                            
                            <div className='pr-1 close_div'>
                                <i className="fa-solid fa-xmark close" onClick={()=>{
                                    setSignupModal(false);
                                    setUserSignup(true);
                                    setRestaurantSignup(false);
                                }}></i>

                            </div>
                            
                        </div>

                        {
                            userSignup === true?(
                                <form className='input_form' ref={form}>
                                    <input className="input_box" type="email" placeholder="Email" onChange={(event)=>{
                                        readValue("email",event.target.value)
                                    }}/>
                                    <input className="input_box" type="text" placeholder="Full Name" onChange={(event)=>{
                                        readValue("name",event.target.value)
                                    }}/>
                                
                                    <input className="input_box" type="password" placeholder="Password" onChange={(event)=>{
                                        readValue("password",event.target.value)
                                    }}/>

                                    <input className="input_box" type="number" placeholder="Mobile No" onChange={(event)=>{
                                        readValue("mobile",event.target.value)
                                    }}/>

                            
                                    <p className="end-txt">By signing up, you agree to our <span>Terms , Data Policy and Cookies Policy</span></p>

                                    <button type='button' onClick={signup} className="btn">Sign up</button>
                                </form>
                            ):(
                                <form className='input_form' ref={form}>
                                    <input className="input_box" type="email" placeholder="Restaurant Email" onChange={(event)=>{
                                        readValue("email",event.target.value)
                                    }}/>
                                    <input className="input_box" type="text" placeholder="Restaurant Name" onChange={(event)=>{
                                        readValue("name",event.target.value)
                                    }}/>
                                
                                    <input className="input_box" type="password" placeholder="Restaurant Password" onChange={(event)=>{
                                        readValue("password",event.target.value)
                                    }}/>

                                    <input className="input_box" type="number" placeholder="Restaurant Mobile No" onChange={(event)=>{
                                        readValue("mobile",event.target.value)
                                    }}/>

                                    <input className="input_box" type="text" placeholder="Restaurant Address" onChange={(event)=>{
                                        readValue("address",event.target.value)
                                    }}/>

                                     <input className="input_box" type="number" placeholder="Restauranrt Pincode" onChange={(event)=>{
                                        readValue("pincode",event.target.value)
                                    }}/>

                                    <input className="input_box" type="text" placeholder="restaurant open Timing" onChange={(event)=>{
                                        readValue("open",event.target.value)
                                    }}/>

                                    <input className="input_box" type="text" placeholder="restaurant closing Timing" onChange={(event)=>{
                                        readValue("close",event.target.value)
                                    }}/>
                                

                                    <p className="end-txt">By signing up, you agree to our <span>Terms , Data Policy and Cookies Policy</span></p>

                                    <button type='button' onClick={signup} className="btn">Sign up</button>
                                </form>
                            )
                        }

                        

                    </div>

                </div>

            
            ):
            null
        }
            
        </>
        
    )
}


export default Signup;