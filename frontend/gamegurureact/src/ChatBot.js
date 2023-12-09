import React from "react";
import { useEffect, useState, useRef} from "react";
import "./ChatBot.css"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'

const ChatBot = (props) => {
    const [open, setOpen] = useState(false);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);

    function ask(question){
        setLoading(true)
        setEntries([...entries, {type: 'user', content: question}])
        const requestOptions = {
            method: 'POST',
            accept: 'accept: text/plain',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameType: props.page, question: question})
        };
        fetch('https://localhost:7135/ChatBot', requestOptions)
            .then(response => response.json())
            .then(data => {
                setEntries(entries => entries.concat([{type: 'chatbot', content: data.result}]))
                setLoading(false)
            });
    }
    
    function handleTyping(event){
        if (event.key == 'Enter'){
            ask(event.target.value)
            event.target.value = "";
        }
    }

    return (
        <div id="ChatBot">
            <div className="header">
                <p>Chatbot</p>
                <FontAwesomeIcon icon={open ? faAngleDown : faAngleUp} className="icon" onClick={()=>setOpen(!open)}/>
            </div>
            {
                open &&
                <div id="Chat">
                    {entries.map((entry, i) => <div className={`entry ${entry.type}`}>{
                        <p key={i}>{entry.content}</p>
                    }</div>)}
                    {loading && <div className="entry chatbot">
                        <p>{`${'.'.repeat(new Date().getSeconds() % 3 + 1)}loading`}</p>
                    </div>}
                </div>
            }
            {
                open &&
                <input id="Input" placeholder="Enter your question here!" disabled={loading} onKeyDown={handleTyping}></input>
            }
        </div>
    )
  };
  
  export default ChatBot;
  