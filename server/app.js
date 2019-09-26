const express = require('express')
const cors = require('cors')
const app = express()
global.models = require('./models')
const PORT = 3001
require('dotenv').config()
const Location = require('./classes/location')
var clustering = require('density-clustering')
var dbscan = new clustering.DBSCAN()
var sphereKnn = require('sphere-knn')

// https://github.com/uhho/density-clustering/blob/master/README.md



app.use(cors())
app.use(express.json())

app.get('/sessions/:sessionid', async (req,res) => {

    const sessionId = parseInt(req.params.sessionid)

    let sessionRecord = await models.Session.findOne(
        {where:{id: sessionId}}
    )

    res.json(sessionRecord)
})

app.get('/sessions/:sessionid/rawcsv', async (req,res) => {
    const sessionId = parseInt(req.params.sessionid)

    let desiredCoordinateRecords = await models.DesiredCoordinate.findAll(
        {where:{sessionId: sessionId}}
    )

    let coordinates = [["longitude", "latitude"]]
    desiredCoordinateRecords.forEach(record => {
        coordinates.push([parseFloat(record.longitude), parseFloat(record.latitude)])
    })
    
    res.json({"coordinates":coordinates})

})

app.get('/sessions/:sessionid/dashboard/:radius/:minPoints', async (req,res) => {

    const sessionId = parseInt(req.params.sessionid)
    const radius = parseFloat(req.params.radius)/100000
    const minPoints = parseInt(req.params.minPoints)

    let desiredCoordinateRecords = await models.DesiredCoordinate.findAll(
        {where:{sessionId: sessionId}}
    )

    let coordinates = desiredCoordinateRecords.map(record => {
        return [record.latitude, record.longitude]
    })

    //figure out what the radius represents (coordinates?)
    let clusters = dbscan.run(coordinates, radius, minPoints)

    let rawClusterArray = clusters.map(cluster => {
        let clusterCoordinates = []
        cluster.forEach(coordinateOrder => {
            clusterCoordinates.push([parseFloat(coordinates[coordinateOrder][0]),parseFloat(coordinates[coordinateOrder][1])])
        })
        return clusterCoordinates
    })
    
    function getCenterPoint(data) {       
        if (!(data.length > 0)) {
            return false;
        } 

        var num_coords = data.length;

        var X = 0.0;
        var Y = 0.0;
        var Z = 0.0;

        for(i = 0; i < data.length; i++) {
            var lat = data[i][0] * Math.PI / 180;
            var lon = data[i][1] * Math.PI / 180;

            var a = Math.cos(lat) * Math.cos(lon);
            var b = Math.cos(lat) * Math.sin(lon);
            var c = Math.sin(lat);

            X += a;
            Y += b;
            Z += c;
        }

        X /= num_coords;
        Y /= num_coords;
        Z /= num_coords;

        var lon = Math.atan2(Y, X);
        var hyp = Math.sqrt(X * X + Y * Y);
        var lat = Math.atan2(Z, hyp);

        var newX = (lat * 180 / Math.PI);
        var newY = (lon * 180 / Math.PI);

        return [newX, newY];
    }


    let clusterObj = []
    for (let i = 0; i < clusters.length; i++) {
        let clusterCoordinates = []
        clusters[i].forEach(coordinateOrder => {
            clusterCoordinates.push({"latitude": parseFloat(coordinates[coordinateOrder][0]), "longitude": parseFloat(coordinates[coordinateOrder][1])})
        })
        let trueCenter = getCenterPoint(rawClusterArray[i])
        var lookup = sphereKnn(rawClusterArray[i])
        var nearestToTrueCenter = lookup(trueCenter[0], trueCenter[1], 1)
        let nearestToTrueCenterObj = {"latitude": nearestToTrueCenter[0][0],"longitude": nearestToTrueCenter[0][1]}

        clusterObj.push({"count": clusterCoordinates.length, "coordinates": clusterCoordinates, "centerPoint": nearestToTrueCenterObj})
    }
    clusterObj.sort((a, b) => {return b.count-a.count})

    let noise = dbscan.noise

    let noiseCoordinates = noise.map(noiseOrder => {
        return {"latitude": parseFloat(coordinates[noiseOrder][0]), "longitude": parseFloat(coordinates[noiseOrder][1])}
    })
    let noiseObj = {"count": noiseCoordinates.length, "coordinates": noiseCoordinates}

    let clusterNoiseObj = {"clusters": clusterObj, "noise": noiseObj}
    

    res.json(clusterNoiseObj)
})

app.post('/add-session', async (req,res) => {

    const param = req.body.param
    const status = req.body.status

    let sessionRecord = await models.Session.create({
        param: param,
        status: status
    })

    res.status(200).send() 
})

app.post('/start-session', async (req,res) => {

    const sessionId = req.body.sessionId

    let activateRecord = await models.Session.update(
        {status: 'ACTIVE'},
        {where: {id: sessionId} }
    )

    res.status(200).send() 
})

app.post('/stop-session', async (req,res) => {

    const sessionId = req.body.sessionId

    let activateRecord = await models.Session.update(
        {status: 'INACTIVE'},
        {where: {id: sessionId} }
    )

    res.status(200).send() 
})

//this will be for the admin side
app.get('/view-locations', (req,res) => {
    res.send('get test')
})


//set up post to add the lat/long to the db
app.post('/add-location', async (req,res) => {
    const sessionParam = req.body.sessionname
    const sessionRecord = await models.Session.findOne(
        {where:{param: sessionParam}}
    )
    const sessionId = await sessionRecord.id

    //not really sure I need to turn this into an object
    const location = new Location(req.body.lat, req.body.long)

    let locationRecord = await models.DesiredCoordinate.create({
        sessionId: sessionId,
        latitude: location.lat,
        longitude: location.long
    })

    res.status(200).send() 
})


app.listen(PORT, () => {
    console.log('Server is running...')
})