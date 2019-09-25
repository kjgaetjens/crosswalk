import React,{useState, useEffect} from 'react';

function Dashboard(props) {

    const [dashboardParams, setDashboardParams] = useState({radius: 5, minPoints: 2, displayNoise: false})
    const [dashboardInfo, setDashboardInfo] = useState({clusters: [], noise: {}})
    
    const sessionId = props.match.params.sessionid

    useEffect(() => {getDashboardInfo()},[])
  

    const getDashboardInfo = async () => {
        const radius = dashboardParams.radius
        const minPoints = dashboardParams.minPoints

        let result = 
            await fetch(`http://localhost:3001/sessions/${sessionId}/dashboard/${radius}/${minPoints}`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
        let dashboardObj = await result.json()
        setDashboardInfo({...dashboardObj})
    }

    const handleParamChange = async (e) => {
        setDashboardParams({
            ...dashboardParams,
            [e.target.name]: e.target.value
        })
        
        //should wait for a succesful response before executing
        getDashboardInfo()
    }

    return (
        <div>
            <label htmlFor="radiusParam">Cluster Radius</label>
            <input id="radiusParam" name="radius" type="number" min="1" step="1" placeholder={dashboardParams.radius} onChange={(e) => handleParamChange(e)}/>
            <label htmlFor="minPointsParam">Cluster Minimum Points</label>
            <input id="minPointsParam" name="minPoints" type="number" min="1" step="1" placeholder={dashboardParams.minPoints} onChange={(e) => handleParamChange(e)}/>
            <table>
                <thead>
                    <tr>
                        <th>Count</th>
                        <th>Coordinates (longitude, latitude)</th>
                        <th>Coordinate Nearest to Center (longitude, latitude)</th>
                    </tr>
                </thead>
                <tbody>
                {dashboardInfo.clusters.map(cluster => {
                    return (
                        <tr>
                            <td>{cluster.count}</td>
                            <td>{cluster.coordinates.map(coordinate => {
                                return `(${coordinate.longitude}, ${coordinate.latitude}) `
                            })}</td>
                            <td>({cluster.centerPoint.longitude}, {cluster.centerPoint.latitude})</td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
