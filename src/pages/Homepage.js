import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import '../css/Homepage.css';


function Homepage(){
    let loginDetail = useRef(JSON.parse(localStorage.getItem("login_details")));
    let [addFoodModal, setAddFoodModal] = useState(false); 
    let [updateFoodModal, setUpdateFoodModal] = useState(false);
    let form = useRef();
    let [foodList, setFoodList] = useState([]);
    let foodJson = {"main_cource":[],"starters":[],"beverages":[],"desserts":[],"bread":[],"accompaniments":[],"rice":[]};
    let [foodTypeList,setFoodTypeList] =useState({});
    let [updateFoodObject, setUpdateFoodObject] = useState({});
    let [deleteFoodId, setDeleteFoodId] = useState("");
    let [orderList, setOrderList]= useState([]);

    let food = new FormData();
    let updateFood = new FormData();
    food.append("restaurant_id",loginDetail.current.user_id);

    function readValue(property,value){
        // console.log(property, value);
        if(addFoodModal === true){
            food.append(property,value);
            // console.log(food)
        }
        else if(updateFoodModal === true){
            updateFood.append(property,value);
            // console.log(food)
        }
        
    }

    function addFoodItem(){
        console.log("btn clicked")
        console.log(food);
        fetch("http://localhost:8000/foods/create",{
            method:"POST",
            headers:{
                "authorization":`Bearer ${loginDetail.current.token}`
            },
            body:food
        })
        .then((response)=>response.json())
        .then((responseData)=>{
            if(responseData.success===true){
                form.current.reset();
                setAddFoodModal(false);
            }
            else{
                console.log(responseData)
            }
            
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    function updateFoodItem(){
        console.log(updateFoodObject._id)
        console.log(food)
        fetch(`http://localhost:8000/foods/updatefood/${updateFoodObject._id}`,{
            method:"PUT",
            headers:{
                "authorization":`Bearer ${loginDetail.current.token}`
            },
            body:updateFood
        })
        .then((response)=>response.json())
        .then((responseData)=>{
            if(responseData.success===true){
                console.log("upf=date response ----------------",responseData)
                form.current.reset();
                setUpdateFoodModal(false);
            }
            else{
                console.log(responseData)
            }
            
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    function deleteFoodItem(){
        fetch(`http://localhost:8000/foods/deletefood/${deleteFoodId}`,{
            method:"DELETE",
            headers:{
                "authorization":`Bearer ${loginDetail.current.token}`
            }
        })
        .then((response)=>response.json())
        .then((responseData)=>{
            if(responseData.success===true){
                console.log("delete response ----------------",responseData)
            }
            else{
                console.log(responseData)
            }
            
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    // get all food of Restaurant
    useEffect(()=>{
        fetch(`http://localhost:8000/foods/food_items/${loginDetail.current.user_id}`,{
            method:"GET",
            headers:{
                "authorization":`Bearer ${loginDetail.current.token}`
            }
        })
        .then((response)=>response.json())
        .then((responseData)=>{
           
           if(responseData.success === true){
                setFoodList(responseData.foodItems);
                // console.log("foodList:   "+foodList);
                
                   
           }else{
                console.log(responseData);
           }
            
        })
        .catch((err)=>{
            console.log(err);
        })
    },[])

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
        // console.log("fl...........  "+JSON.stringify(foodTypeList))
    },[foodList])


    // take the order

    useEffect(()=>{
        foodList.forEach((foodId,index)=>{
            // fetch(`http://localhost:8000/orders/getfoodorderid/${foodId._id}`,{
            //     method:"GET",
            //     headers:{
            //         "authorization":`Bearer ${loginDetail.current.token}`
            //     }
            // })
            // .then((response)=>response.json())
            // .then((responseData)=>{
            
            // if(responseData.success === true){
            //         console.log("inside true")
            //         // console.log("foodList:   "+foodList);
            //         if(responseData.orderId !== null && responseData.orderId!== undefined){
            //             console.log("....................."+JSON.stringify(responseData.orderId))
            //             updateFood = new FormData();
            //             setUpdateFoodObject(foodId);
                        
            //             updateFood.append({})

            //         }
                    
                    
            // }else{
            //         console.log("errorr");
            // }
                
            // })
            // .catch((err)=>{
            //     console.log(err);
            // })
        })
        
    },[])


    // take order id
    useEffect(()=>{
        foodList.map((foodItem,index)=>{
            fetch(`http://localhost:8000/orders/getrestaurantorder/${foodItem._id}`,{
                method:"GET",
                headers:{
                    "authorization":`Bearer ${loginDetail.current.token}`
                }
            })
            .then((response)=>response.json())
            .then((responseData)=>{
            
            if(responseData.success === true){
                if(responseData.order !== null && responseData.order !== undefined){
                    let lis = orderList;
                    lis.push(responseData.order)
                    setOrderList(lis);
                    console.log("orderlist ----------:   "+JSON.stringify(lis));

                }
                    
                    
                    
            }else{
                    console.log(responseData);
            }
                
            })
            .catch((err)=>{
                console.log(err);
            })

        })

        // console.log("food  Type list:   "+JSON.stringify(foodTypeList))
    }, [])


    return (
        <>
        <Header/>
        
        
        {
            addFoodModal === true ? (
                <div className='modal' onClick={()=>{
                    setAddFoodModal(false);
                }}>
                    <div className="add_food_modal_child" onClick={(event)=>{
                        event.stopPropagation();
                    }}>
                        <div className='add_food_modal_head d-flex justify-content-between'>
                           
                            <h1>Add Food to Menu</h1>
                            <i className="bi bi-x-square-fill close mr-2" onClick={()=>{
                                setAddFoodModal(false);
                            }}></i>
                        </div>
                        <div className="create_form">
                            <form className="add_food_form" ref={form} onSubmit={addFoodItem}>
                                    <input type="text" className="cr_inp" placeholder="Food Item Name" onChange={(event)=>{
                                        readValue("food_item",event.target.value);
                                    }}/>
                                    <input type="text" className="cr_inp" placeholder="Quantity" onChange={(event)=>{
                                        readValue("quantity",event.target.value);
                                    }}/>
                                    <input type="text" className="cr_inp" placeholder="Price of the Food" onChange={(event)=>{
                                        readValue("price",event.target.value);
                                    }}/>
                                    <input type="text" className="cr_inp  " placeholder="Description of the Food" onChange={(event)=>{
                                        readValue("discription",event.target.value);
                                    }}/>
                                    <div className="d-flex adFood_file justify-content-between">
                                        <h2>Image</h2>
                                        <input type="file" multiple className="cr_inp file_inp" onChange={(event)=>{
                                            readValue("contents",event.target.files[0]);
                                        }}/>
                                    </div>
                                    <select name = "food_type" onChange={(event)=>{
                                        readValue("food_type",event.target.value);
                                    }}>
                                        <option value="default">Select Food Type</option>
                                        <option value="main_cource">Main Cource</option>
                                        <option value="starters">Starters</option>
                                        <option value="rice">Rice</option>
                                        <option value="beverages">Beverages</option>
                                        <option value="desserts">Desserts</option>
                                        <option value="bread">Bread</option>
                                        <option value="accompaniments">Accompaniments</option>
                                    </select>
                                    <select name = "food_categoty" onChange={(event)=>{
                                        readValue("food_category",event.target.value);
                                    }}>
                                        <option value="default">Select Food Category</option>
                                        <option value="veg">Veg</option>
                                        <option value="non_veg">Non-Veg</option>
                                        <option value="vegan">Vegan</option>
                                    </select>
                                    
                                    
                                    <button className="cr_btn" type="submit">Upload</button>

                                </form>

                            </div>
                    </div>
                </div>
            ):


            updateFoodModal === true ? (
                <div className='modal' onClick={()=>{
                    setUpdateFoodModal(false);
                }}>
                    <div className="add_food_modal_child" onClick={(event)=>{
                        event.stopPropagation();
                    }}>
                        <div className='add_food_modal_head d-flex justify-content-between'>
                           
                            <h1>Update Food in Menu</h1>
                            <i className="fa-solid fa-square-xmark close mr-2" onClick={()=>{
                                setUpdateFoodModal(false);
                            }}></i>
                        </div>
                        <div className="create_form">
                            <form className="add_food_form" ref={form} onSubmit={updateFoodItem}>
                            
                                    <input type="text" className="cr_inp" placeholder="Food Item Name" defaultValue={updateFoodObject.food_item} onChange={(event)=>{
                                        readValue("food_item",event.target.value);
                                    }}/>
                                    <input type="text" className="cr_inp" defaultValue={updateFoodObject.quantity} placeholder="Quantity" onChange={(event)=>{
                                        readValue("quantity",event.target.value);
                                    }}/>
                                    <input type="text" className="cr_inp" defaultValue={updateFoodObject.price} placeholder="Price of the Food" onChange={(event)=>{
                                        readValue("price",event.target.value);
                                    }}/>
                                    <input type="text" className="cr_inp" defaultValue={updateFoodObject.discription} placeholder="Description of the Food" onChange={(event)=>{
                                        readValue("discription",event.target.value);
                                    }}/>
                                    <div className="d-flex adFood_file justify-content-between">
                                        <h2>Image</h2>
                                        <input type="file" multiple className="cr_inp file_inp" onChange={(event)=>{
                                            readValue("contents",event.target.files[0]);
                                        }}/>
                                    </div>
                                    <select name = "food_type" onChange={(event)=>{
                                        readValue("food_type",event.target.value);
                                    }}>
                                        <option value="default">{updateFoodObject.food_type}</option>
                                        <option value="main_cource">Main Cource</option>
                                        <option value="starters">Starters</option>
                                        <option value="rice">Rice</option>
                                        <option value="beverages">Beverages</option>
                                        <option value="desserts">Desserts</option>
                                        <option value="bread">Bread</option>
                                        <option value="accompaniments">Accompaniments</option>
                                    </select>
                                    <select name = "food_categoty" onChange={(event)=>{
                                        readValue("food_category",event.target.value);
                                    }}>
                                        <option value="default">{updateFoodObject.food_category}</option>
                                        <option value="veg">Veg</option>
                                        <option value="non_veg">Non-Veg</option>
                                        <option value="vegan">Vegan</option>
                                    </select>
                                    
                                    
                                    <button className="cr_btn" type="submit">Update</button>
                            
                                </form>

                            </div>
                    </div>
                </div>
            ):null
        }
        <div className="top_mar">
            <div className="add_food_re d-flex justify-content-around mt-3 align-items-center">
                <h1 className="add_food_h1">Its time to add New Dish</h1>
                <button type="button" className="add_food_btn" onClick={()=>{
                    setAddFoodModal(true);
                }}>Add Food Item</button>
            </div>
            <div className="food_list_section d-flex justify-content-center">
                <div className="food_list_container">
                    <div className="left_pannel d-flex flex-column justify-content-start align-items-start pl-4">
                        <p>Main Cource</p>
                        <p>Starters</p>
                        <p>Beverages</p>
                        <p>Desserts</p>
                        <p>Bread</p>
                        <p>Accompaniments</p>
                        <p>Rice</p>
                    </div>
                    <div className="right_pannel">
                        {
                        

                        Object.keys(foodTypeList).map((foodKey,foodIndex)=>{
                                return(
                                    <div key={foodIndex}>
                                    <h1 className="food_type_list">{foodKey}</h1>
                                    {
                                        foodTypeList[foodKey].map((food,index)=>{
                                            let divImage = {
                                                backgroundImage : "url(" + food.contents[0] + ")" 
                                            };
                                            // let backImage = `Background-image: url(“${food.contents[0]}”)`;
                                            return(
                                                <div key = {index} className= "food_cart d-flex justify-content-around align-items-center">
                                                    <div className="img_cart" style={divImage}>
                                                        {/* <h1>food.contents[0]</h1> */}
                                                        {/* <img src={food.contents[0]}/> */}
                                                    </div>
                                                    <div className="desc_cart d-flex flex-column justify-content-center align-items-center">
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            {
                                                                food.food_category === "veg"?(
                                                                    <i className="veg_icon bi bi-square-fill mr-3"></i>
                                                                ):(
                                                                    <i className="non_veg_icon bi bi-square-fill mr-3"></i>
                                                                )
                                                            }
                                                            <h1 className="food_name">{food.food_item}</h1>
                                                        </div>
                                                        <h2><span>₹</span>{food.price}</h2>
                                                        <h2><span className="food_name">Available Quantity: </span>{food.quantity}</h2>
                                                        <h2 className="food_description">{food.discription}</h2>
                                                    </div>
                                                    <div className="update_delete d-flex flex-column">
                                                        <i className ="bi bi-pencil-fill" onClick={()=>{
                                                            setUpdateFoodObject(food);
                                                            setUpdateFoodModal(true);
                                                        }}></i>
                                                        <i className ="bi bi-trash3-fill" onClick={()=>{
                                                            setDeleteFoodId(food._id);
                                                            deleteFoodItem();
                                                        }}></i>
                                                    </div>

                                                </div>
                                            )
                                        })
                                    } 
                                    
                                    </div>
                                )
                        })
                                
                            
                        }
                    </div>
                </div>

            </div>
        </div>
        


        </>
        
    )
}


export default Homepage;