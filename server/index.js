const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./authRouter')
const gameRouter = require('./gameRouter')
const cors = require('cors')
const socketIo = require('socket.io')
const http = require('http')
const GameModel = require('./models/CustomMatch/Game')

const PORT = process.env.PORT || 7000

const app = express()
const onlineMembers = http.createServer(app)
const server = http.createServer(app)

const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const socketIoMem = socketIo(onlineMembers, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

// eslint-disable-next-line no-unused-vars
var onlineUsers = []
var hasCopie = false
var arrayUsers = []
var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
var possibleMaps = ['Актуон', 'Аквариум', 'Замки', 'Фернигад', 'Фортис', 'Критаз', 'Джунглиос', 'Криментис', 'Пробуждение', 'Тангенс', 'Тростер', 'Юнона', 'Зелнес', 'Зимперия']
var randomID = ''
var discordLinks = ['https://discord.gg/3HVUgCbJJ7', 'https://discord.gg/YHTw8QPYKw', 'https://discord.gg/QaypZN8tzV', 'https://discord.gg/PzZK5aHqKS']
var userFound = false

// SELECTING PEOPLE

io.on('connection', (socket) => {
  console.log('user connected under', socket.id)

  socket.emit('inGame', true)

  socket.on('connectToGame', data => {
    console.log(data)
    arrayUsers.map((item, key) => {
      if (item.nickname === data[1].nickname) {
        userFound = true
      }
    })
    if (userFound === false) {
      arrayUsers.push({ id: data[0].id, nickname: data[1].nickname })
      if (arrayUsers.length >= 8) {
        for (let j = 0; j < 25; j++) {
          randomID += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        var map = possibleMaps[Math.round(Math.random() * (possibleMaps.length - 1))]
        var link = discordLinks[Math.round(Math.random() * (discordLinks.length - 1))]
        const game = new GameModel({ id: randomID, mapName: map, startedTime: Date.now(), players: arrayUsers, discordLink: link })
        game.save()
        io.emit('connectToGame', { data: arrayUsers, gameID: randomID })
        randomID = ''
      } else {
        io.emit('connectToGame', { data: arrayUsers })
      }
    } else {
      if (arrayUsers.length >= 8) {
        const game = new GameModel({ id: randomID, mapName: map, startedTime: Date.now(), players: arrayUsers, discordLink: link })
        game.save()
        io.emit('connectToGame', { data: arrayUsers, gameID: randomID })
        randomID = ''
      } else {
        io.emit('connectToGame', { data: arrayUsers })
      }
    }
    userFound = false
  })

  // transport close BvGWJ_HJZK3ypWn1AAAF
  //   [
  //   { id: '1zreR-KtVnsMKFLJAAAB', nickname: 'saitly' },
  //     { id: 'uSi3MBQBAPIq8ACJAAAD', nickname: 'saitly' },
  //     { id: 'BvGWJ_HJZK3ypWn1AAAF', nickname: 'sam' }
  //   ]

  socket.on('disconnect', (reason) => {
    console.log(reason, socket.id)
    // eslint-disable-next-line array-callback-return,no-undef
    var index = arrayUsers.findIndex(n => {
      console.log('ITEM ID: ', n.id)
      return n.id === socket.id
    })
    if (index !== -1) {
      arrayUsers.splice(index, 1)
      io.emit('connectToGame', { data: arrayUsers })
    }

    console.log(arrayUsers)
  })
})

// DISPLAY ONLINE

socketIoMem.on('connection', (socket) => {
  console.log('user connected under', socket.id)

  socket.on('connectToServer', (data) => {
    // eslint-disable-next-line array-callback-return
    onlineUsers.map((item, key) => {
      if (item.nickname === data.nickname) {
        hasCopie = true
      }
    })

    if (hasCopie !== true && data?.nickname) {
      onlineUsers.push(data)
    }

    socket.emit('connectToServer', onlineUsers)
    hasCopie = false
  })

  socket.on('disconnect', (reason) => {
    console.log(reason, socket.id)
    // eslint-disable-next-line array-callback-return,no-undef
    var index = onlineUsers.findIndex(n => {
      console.log('ITEM ID: ', n.id)
      return n.id === socket.id
    })
    if (index !== -1) {
      onlineUsers.splice(index, 1)
      io.emit('connectToServer', { data: onlineUsers })
    }

    console.log(onlineUsers)
  })
})

// CONNECT SOCKETS

server.listen(5001, err => {
  if (err) console.log(err)
  console.log('Server running on Port ', 5001)
})

onlineMembers.listen(5002, err => {
  if (err) console.log(err)
  console.log('Server running on Port ', 5002)
})

app.use(express.json())
app.use(cors())
app.use('/auth', authRouter)
app.use('/game', gameRouter)

const start = async () => {
  try {
    await mongoose.connect('mongodb+srv://Jassix:YSqngMtg2N012nun@cluster0.oxylg.mongodb.net/League?retryWrites=true&w=majority')
    app.listen(PORT, () => console.log(`server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
