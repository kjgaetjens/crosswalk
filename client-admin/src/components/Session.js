import React,{useState, useEffect} from 'react';

function Session(props) {

    const [sessionInfo, setSessionInfo] = useState({id: '', param: '', status: ''})
    
    const sessionId = props.match.params.sessionid

    useEffect(() => {getSessionInfo()},[])
  
    const getSessionInfo = async () => {
        let result = 
            await fetch(`http://localhost:3001/sessions/${sessionId}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'},
            })
        let sessionObj = await result.json()
        
        setSessionInfo({...sessionObj})
    }

    const activateSession = async () => {
        await fetch(`http://localhost:3001/start-session`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"sessionId": sessionInfo.id})
        })
        
        //should wait for a succesful response before executing
        getSessionInfo()
    }

    const deactivateSession = async () => {
        await fetch(`http://localhost:3001/stop-session`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"sessionId": sessionInfo.id})
        })

        //should wait for a succesful response before executing
        getSessionInfo()
    }


    return (
        <div>
            <h4>ID: {sessionInfo.id}</h4>
            <h4>URL: http://localhost:3000/{sessionInfo.param}</h4>
            <h4>Status: {sessionInfo.status}</h4>
            <button onClick={() => activateSession()}>Activate</button>
            <button onClick={() => deactivateSession()}>Deactivate</button>
        </div>
    );
}

export default Session;
