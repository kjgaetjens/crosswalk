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
        let sessionObj = result.data
        let sessionArray = sessionObj.sessions
        sessionArray.sort((a, b) => {
            if (a.status < b.status) {
                return -1
            } else if (a.status > b.status) {
                return 1
            } else {
                return 0
            }
        })

        setSessions({sessions: sessionArray})
    }

    return (
        <div>
            <div className="addSession">
                <h2>Add Session</h2>
                <form className="form-inline">
                    <label htmlFor="session">Session Name for URL:&nbsp;</label>
                    <input id="session" className="form-control" name="session" type="text" placeholder="eg. walkable-honolulu" onChange={(e) => handleSessionInputChange(e)}/>
                    <button className="btn btn-primary" onClick={() => createSession()}>Add</button>
                </form>
            </div>
            <h2>Your Sessions</h2>
            <table className="table">
                <tbody>
                {userSessions.sessions.map(session => {
                    if (session.status === 'ACTIVE') {
                        return (
                            <tr className="table-primary">
                                <td>{session.param}</td>
                                <td>{session.status}</td>
                                <td><a href={`/sessions/${session.id}`}>Info</a></td>
                                <td><a href={`/sessions/${session.id}/dashboard`}>Dashboard</a></td>
                            </tr>
                        )
                    } else {
                        return (
                            <tr className="">
                                <td>{session.param}</td>
                                <td>{session.status}</td>
                                <td><a href={`/sessions/${session.id}`}>Info</a></td>
                                <td><a href={`/sessions/${session.id}/dashboard`}>Dashboard</a></td>
                            </tr>
                        )
                    }
                })}
                </tbody>
            </table>
        </div>
        
    );
}

export default Sessions;
