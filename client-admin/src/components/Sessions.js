import React,{useState, useEffect} from 'react';
import axios from 'axios'

function Sessions(props) {

    const [userSessions, setSessions] = useState({sessions: []})
    const [newSession, setSession] = useState({session:''})

    useEffect(() => {getSessions()},[])

    const handleSessionInputChange = (e) => {
        setSession({session: e.target.value})
    }
    
    const createSession = async () => {
        const param = newSession.session
        const status = 'INACTIVE'
        const session = {"param": param, "status": status}
  
        await axios.post('http://localhost:3001/sessions/add-session', session)
  
        getSessions()
    }
  
    //change sessions and session to axios
    const getSessions = async () => {
        let result = 
            await axios.get('http://localhost:3001/sessions/all')
        let sessionArray = result.data
        setSessions({sessions: sessionArray.sessions})
    }

    return (
        <div>
            <div>
                <label>Desired Session Name: </label>
                <input name="session" type="text" onChange={(e) => handleSessionInputChange(e)}/>
                <button onClick={() => createSession()}>Submit</button>
            </div>
            {userSessions.sessions.map(session => {
                return (
                    <div>
                        <a href={`/sessions/${session.id}`}>{session.param}</a><span> - {session.status}</span>
                    </div>
                )
            })}
        </div>
        
    );
}

export default Sessions;
