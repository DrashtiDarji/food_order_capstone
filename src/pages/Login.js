import { useRef, useState } from 'react';
import '../css/Signup.css'
import {Link, useNavigate} from 'react-router-dom';

function Login(){

    let [loginModal, setLoginModal] = useState(true);
    let [userLogin, setUserLogin] = useState(true);
    let [ restaurantLogin, setRestaurantLogin] = useState(false);
    const navigate = useNavigate();
    let user ={};
    let form = useRef();
    function readValue(property,value){
        user[property]=value;
    }


    function login(){
        if(userLogin === true){
            user['atype'] = 'customer';
        }
        else if(restaurantLogin === true){
            user['atype'] = 'admin';
        }
        fetch("http://localhost:8000/users/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(user)
            })
            .then((response)=>response.json())
            .then((responseData)=>{
                if(responseData.success===true){
                    localStorage.setItem("login_details",JSON.stringify(responseData));
                    if(userLogin === true){
                        navigate('/userhomepage');
                    }
                    else if(restaurantLogin === true){
                        navigate('/homepage');
                    }
                    
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
                    <Link to='/signup'><h1>Signup</h1></Link>
                    <h1  onClick={()=>{
                        setLoginModal(true);
                    }}>Login</h1>
                </div>
            </div>
        </div>
        {
            loginModal === true?(
                <div className='modal' onClick={()=>{
                    setLoginModal(false);
                    setUserLogin(true);
                    setRestaurantLogin(false);
                }}>
                    <div className='modal_child' onClick={(event)=>{
                         event.stopPropagation();
                    }}>
                        <div className='modal_head d-flex justify-content-between mt-3 align-item-center'>
                            <div className='userh1'>
                                
                                {
                                    userLogin === true?(
                                        <>
                                            <h1 className='pl-1 '>User Login</h1>
                                            <a className='user_link' onClick={()=>{
                                                setUserLogin(false);
                                                setRestaurantLogin(true);
                                            }}>Restaurant Login</a>
                                        </>

                                    ):
                                    (
                                        <>
                                            <h1 className='pl-1 '>Restaurant Login</h1>
                                            <a className='user_link' onClick={()=>{
                                                setUserLogin(true);
                                                setRestaurantLogin(false);
                                            }}>User Login</a>
                                        </>
                                    )
                                }
                            
                            </div>
                            
                            <div className='pr-1 close_div'>
                                <i className="fa-solid fa-xmark close" onClick={()=>{
                                    setLoginModal(false);
                                    setUserLogin(true);
                                    setRestaurantLogin(false);
                                }}></i>

                            </div>
                            
                        </div>

                        {
                            userLogin === true?(
                                <form className='input_form' ref={form}>
                                    <input className="input_box" type="email" placeholder="Email" onChange={(event)=>{
                                        readValue("email",event.target.value)
                                    }}/>
                                
                                    <input className="input_box" type="password" placeholder="Password" onChange={(event)=>{
                                        readValue("password",event.target.value)
                                    }}/>

                                    <button type='button' onClick={login} className="btn">Login</button>
                                </form>
                            ):(
                                <form className='input_form' ref={form}>
                                    <input className="input_box" type="email" placeholder="Restaurant Email" onChange={(event)=>{
                                        readValue("email",event.target.value)
                                    }}/>
                                   
                                    <input className="input_box" type="password" placeholder="Restaurant Password" onChange={(event)=>{
                                        readValue("password",event.target.value)
                                    }}/>

                                   
                                    <button type='button' onClick={login} className="btn">Login</button>
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


export default Login;