import React,  { useState, useEffect } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { deleteConversations as deleteConversationsFromStore } from "../dashboardSlice";
import { deleteConversations } from "../../socketConnection/socketConn";




const DeleteConversationsButton = () => {
  const dispatch = useDispatch();

  const handleDeleteConversations = () => {
    dispatch(deleteConversationsFromStore([]));
    deleteConversations();
  };

  // chat part
// const Chat = () => {
  const [userData, setUserData] = useState(null)
    useEffect(() => {

        const fetchUserDate = async () => {
            try {
                const response = await axios.get('http://localhost:9000/chat', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUserData(response.data);
            } catch (err) {
                console.log('Error Fetching user profile data: ' + err)
            }
        }

        console.log(fetchUserDate);
        fetchUserDate();
    }, []);
  return (
    <div
      className="list_item delete_conv_button"
      onClick={handleDeleteConversations}
    >
      <div className="list_item_icon">
        {/* <AiOutlineDelete color="white" /> */}
      </div>
      {
              userData ? (  
                <div>
                  <div className="list_item_text">
                     {userData.full_name}
                  </div>
                </div>
                ) : (
                  <p className="list_item_text">User Is loaded!</p>
                    
                )
            }
      
    </div>
  );
}

export default DeleteConversationsButton;
