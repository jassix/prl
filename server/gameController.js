const Player = require('./models/Player')
const Match = require('./models/Match')
const Team = require('./models/Team')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./config')
const axios = require('axios')
const { response } = require('express')
const User = require('./models/User')
const GameGenerated = require('./models/CustomMatch/Game')

class gameController {
  // SOLO

  async getGeneratedMaps (req, res) {
    try {
      const game = await GameGenerated.find()
      res.json(game)
    } catch (e) {
      console.log(e)
    }
  }

  async getGeneratedMap (req, res) {
    try {
      const { id } = req.params
      const game = await GameGenerated.findOne({ id })
      res.json(game)
    } catch (e) {
      console.log(e)
    }
  }

  async removeGeneratedMaps (req, res) {
    try {
      const game = await GameGenerated.remove()
      res.json(game)
    } catch (e) {
      console.log(e)
    }
  }

  //

  async addPlayer (req, res) {
    try {
      const { username, rating } = req.body
      const candidate = await Player.findOne({ username })
      if (candidate) {
        return res.status(400).json({ message: 'Игрок с таким именем уже существует' })
      }
      const player = new Player({ username, rating })
      await player.save()
      return res.json({ message: 'Пользователь успешно зарегистрирован' })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'error' })
    }
  }

  async addChief (req, res) {
    try {
      const { username, name } = req.body
      await Team.findOneAndUpdate({ name }, { chief: username })
      return res.json({ message: 'Пользователь успешно добавлен' })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'error' })
    }
  }

  async getPlayers (req, res) {
    try {
      const players = await Player.find()
      res.json(players)
    } catch (e) {
      console.log(e)
    }
  }

  async getPlayer (req, res) {
    try {
      const { username } = req.params
      const player = await Player.find({ username })
      res.json(player)
    } catch (e) {
      console.log(e)
    }
  }

  async getPlayersByMatch (req, res) {
    try {
      const { id } = req.params
      const player = await Player.find({ matches: { value: id } })
      res.json(player)
    } catch (e) {
      console.log(e)
    }
  }

  async deletePlayers (req, res) {
    try {
      const players = await Player.remove()
      res.json(players)
    } catch (e) {
      console.log(e)
    }
  }

  async deletePlayer (req, res) {
    try {
      const { username } = req.params
      const player = await Player.find({ username }).remove().exec()
      res.json(player)
    } catch (e) {
      console.log(e)
    }
  }

  async getMatches (req, res) {
    try {
      const matches = await Match.find()
      res.json(matches)
    } catch (e) {
      console.log(e)
    }
  }

  async updatePlayer (req, res) {
    try {
      const { username, rating } = req.body
      const player = await Player.update({ username }, { rating })
      res.json(player)
    } catch (e) {
      console.log(e)
    }
  }

  async addMatch (req, res) {
    try {
      const { id } = req.params
      let data
      let blueNicknames
      let redNicknames
      await axios.get(`https://api.vimeworld.com/match/${id}`).then(response => {
        data = response.data
      })

      const match = new Match({ value: id, mapName: data.mapName, date: Date.now() })
      await match.save()

      if (data?.game === 'BWH' && data?.mapId.slice(-4) === '4x2H') {
        const blueId = data?.teams[1].members
        const redId = data?.teams[0].members

        await axios.get(`https://api.vimeworld.com/user/${blueId[0]},${blueId[1]},${blueId[2]},${blueId[3]}`).then(response => {
          blueNicknames = response.data
        })

        await axios.get(`https://api.vimeworld.com/user/${redId[0]},${redId[1]},${redId[2]},${redId[3]}`).then(response => {
          redNicknames = response.data
        })

        if (data?.winner?.team === 'blue') {
          for (let i = 0; i < 4; i++) {
            const blueRating = await Player.findOne({ username: blueNicknames[i]?.username })
            const redRating = await Player.findOne({ username: redNicknames[i]?.username })
            await Player.findOneAndUpdate({ username: blueNicknames[i]?.username }, { rating: blueRating.rating + 23 })
            await Player.findOneAndUpdate({ username: blueNicknames[i]?.username }, { $push: { matches: { value: id, date: Date.now(), duration: data.end - data.start, mapName: data.mapName, win: true } } })
            await Player.findOneAndUpdate({ username: redNicknames[i]?.username }, { rating: redRating.rating - 17 })
            await Player.findOneAndUpdate({ username: redNicknames[i]?.username }, { $push: { matches: { value: id, date: Date.now(), duration: data.end - data.start, mapName: data.mapName, win: false } } })
          }

          res.status(200).json({ message: 'game added into DB' })
        } else {
          for (let i = 0; i < 4; i++) {
            const blueRating = await Player.findOne({ username: blueNicknames[i]?.username })
            const redRating = await Player.findOne({ username: redNicknames[i]?.username })
            await Player.findOneAndUpdate({ username: blueNicknames[i]?.username }, { rating: blueRating.rating - 17 })
            await Player.findOneAndUpdate({ username: blueNicknames[i]?.username }, { $push: { matches: { value: id, date: Date.now(), duration: data.end - data.start, mapName: data.mapName, win: false } } })
            await Player.findOneAndUpdate({ username: redNicknames[i]?.username }, { rating: redRating.rating + 23 })
            await Player.findOneAndUpdate({ username: redNicknames[i]?.username }, { $push: { matches: { value: id, date: Date.now(), duration: data.end - data.start, mapName: data.mapName, win: true } } })
          }

          res.status(200).json({ message: 'game added into DB' })
        }
      } else {
        res.status(400).json({ message: 'Invalid request! Game is not BWH or not 4x2H format' })
      }
    } catch (e) {
      console.log(e)
    }
  }

  // TEAM

  async createTeam (req, res) {
    try {
      const { name } = req.params
      const candidate = await Team.findOne({ name })
      if (candidate) {
        return res.status(400).json({ message: 'Команда с такими именем уже существует' })
      }
      const team = new Team({ name, rating: 1000 })
      await team.save()
      return res.json({ message: 'Команда успешно создана' })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'error' })
    }
  }

  async getTeams (req, res) {
    try {
      const teams = await Team.find()
      return res.json(teams)
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'error' })
    }
  }

  async getTeam (req, res) {
    try {
      const { name } = req.params
      const team = await Team.findOne({ name })
      return res.json(team)
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'error' })
    }
  }

  async addPlayerTeam (req, res) {
    try {
      const { name, player } = req.body
      const findPlayer = await Team.findOne({ players: player })
      if (findPlayer) {
        return res.json({ message: `${player} уже состоит в команде ${findPlayer.name}` })
      }
      await Team.findOneAndUpdate({ name }, { $push: { players: player } })
      return res.json({ message: `${player} добавлен в команду ${name}` })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'error' })
    }
  }

  async removePlayerTeam (req, res) {
    try {
      const { name, player } = req.body
      const findPlayer = await Team.findOneAndRemove({ players: player })
      return res.json({ message: `${player} удален из команды ${name}` })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'error' })
    }
  }

  async addRatingTeam (req, res) {
    try {
      const { id } = req.params
      let data
      let blueNicknames
      let redNicknames
      await axios.get(`https://api.vimeworld.com/match/${id}`).then(response => {
        data = response.data
      })

      if (data?.game === 'BWH' && data?.mapId.slice(-4) === '4x2H') {
        const blueId = data?.teams[1].members
        const redId = data?.teams[0].members

        await axios.get(`https://api.vimeworld.com/user/${blueId[0]},${redId[0]}`).then(response => {
          blueNicknames = response.data[0].username
          redNicknames = response.data[1].username
        })

        const blueTeam = await Team.findOne({ players: blueNicknames })
        const redTeam = await Team.findOne({ players: redNicknames })

        if (data?.winner?.team === 'blue') {
          await Team.findOneAndUpdate({ name: blueTeam?.name }, { rating: blueTeam?.rating + 23 })
          await Team.findOneAndUpdate({ name: redTeam?.name }, { rating: blueTeam?.rating - 17 })
        } else {
          await Team.findOneAndUpdate({ name: blueTeam?.name }, { rating: blueTeam?.rating - 17 })
          await Team.findOneAndUpdate({ name: redTeam?.name }, { rating: redTeam?.rating + 23 })
        }

        res.status(200).json('game added into DB')
      } else {
        res.status(400).json('Invalid request! Game is not BWH or not 4x2H format')
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new gameController()
