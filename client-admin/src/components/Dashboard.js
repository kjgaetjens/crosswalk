import React,{useState, useEffect} from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import {CSVLink, CSVDownload} from 'react-csv'
import * as config from '../env.js'

//move to style sheet
const mapStyles = {
    width: '50%',
    height: '50%',
}

function Dashboard(props) {

    var mapElement = null
    const setMapElementRef = element => {
        mapElement = element
    }
    const zoomToClusters = () => {
        if (mapElement) adjustMap(mapElement.props, mapElement.map)
    }


    const [dashboardParams, setDashboardParams] = useState({radius: 100, minPoints: 2, displayNoise: false})
    const [dashboardInfo, setDashboardInfo] = useState({clusters: [], noise: {}})
    const [rawCsvData, setRawCsvData] = useState({content: []})
    const [clusteredCsvData, setClusteredCsvData] = useState({content: []})
    
    const sessionId = props.match.params.sessionid


    useEffect(() => {
        getDashboardInfo()
        getRawCsvData()
    },[dashboardParams])
  

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

        getClusteredCsvData(dashboardObj)
    }

    const getRawCsvData = async () => {
        let result = 
            await fetch(`http://localhost:3001/sessions/${sessionId}/rawcsv`, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
        let rawCsvDataObj = await result.json()

        setRawCsvData({content: rawCsvDataObj.coordinates})
    }

    const getClusteredCsvData = (clusteredDataObj) => {
        let contentArray = [["id", "longitude", "latitude", "is_nearest_to_center", "is_noise"]]
        let clusterId = 0
        if (clusteredDataObj.clusters.length > 0) {
            for (let i=0; i<clusteredDataObj.clusters.length; i++) {
                clusterId += 1
                let centerPointLong = clusteredDataObj.clusters[i].centerPoint.longitude
                let centerPointLat = clusteredDataObj.clusters[i].centerPoint.latitude
                clusteredDataObj.clusters[i].coordinates.forEach(coordinate => {
                    let nearestToCenter = 0
                    if (coordinate.longitude === centerPointLong && coordinate.latitude === centerPointLat) {
                        nearestToCenter = 1
                    }
                    contentArray.push([clusterId, coordinate.longitude, coordinate.latitude, nearestToCenter, 0])
                })
            }
        }
        if (clusteredDataObj.noise.coordinates) {
            clusteredDataObj.noise.coordinates.forEach(coordinate => {
                clusterId += 1
                contentArray.push([clusterId, coordinate.longitude, coordinate.latitude, "NA", 1])
            })
        }

        setClusteredCsvData({content: contentArray})
    }


    const adjustMap = (mapProps, map) => {
        const {google, children} = mapProps;
        if (children.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            children.forEach(child => {
                if (child) {
                    child.forEach(grandchild => {
                        const {lat, lng} = grandchild.props.position;
                        bounds.extend(new google.maps.LatLng(lat, lng));
                    })
                }
            });
        
            map.fitBounds(bounds);
        }
    }

    const handleParamChange = (e) => {
        setDashboardParams({
            ...dashboardParams,
            [e.target.name]: e.target.value
        })
    }

    const handleNoiseParamChange = (e) => {
        setDashboardParams({
            ...dashboardParams,
            [e.target.name]: e.target.checked
        })
    }

    const createNoiseRows = () => {
        if (dashboardParams.displayNoise == true) {
            return (
                dashboardInfo.noise.coordinates.map(coordinate => {
                    return (
                        <tr className="noiserow">
                            <td>1</td>
                            <td>({coordinate.longitude}, {coordinate.latitude})</td>
                            <td></td>
                        </tr>
                        )
                    })
            )
        }
    }

    const createClusterMarkers = () => {
        if (dashboardInfo.clusters.length > 0) {
            return (
                dashboardInfo.clusters.map(cluster => {
                    return <Marker position={{ lat: cluster.centerPoint.latitude, lng: cluster.centerPoint.longitude}} />
                })
            )
        }
    }

    const createNoiseMarkers = () => {
        if (dashboardParams.displayNoise == true && dashboardInfo.noise.coordinates) {
            return (
                dashboardInfo.noise.coordinates.map(coordinate => {
                    return <Marker position={{ lat: coordinate.latitude, lng: coordinate.longitude}} />
                })
            )
        }
    }

    const createMapElement = () => {
        if (
            (dashboardParams.displayNoise == true && (dashboardInfo.clusters.length > 0 || dashboardInfo.noise.coordinates))
            || 
            (dashboardParams.displayNoise == false && dashboardInfo.clusters.length > 0)
            ) {
                return (
                    <div>
                    <button onClick={() => zoomToClusters()}>Zoom to Clusters</button>                 
                    <Map
                        google={props.google}
                        // zoom={8}
                        style={mapStyles}
                        initialCenter={{ lat: 47.444, lng: -122.176}}
                        onReady = {adjustMap}
                        ref={setMapElementRef}
                    >
                        {createClusterMarkers()}
                        {createNoiseMarkers()}
                    </Map>
                    </div>
                )
            }
    }


    return (
        <div>
            <label htmlFor="radiusParam">Cluster Radius(meters)</label>
            <input id="radiusParam" name="radius" min="0" step="10" placeholder={dashboardParams.radius} value={dashboardParams.radius} type="number" onChange={(e) => handleParamChange(e)}/>
            <label htmlFor="minPointsParam">Cluster Minimum Points</label>
            <input id="minPointsParam" name="minPoints" type="number" min="1" step="1" placeholder={dashboardParams.minPoints}value={dashboardParams.minPoints} onChange={(e) => handleParamChange(e)}/>
            <label htmlFor="displayNoise">Show Noise</label>
            <input id="displayNoiseParam" name="displayNoise" type="checkbox" onChange={(e) => handleNoiseParamChange(e)}/>
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
                {createNoiseRows()}
                </tbody>
            </table>

            <CSVLink data={rawCsvData.content}>Download Raw Data</CSVLink>
            <CSVLink data={clusteredCsvData.content}>Download Cluster Data</CSVLink>

            {createMapElement()}

        </div>
    );
}

export default GoogleApiWrapper({apiKey: config.REACT_APP_GOOGLE_MAPS_API_KEY})(Dashboard);
