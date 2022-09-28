import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import '../css/Homepage.css';

function UserHomePage(){
    let loginDetail = useRef(JSON.parse(localStorage.getItem("login_details")));
    let [orderList, setOrderList]= useState([]);
    let [orderUpdated, setOrderUpdated] = useState(0);
    let [cartList, setCartList] = useState([]);
    useEffect(()=>{
        fetch(`http://localhost:8000/orders/all_order_user/${loginDetail.current.user_id}`,{
            method:"GET",
            headers:{
                "authorization":`Bearer ${loginDetail.current.token}`
            }
        })
        .then((response)=>response.json())
        .then((responseData)=>{
        // console.log(responseData)
           if(responseData.success === true){
                setOrderList(responseData.allOrder);
                let cart= orderList.filter((order)=>{
                    return order.order_status === "cart";
                });
                setCartList(cart);
                console.log("OrderList:   "+orderList);     
                console.log("cart:  "+JSON.stringify(cartList))
           }else{
                console.log(responseData);
           }
            
        })
        .catch((err)=>{
            console.log(err);
        })
    },[orderUpdated])

    return(
        <>
        <Header/>

        </>
    )

}
export default UserHomePage;