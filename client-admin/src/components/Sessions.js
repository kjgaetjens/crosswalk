import React,{useState, useEffect} from 'react';
import axios from 'axios'
import * as env from '../env'

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
  
        await axios.post(`${env.serverURL}/sessions/add-session`, session)
  
        getSessions()
    }

    const activateSession = async (sessionId) => {
        await axios.post(`${env.serverURL}/sessions/start-session`, {sessionId: sessionId})
        
        //should wait for a succesful response before executing
        getSessions()
    }

    const deactivateSession = async (sessionId) => {
        await axios.post(`${env.serverURL}/sessions/stop-session`, {"sessionId": sessionId})

        //should wait for a succesful response before executing
        getSessions()
    }
  
    //change sessions and session to axios
    const getSessions = async () => {
        let result = 
            await axios.get(`${env.serverURL}/sessions/all`)
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
        <div className="sessions">
            <div className="sessions-list-div">
                <h2>Your Sessions</h2>
                <div className="sessions-list-table-div">
                <table className="table sessions-table">
                    <tbody>
                    {userSessions.sessions.map((session, i) => {
                        if (session.status === 'ACTIVE') {
                            return (
                                <tr key={i} className="lightsteelblue-row">
                                    <td>{session.param}</td>
                                    <td><a href={`/sessions/${session.id}/dashboard`}>Dashboard</a></td>
                                    <td className="status-text">{session.status}</td>
                                    <td><button className="btn btn-light deactivate" onClick={() => deactivateSession(session.id)}>Deactivate</button></td>
                                    <td><a href={`http://localhost:3000/${session.param}`} target="_blank">Live Link</a></td>
                                </tr>
                            )
                        } else {
                            return (
                                <tr key={i} className="">
                                    <td>{session.param}</td>
                                    <td><a href={`/sessions/${session.id}/dashboard`}>Dashboard</a></td>
                                    <td className="status-text">{session.status}</td>
                                    <td><button className="btn btn-primary activate" onClick={() => activateSession(session.id)}>Activate</button></td>
                                    <td><a href={`http://localhost:3000/${session.param}`} target="_blank">Live Link</a></td>
                                </tr>
                            )
                        }
                    })}
                    </tbody>
                </table>
                </div>
            </div>
            <div className="add-session-div">
                <h2>Add Session</h2>
                <form className="form-inline">
                    <label htmlFor="session"><h5>Session Name:</h5></label>
                    <input id="session" className="form-control" name="session" type="text" placeholder="eg. walkable-honolulu" onChange={(e) => handleSessionInputChange(e)}/>
                    <button className="btn btn-primary" onClick={() => createSession()}>Add</button>
                </form>
            </div>
        </div>
        
    );
}

export default Sessions;
