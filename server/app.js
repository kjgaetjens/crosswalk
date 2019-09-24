const express = require('express')
const cors = require('cors')
const app = express()
global.models = require('./models')
const PORT = 3001
const Location = require('./classes/location')
var clustering = require('density-clustering')
var dbscan = new clustering.DBSCAN()

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

app.get('/sessions/:sessionid/dashboard', async (req,res) => {

    const sessionId = parseInt(req.params.sessionid)
    const radius = req.body.radius
    const minPoints = req.body.minPoints

    let desiredCoordinateRecords = await models.DesiredCoordinate.findAll(
        {where:{sessionId: sessionId}}
    )

    let coordinates = desiredCoordinateRecords.map(record => {
        return [record.latitude, record.longitude]
    })

    //figure out what the radius represents (coordinates?)
    let clusters = dbscan.run(coordinates, radius, minPoints)

    let clusterObj = clusters.map(cluster => {
        let clusterCoordinates = []
        cluster.forEach(coordinateOrder => {
            clusterCoordinates.push({"latitude": parseInt(coordinates[coordinateOrder][0]), "longitude": parseInt(coordinates[coordinateOrder][1])})
        })
        return {"count": clusterCoordinates.length, "coordinates": clusterCoordinates}
    })

    let noise = dbscan.noise

    let noiseCoordinates = noise.map(noiseOrder => {
        return {"latitude": parseInt(coordinates[noiseOrder][0]), "longitude": parseInt(coordinates[noiseOrder][1])}
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