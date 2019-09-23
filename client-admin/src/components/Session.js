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
        console.log(sessionObj)
        setSessionInfo({...sessionObj})
    }


    return (
        <div>
            <h4>Id: {sessionInfo.id}</h4>
            <h4>URL: http://localhost:3000/{sessionInfo.param}</h4>
            <h4>Status: {sessionInfo.status}</h4>
            {/* <button onClick={() => createSession()}>Submit</button> */}
        </div>
    );
}

export default Session;
