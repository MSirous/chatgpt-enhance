// import React from 'react';
import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = () => {

  const [userData, setUserData] = useState(null)

    useEffect(() => {

        const fetchUserDate = async () => {
            try {
                const response = await axios.get('http://localhost:5500/chat', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUserData(response.data);
            } catch (err) {
                console.log('Error Fetching user profile data: ' + err)
            }
        }

        console.log(fetchUserDate);
        fetchUserDate();
    }, [])


  return (
    <div className='chat'>
     
        <aside className='sidemenu'>
            <div className='side-menu-button'>
              <span>+</span>
              New Chat
            </div>
            
            {
              userData ? (  
              <div className="users-profile-navbar">
                                  
                      <div className="avator-profile">
                       {userData.full_name}
                   
                    </div>
                    </div>
                ) : (
                    <p>Loading user data</p>
                    
                )
                
            }

        </aside>
        <section className='chat-box'>
          <div className="chat-log">
            <div className="chat-message">
              <div className="chat-message-center">
              <div className="avator">
              </div>
              <div className="message">
                Hello there! How can I help you?
              </div>
              </div>
            </div>
            <div className="chat-message chatgpt">
              <div className="chat-message-center">
              <div className="avator">
              </div>
              <div className="message">
                Hello I am GPT
              </div>
              </div>
            </div>
          </div>
          
          <div 
          className="chat-input-holder">
            <textarea 
            rows="1"
            className="chat-input-textarea"
            placeholder="Type  your message here ... ">
            </textarea>
            </div>

            

        </section>
    </div>
  )
  
}




export default Chat
