import { useState, useRef, useEffect} from "react";
import Header from "../components/Header";
import '../css/Homepage.css';

function UserHomePage(){
    let loginDetail = useRef(JSON.parse(localStorage.getItem("login_details")));
    let [foodList, setFoodList] = useState([]);
    let foodJson = {"main_cource":[],"starters":[],"beverages":[],"desserts":[],"bread":[],"accompaniments":[],"rice":[]};
    let [foodTypeList,setFoodTypeList] =useState({});
    let [orderList, setOrderList]= useState([]);
    let [orderUpdated, setOrderUpdated] = useState(0);
    let [cartList, setCartList] = useState([]);
    let [finalAmount, setFinalAmount] = useState(0);
    let [checkoutModal, setCheckoutModal] = useState(false);
    let [proceedForFinal,setProceedForFinal] =useState(false);
    let form = useRef();
    let finalOrder ={};
    let [finalOrderIdList, setFinalOrderIdList] = useState([]);

    function readValue(property,value){
        finalOrder[property]=value; 
    }
    
    // use effect to extract  all food Item
    useEffect(()=>{
        fetch(`http://localhost:8000/foods/all_food_items`,{
            method:"GET",
            headers:{
                "authorization":`Bearer ${loginDetail.current.token}`
            }
        })
        .then((response)=>response.json())
        .then((responseData)=>{
    
           if(responseData.success === true){
                setFoodList(responseData.allFoods);
                console.log("foodList:   "+foodList);     
           }else{
                console.log(responseData);
           }
            
        })
        .catch((err)=>{
            console.log(err);
        })
    },[orderUpdated])

    // use Effect to extract  all orders related to user

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
                let orderIdList = [];
                cartList.forEach((cartOrder)=>{
                    orderIdList.push(cartOrder.food_item_id);
                })
                setFinalOrderIdList(orderIdList);
                
           }else{
                console.log(responseData);
           }
            
        })
        .catch((err)=>{
            console.log(err);
        })
    },[orderUpdated, checkoutModal])

    useEffect(()=>{
        let fList = {};
        // console.log("foodJson "+foodJson);
        Object.keys(foodJson).forEach((key,index)=>{
            fList[key] = foodList?.filter((food,index)=>{
                return food.food_type === key;
            })
        })
        setFoodTypeList({...fList});
        // console.log("fl  "+JSON.stringify(fList))
        // console.log("fl. .........  "+JSON.stringify(foodTypeList))
    },[orderUpdated])


    function addToCart(food){
        
        fetch("http://localhost:8000/orders/create",{
            method:'POST',
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${loginDetail.current.token}`
            },
            body:JSON.stringify({user_id:loginDetail.current.user_id, food_item_id:food._id,order_quantity:1, order_price:food.price, order_total:food.price})
        })
        .then((response)=>response.json())
        .then((responseData)=>{
            console.log(responseData);
            setOrderUpdated(orderUpdated+=1);
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    function modifyOrder(order, orderProperty, qtyType){
        let orderBody = {};
        if(orderProperty === "order_quantity"){
            if(qtyType === "plus"){
                orderBody[orderProperty]= order[orderProperty]+=1;
                orderBody["order_total"] = order["order_price"]*orderBody[orderProperty]
                setOrderUpdated(orderUpdated+=1);
            }
            else if(qtyType === "minus"){
                orderBody[orderProperty]= order[orderProperty]-=1;
                orderBody["order_total"] = order["order_price"]*orderBody[orderProperty]
                console.log(order[orderProperty])
                setOrderUpdated(orderUpdated+=1);
                if(order[orderProperty]<=0){
                    orderBody={};
                }
            }
        
        }
        if(Object.keys(orderBody).length >0){
            fetch(`http://localhost:8000/orders/updateorder/${order._id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${loginDetail.current.token}`
            },
            body:JSON.stringify(orderBody)
            })
            .then((response)=>response.json())
            .then((responseData)=>{
                // console.log(responseData);
                setOrderUpdated(orderUpdated+=1);
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        else{
            // delete collection if order quanity is decreaed to 0 
            fetch(`http://localhost:8000/orders/deleteorder/${order._id}`,{
            method:"DELETE",
            headers:{
                "authorization":`Bearer ${loginDetail.current.token}`
            }
            })
            .then((response)=>response.json())
            .then((responseData)=>{
                console.log(responseData);
                setOrderUpdated(orderUpdated+=1);
            })
            .catch((err)=>{
                console.log(err)
            })
        }
        
    }

    

    function loadAddRemoveBtn(food){
        let isOrderPresent=cartList.filter((order)=>{
            return order.food_item_id === food._id;
        })
        // console.log(isOrderPresent)
        if(isOrderPresent.length > 0){
            return(
                <div className="plus_minus d-flex justify-content-center align-items-center">
                    <i className="bi bi-dash" onClick={()=>{
                        modifyOrder(isOrderPresent[0],"order_quantity","minus")
                        calculateFinalAmount();
                    }}></i>
                    <span>{isOrderPresent[0].order_quantity}</span>
                    <i className="bi bi-plus" onClick={()=>{
                        modifyOrder(isOrderPresent[0],"order_quantity","plus")
                        calculateFinalAmount();
                    }}></i>
                </div>
                
            )
        }else{
            return(
                <div className="add d-flex align-items-center justify-content-center" onClick={()=>{
                    addToCart(food);
                    calculateFinalAmount();
                }}>Add</div>
            )
                
        }
    }


    function displayCart(foodId, quantity, price , totalPrice){
        // console.log(JSON.stringify(foodList))
    

        console.log(foodId)
        let displayFoodObj = foodList.find(ele => ele._id === foodId)
        
        console.log(displayFoodObj)
        // let totalSingleOrderPrice =  displayFoodObj.price*quantity
        
        return (
            <div className="d-flex justify-content-around">
                <div>
                    <h1 className="cart_food_name"><span>
                    {
                        displayFoodObj.food_category === "veg"?(
                            <i className="veg_icon bi bi-square-fill mr-3"></i>
                        ):(
                            <i className="non_veg_icon bi bi-square-fill mr-3"></i>
                        )
                    }
                     </span>{displayFoodObj.food_item}</h1>
                    <h1 className="cart_food_price"><span>₹</span>{price}</h1> 
                    <h1 className="cart_food_tootal_price"><span>₹</span>{totalPrice}</h1>    
                </div>
                
                <div className="add_remove_qty">
                    {
                        loadAddRemoveBtn(displayFoodObj)
                    }
                </div>


            </div>
        )
    }

    function calculateFinalAmount(){
        let fA =0;
        cartList.forEach((cartOrder,index)=>{
            fA+=cartOrder.order_total;
        })
        console.log(fA)
        setFinalAmount(fA)
    }

    function checkout(finorderList,finAmount){
        console.log("checkout done")
        console.log(finalOrder)
        finalOrder["contents"]=finorderList;
        finalOrder["final_amount"] = finAmount;
        fetch(`http://localhost:8000/orders/createfinalorder`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${loginDetail.current.token}`
            },
            body:JSON.stringify(finalOrder)
            })
            .then((response)=>response.json())
            .then((responseData)=>{
                console.log(responseData);
                setCheckoutModal(false);
                setOrderUpdated(orderUpdated+=1);
                form.current.reset();
            })
            .catch((err)=>{
                console.log(err)
            }) 

            console.log("Reaching here")
            finalOrder.contents.map((sinOrder,index)=>{
                let orderBody = {order_status:"in_progress"}
                console.log("sinorder       "+sinOrder)
                fetch(`http://localhost:8000/orders/updateorder/${sinOrder}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "authorization":`Bearer ${loginDetail.current.token}`
                },
                body:JSON.stringify(orderBody)
                })
                .then((response)=>response.json())
                .then((responseData)=>{
                    // console.log(responseData);
                    setOrderUpdated(orderUpdated+=1);
                })
                .catch((err)=>{
                    console.log(err)
                })
            })

    }


   

    return(
        <>
        <Header/>
        {
            checkoutModal === true ? (
                <div className='modal' onClick={()=>{
                    setCheckoutModal(false);
                }}>
                    <div className="add_food_modal_child" onClick={(event)=>{
                        event.stopPropagation();
                    }}>
                        <div className='add_food_modal_head d-flex justify-content-between'>
                            
                            <h1>Checkout</h1>
                            <i className="fa-solid fa-square-xmark close mr-2" onClick={()=>{
                                setCheckoutModal(false);
                            }}></i>
                        </div>
                        <div className="create_form">
                            <form className="add_food_form" ref={form}>
                                    <input type="text" className="cr_inp" defaultValue= {finalOrderIdList} placeholder="OrderId"/>
                                    <input type="text" className="cr_inp" placeholder="location" onChange={(event)=>{
                                        readValue("location",event.target.value);
                                    }}/>
                                    <input type="text" className="cr_inp" defaultValue={finalAmount} placeholder="final Amount"/>
                                    
                                    <button className="cr_btn" type="button" onClick={()=>{
                                        checkout(finalOrderIdList,finalAmount)
                                    }}>Pay</button>
    
                                </form>
    
                            </div>
                    </div>
                </div>
            ): null
        }
        
        <div className="banner">
            {/* <video className="video_banner" autoPlay muted>
                <source src="./images/banner_video.mp4"/>
            </video> */}
            <div className="container bg-promary search_container">

            </div>
    
        </div>

        <div className="food_con container-fluid d-flex justify-content-around" >
            <div className="default_cards comman_container">
                {
                        foodList?.map((food,index)=>{
                            
                            return (
                                
                                <div key={index} className="single_card d-flex align-items-center">
                                    <div className="default_img m-5">
                                        <img src={food.contents[0]} className="def_img"/>
                                    
                                    </div>
                                    <div className="single_card_description d-flex flex-column justify-content-start align-items-start m-5">
                                        <div className="d-flex food_name_card align-items-center">
                                            {
                                                food.food_category === "veg"?(
                                                    <i className="veg_icon bi bi-square-fill mr-3"></i>
                                                ):(
                                                    <i className="non_veg_icon bi bi-square-fill mr-3"></i>
                                                )
                                            }
                                            <h1 className='food_name ml-3'>{food.food_item}</h1>
                                        </div>

                                        
                                        <h2 className="food_price"><span>Price  ₹</span>{food.price}</h2>
                                        <div className='food_description'>{food.discription}</div>
                                    </div>
                                    <div className="add_remove_qty d-flex">
                                        {
                                            loadAddRemoveBtn(food)
                                        }
                                    </div>
                                    
                                    
                                </div>
                                
                            
                            )
                        })
        
                        
                    }

                
                
            </div>
        
            <div className="cart_container d-flex flex-column justify-content-center">
            <div className="cart_title">
                Cart
            </div>
                    <div className="all_carts">
                {
                    cartList.map((cartItem, index)=>{
                        return (
                            
                            <div key={index}>
                                <div className="single_cart">
                                    
                                    {
                                        displayCart(cartItem.food_item_id,cartItem.order_quantity,cartItem.order_price,cartItem.order_total)
                                    }
                                </div>
                            </div>
                           
                        )
                    })

                
                }
                </div>
                <div className="finalOrder d-flex justify-content-center flex-column align-items-center">
                    <h1 onClick={()=>{
                        // calculateFinalAmount();
                        setProceedForFinal(true)
                        calculateFinalAmount();

                    }}>Proceed to see Final Order</h1>
                    <div>
                       {
                        proceedForFinal === true ?(
                            <>
                            <div className="final_amount">
                                <span>Total Price:   </span>
                                {finalAmount}
                            </div>
                            <div className="checkout_button" onClick={()=>{
                                setCheckoutModal(true)
                            }}>Checkout</div>
                            </>
                        ):null
                       }
                    </div>
                    
                </div>
                
                    
            </div>

        </div>
        </>
    )

}

export default UserHomePage;