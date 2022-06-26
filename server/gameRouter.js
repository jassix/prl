const Router = require('express')
const router = new Router()
const controller = require('./gameController')
const { check } = require('express-validator')
const authMiddleware = require('./middleware/authMiddleware')
const roleMiddleware = require('./middleware/roleMiddleware')

// SOLO

router.post('/player/add', authMiddleware, roleMiddleware(['ADMIN']), controller.addPlayer)
router.get('/players', controller.getPlayers)
router.get('/matches', controller.getMatches)
router.get('/player/:username', controller.getPlayer)
router.delete('/player/:username', controller.deletePlayer)
router.put('/updatePlayer', authMiddleware, roleMiddleware(['ADMIN']), controller.updatePlayer)
router.get('/player/match/:id', controller.getPlayersByMatch)
router.put('/match/add/:id', authMiddleware, roleMiddleware(['ADMIN']), controller.addMatch)
router.delete('/players', authMiddleware, roleMiddleware(['ADMIN']), controller.deletePlayers)

router.get('/map', controller.getGeneratedMaps)
router.get('/map/:id', controller.getGeneratedMap)
router.delete('/map', controller.removeGeneratedMaps)

// TEAM

router.post('/team/create/:name', controller.createTeam)
router.get('/teams', controller.getTeams)
router.post('/team/player/add', controller.addPlayerTeam)
router.delete('/team/player/remove', controller.removePlayerTeam)
router.put('/team/match/add/:id', controller.addRatingTeam)
router.get('/team/:name', controller.getTeam)
router.post('/team/chief', controller.addChief)

module.exports = router
