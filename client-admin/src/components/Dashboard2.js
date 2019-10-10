import React, {useState, useEffect} from 'react'
import {withScriptjs, withGoogleMap, GoogleMap, InfoWindow, Marker} from 'react-google-maps'
import {determineIQR} from './componentFunctions/IQR'
import * as env from '../env'


const Map = withScriptjs(withGoogleMap((props) => {
    var mapElement = null
    const setMapElementRef = element => {
        mapElement = element
    }

    const [infoWindowCluster, setInfoWindowCluster] = useState('')
    
    const handleInfoToggle = (clusterId) => {
        setInfoWindowCluster(clusterId)
    }

    const handleInfoClose = () => {
        setInfoWindowCluster('')
    }

    //this adjust map was implemented to adjust boundaries to visible markers
    // const adjustMap = (mapProps, map) => {
    //     const {google, children} = mapProps;
    //     if (children.length > 0) {
    //         const bounds = new google.maps.LatLngBounds();
    //         children.forEach(child => {
    //             if (child) {
    //                 child.forEach(grandchild => {
    //                     const {lat, lng} = grandchild.props.position;
    //                     bounds.extend(new google.maps.LatLng(lat, lng));
    //                 })
    //             }
    //         });
        
    //         map.fitBounds(bounds);
    //     }
    // }
    
    const adjustMapTwo = () => {
        if (mapElement) {
            const mapProps = mapElement.props
            const map = mapElement
            const {google, children} = mapProps;
            const rawCsvData = props.rawCsvData
            if (props.rawCsvData.content.length > 1) {
                const bounds = new google.maps.LatLngBounds();
                for (let i = 1; i < rawCsvData.content.length; i++) {
                    const lat = rawCsvData.content[i][1]
                    const lng = rawCsvData.content[i][0]
                    bounds.extend(new google.maps.LatLng(lat, lng));
                }
            
                map.fitBounds(bounds);
            }
        }

    }


    //change icons
    const createIQRMarkers = () => {
        if (props.dashboardInfo.clusters.length > 0) {
            const {quartileOneArray, quartileTwoArray, quartileThreeArray} = determineIQR(props.dashboardInfo.clusters)
            let markerArray = []
            quartileOneArray.forEach((cluster) => {
                markerArray.push(<Marker key={cluster.id} position={{ lat: cluster.centerPoint.latitude, lng: cluster.centerPoint.longitude}} icon={{path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0', strokeColor:'#FF0000', strokeOpacity:0.8, strokeWeight:2, fillColor:'#FF0000', fillOpacity:0.35, scale:.4}} onClick={() => handleInfoToggle(cluster.id)} >{infoWindowCluster == cluster.id ? <InfoWindow onCloseClick={() => handleInfoClose()}><div><h6>{cluster.centerPoint.address}</h6><h6>Count: {cluster.count}</h6></div></InfoWindow> : null}</Marker>)
            })
            quartileTwoArray.forEach((cluster) => {
                markerArray.push(<Marker key={cluster.id} position={{ lat: cluster.centerPoint.latitude, lng: cluster.centerPoint.longitude}} icon={{path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0', strokeColor:'#FF0000', strokeOpacity:0.8, strokeWeight:2, fillColor:'#FF0000', fillOpacity:0.35, scale:.8}} onClick={() => handleInfoToggle(cluster.id)} >{infoWindowCluster == cluster.id ? <InfoWindow onCloseClick={() => handleInfoClose()}><div><h6>{cluster.centerPoint.address}</h6><h6>Count: {cluster.count}</h6></div></InfoWindow> : null}</Marker>)
            })
            quartileThreeArray.forEach((cluster) => {
                markerArray.push(<Marker key={cluster.id} position={{ lat: cluster.centerPoint.latitude, lng: cluster.centerPoint.longitude}} icon={{path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0', strokeColor:'#FF0000', strokeOpacity:0.8, strokeWeight:2, fillColor:'#FF0000', fillOpacity:0.35, scale:1.2}} onClick={() => handleInfoToggle(cluster.id)} >{infoWindowCluster == cluster.id ? <InfoWindow onCloseClick={() => handleInfoClose()}><div><h6>{cluster.centerPoint.address}</h6><h6>Count: {cluster.count}</h6></div></InfoWindow> : null}</Marker>)
            })
            return (markerArray)
        }
    }

    const createIQRMarkersNoise = () => {
        return props.dashboardInfo.noise.coordinates.map((coordinate, i) => <Marker key={i} position={{ lat: coordinate.latitude, lng: coordinate.longitude}} icon={{path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0', strokeColor:'#800080', strokeOpacity:0.8, strokeWeight:2, fillColor:'#800080', fillOpacity:0.10, scale:.2}} />)
    }

    const createCircles = () => {
return props.dashboardInfo.clusters.map((cluster) => <Marker key={cluster.id} position={{ lat: cluster.centerPoint.latitude, lng: cluster.centerPoint.longitude}} icon={{path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0', strokeColor:'#FF0000', strokeOpacity:0.8, strokeWeight:2, fillColor:'#FF0000', fillOpacity:0.35, scale:determineScale(props.dashboardInfo.range, props.dashboardInfo.min, cluster.count)}}  onClick={() => handleInfoToggle(cluster.id)}>{infoWindowCluster == cluster.id ? <InfoWindow onCloseClick={() => handleInfoClose()}><div><h6>{cluster.centerPoint.address}</h6><h6>Count: {cluster.count}</h6></div></InfoWindow> : null}</Marker>)
    }

    const createCirclesNoise = () => {
        return props.dashboardInfo.noise.coordinates.map((coordinate, i) => <Marker key={i} position={{ lat: coordinate.latitude, lng: coordinate.longitude}} icon={{path: 'M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0', strokeColor:'#800080', strokeOpacity:0.8, strokeWeight:2, fillColor:'#800080', fillOpacity:0.10, scale:.2}} />)
    }


    const determineScale = (range, min, clusterSize) => {
        let ratio = range == 0 ? 0 : .8/range
        let size = ((clusterSize - min) * ratio) + .4
        return size
    }

    const renderMap = () => {
        return (
        <React.Fragment>
            <GoogleMap
                google={props.google}
                ref={setMapElementRef}
                options={{gestureHandling:'cooperative'}}
            >
                {props.circleDisplay == 'iqr' ? createIQRMarkers() : createCircles()}
                
                {props.displayNoise && props.circleDisplay == 'normalized' ? createCirclesNoise() : null}
                {props.displayNoise && props.circleDisplay == 'iqr' ? createIQRMarkersNoise() : null}
            </GoogleMap>
            <button className="zoom-button" onClick={() => adjustMapTwo()}>Zoom to Clusters</button>
            <h1>{props.testfunction}</h1> 
        </React.Fragment>
        )
    }


    useEffect(() => {
        adjustMapTwo()
    }, [props.dashboardInfo])

    useEffect(() => {
        adjustMapTwo()
        setInfoWindowCluster(props.selectedMarker)
        window.scrollTo({top:0, left:0, behavior:'smooth'})
    }, [props.selectedMarker])


    return (
        <React.Fragment>
        {renderMap()}
        </React.Fragment>
    )




}


))

export default Map
