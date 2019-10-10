import React, {useState, useEffect} from 'react'
import Map from './Dashboard2'
import GoogleApiComponent from '../utils/GoogleApiComponent'
import GoogleApi from '../utils/GoogleApiComponent'
import {CSVLink} from 'react-csv'
import * as env from '../env'
import axios from 'axios'
import legendDiscrete from '../images/legendDiscrete.jpg'
import legendContinuous from '../images/legendContinuous.jpg'

const Dashboard = (props) => {

    const [error, setError] = useState("")
    const [directions, setDirections] = useState({
        active: false,
        route: {}
    })

    const [dashboardParams, setDashboardParams] = useState({radius: 100, minPoints: 2, displayNoise: false, circleDisplay: 'normalized'})
    const [dashboardInfo, setDashboardInfo] = useState({range: 0, min: 0, clusters: [], noise: {}})
    const [rawCsvData, setRawCsvData] = useState({content: []})
    const [clusteredCsvData, setClusteredCsvData] = useState({content: []})
    const [selectedMarker, setSelectedMarker] = useState('')
    
    const sessionId = props.match.params.sessionid


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

    const handleCircleDisplayParamChange = (e) => {
        setDashboardParams({
            ...dashboardParams,
            [e.target.name]: e.target.value
        })
    }

    const getDashboardInfo = async () => {
        const radius = dashboardParams.radius
        const minPoints = dashboardParams.minPoints

        let result = await axios.get(`http://localhost:3001/sessions/${sessionId}/dashboard/${radius}/${minPoints}`)
        let dashboardObj = result.data
        let clusterRange = 0
        let clusterMin = 0
        if (dashboardObj.clusters.length > 0) {
            let clusterCountArray = dashboardObj.clusters.map(cluster => cluster.count)
            let clusterMax = Math.max(...clusterCountArray)
            clusterMin = Math.min(...clusterCountArray)
            clusterRange = clusterMax-clusterMin
        }

        setDashboardInfo({range: clusterRange, min: clusterMin, ...dashboardObj})
        getClusteredCsvData(dashboardObj)
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

    const getRawCsvData = async () => {
        let result = await axios.get(`http://localhost:3001/sessions/${sessionId}/rawcsv`)
        let rawCsvDataObj = result.data

        setRawCsvData({content: rawCsvDataObj.coordinates})
    }

    const createNoiseRows = () => {
        if (dashboardParams.displayNoise == true) {
            return (
                dashboardInfo.noise.coordinates.map(coordinate => {
                    return (
                        <tr className="noiserow">
                            <td>1</td>
                            <td>({coordinate.longitude}, {coordinate.latitude})</td>
                            <td>NA</td>
                            <td>NA</td>
                        </tr>
                        )
                    })
            )
        }
    }





    const renderMap = () => {
        if (
            (dashboardParams.displayNoise == true && (dashboardInfo.clusters.length > 0 || dashboardInfo.noise.coordinates))
            || 
            (dashboardParams.displayNoise == false && dashboardInfo.clusters.length > 0)
            ) {
            return (
                <div>
                    <h2>Cluster Map</h2>
                    <div className="mapDiv">
                        <Map
                            center={{ lat: 47.444, lng: -122.176}}
                            google={props.google}
                            googleMapURL={toString(GoogleApi({}))}
                            dashboardInfo={dashboardInfo}
                            displayNoise={dashboardParams.displayNoise}
                            circleDisplay={dashboardParams.circleDisplay}
                            rawCsvData={rawCsvData}
                            selectedMarker={selectedMarker}
                            loadingElement={<div className='loadingElement'style={{ height: `100%` }}>Map is Loading....</div>}
                            // initialCenter={{ lat: 47.444, lng: -122.176}}
                            containerElement={<div className='containerElement' />}
                            mapElement={<div className='mapElement' />}
                        />
                    </div> 
                </div>
                )
        } else {
            return <div className="mapDiv">Loading.....</div>
        }
    }



    useEffect(() => {
        getDashboardInfo()
        getRawCsvData()
    }, [dashboardParams, selectedMarker])


    return (
        <div className="dashboard">
            <div className="clusterParams">
            <h2>Cluster Parameters</h2>
            <form className="form-inline">
                <label htmlFor="radiusParam">Cluster Radius(approx. meters):&nbsp;</label>
                <input id="radiusParam" className="form-control" name="radius" min="0" step="10" placeholder={dashboardParams.radius} value={dashboardParams.radius} type="number" onChange={(e) => handleParamChange(e)}/>
                <label htmlFor="minPointsParam">Cluster Minimum Points:&nbsp;</label>
                <input id="minPointsParam" className="form-control" name="minPoints" type="number" min="1" step="1" placeholder={dashboardParams.minPoints}value={dashboardParams.minPoints} onChange={(e) => handleParamChange(e)}/>
                <div className="form-check">
                    <label htmlFor="displayNoise" className="form-check-label">Show Noise:&nbsp;</label>
                    <input id="displayNoiseParam" className="form-check-input" name="displayNoise" type="checkbox" onChange={(e) => handleNoiseParamChange(e)}/>
                </div>
            </form>
            <form>
                <div className="circle-display-div">
                    <label>Cluster Circle Display:&nbsp;</label>
                    <input type="radio" name="circleDisplay" value="normalized" onClick={(e) => handleCircleDisplayParamChange(e)} defaultChecked />
                    <img src={legendContinuous} />
                    <input type="radio" name="circleDisplay" value="iqr" onClick={(e) => handleCircleDisplayParamChange(e)} />
                    <img src={legendDiscrete} />
                </div>
            </form>
            </div>

            {renderMap()}
            <div className="dashboardTable">
            <h2>Cluster Data</h2>
            <CSVLink className="csv-link" filename={"raw.csv"} data={rawCsvData.content}>Download Raw Data</CSVLink>
            <CSVLink className="csv-link" filename={"clusters.csv"} data={clusteredCsvData.content}>Download Cluster Data</CSVLink>
            <table className="table table-bordered table-hover">
                <thead>
                    <tr className="thead-light">
                        <th scope="col">Count</th>
                        <th scope="col">Coordinates (lng, lat)</th>
                        <th scope="col">Nearest to Center (lng, lat)</th>
                        <th scope="col">Address Nearest to Center (approx.)</th>
                    </tr>
                </thead>
                <tbody>
                {dashboardInfo.clusters.map(cluster => {
                    return (
                        <tr onClick={() => setSelectedMarker(cluster.id)}>
                            <td>{cluster.count}</td>
                            <td>{cluster.coordinates.map(coordinate => {
                                return `(${coordinate.longitude}, ${coordinate.latitude}), `
                            })}</td>
                            <td className="centerCoordinateColumn">({cluster.centerPoint.longitude}, {cluster.centerPoint.latitude})</td>
                            <td className="addressColumn">{cluster.centerPoint.address}</td>
                        </tr>
                        )
                    })}
                {createNoiseRows()}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default GoogleApiComponent({
    apiKey: env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'geometry']
})(Dashboard)