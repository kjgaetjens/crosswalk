import React,{useState, useEffect} from 'react';
import axios from 'axios'

function Session(props) {

    const [sessionInfo, setSessionInfo] = useState({id: '', param: '', status: ''})
    
    const sessionId = props.match.params.sessionid

    useEffect(() => {getSessionInfo()},[])
  
    const getSessionInfo = async () => {
        let result = 
            await axios.get(`http://localhost:3001/sessions/${sessionId}`)
        let sessionObj = result.data
        
        setSessionInfo({...sessionObj})
    }

    const activateSession = async () => {
        await axios.post(`http://localhost:3001/sessions/start-session`, {sessionId: sessionInfo.id})
        
        //should wait for a succesful response before executing
        getSessionInfo()
    }

    const deactivateSession = async () => {
        await axios.post(`http://localhost:3001/sessions/stop-session`, {"sessionId": sessionInfo.id})

        //should wait for a succesful response before executing
        getSessionInfo()
    }


    return (
        <div className="sessionDiv">
            <h2>Session Info</h2>
            <h4>ID: {sessionInfo.id}</h4>
            <h4>URL: http://localhost:3000/{sessionInfo.param}</h4>
            <h4>Status: {sessionInfo.status}</h4>
            {sessionInfo.status === 'INACTIVE' ? <button className="btn btn-primary" onClick={() => activateSession()}>Activate</button> : null}
            {sessionInfo.status === 'ACTIVE' ? <button className="btn btn-primary" onClick={() => deactivateSession()}>Deactivate</button> : null}
        </div>
    );
}

export default Session;
