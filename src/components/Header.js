import { useState,useRef } from "react";
import { useNavigate} from 'react-router-dom';

function Header(){
    let loginDetail = useRef(JSON.parse(localStorage.getItem("login_details")));
    let [menuVisible,setMenuVisible]= useState(false);
    let navigate = useNavigate();   
    console.log(loginDetail)
    
    function logout(){
        console.log(loginDetail)
        localStorage.removeItem("login_details");
        navigate("/login");
    }
    return(
        
        <>
        {
                menuVisible===true?
                (
                    <div className='profile_dropdown'>
                        <ul>
                            <li onClick={logout}>Logout</li>
                        </ul>
                    </div>
                ):
                null
            }
            <div className="head_body">   
                <div className="container-fluid header_container d-flex justify-content-between align-items-center">
                <div className='pl-3 hearder_logo fs-1'>Dinette</div>
                        
                <div className="d-flex align-items-center about_header">
                    <h1 className="m-3">About</h1>
                    <h1 className="m-3">Help</h1>
                    <div className="d-flex p-2 m-3 align-items-center">
                        
                        <div className="profile_container" onClick={()=>{
                                if(menuVisible===true){
                                    setMenuVisible(false);
                                }
                                else{
                                    setMenuVisible(true);
                                }
                            }}>
                                <i className="bi bi-person-circle fs-3 p-2"></i>
                                <div className='user_name'>
                                    {loginDetail.current.username}
                                </div>
                                
                            </div>
                    </div>
                    
                </div>
            </div>

            </div>
        
        </>
    )
}

export default Header;