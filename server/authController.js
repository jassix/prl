const User = require('./models/User')
const Role = require('./models/Role')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('./config')
const axios = require('axios')

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles
  }
  return jwt.sign(payload, secret, { expiresIn: '24h' })
}

class authController {
  async registration (req, res) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Ошибка при регистрации', errors })
      }
      const { username, password, secretKey } = req.body
      let data
      await axios.get(`https://api.vimeworld.com/misc/token/${username}`).then(response => {
        data = response.data
      }).catch(e => {
        res.json(e)
      })
      if (data.valid === true) {
        const nickname = data.owner.username
        const candidate = await User.findOne({ username: nickname })
        if (candidate) {
          return res.status(400).json({ message: 'Such a user already exists!' })
        }
        const hashPassword = bcrypt.hashSync(password, 7)
        let userRole = 'USER'
        if (secretKey === 'BEBRA_KEY') {
          userRole = 'ADMIN'
        }
        const user = new User({ username: nickname, password: hashPassword, roles: [userRole] })
        await user.save()
        return res.json({ message: 'User registered!' })
      } else {
        res.status(400).json({ message: 'Invalid Token!' })
      }
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Registration error' })
    }
  }

  async login (req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json({ message: `Пользователь ${username} не найден` })
      }
      const validPassword = bcrypt.compareSync(password, user.password)
      if (!validPassword) {
        return res.status(400).json({ message: 'Введен неверный пароль' })
      }
      const token = generateAccessToken(user._id, user.roles)
      return res.json({ token })
    } catch (e) {
      console.log(e)
      res.status(400).json({ message: 'Login error' })
    }
  }

  async getUsers (req, res) {
    try {
      const users = await User.find()
      res.json(users)
    } catch (e) {
      console.log(e)
    }
  }

  async compareToken (req, res) {
    try {
      return res.status(200).json({ message: true })
    } catch (e) {
      return res.status(400).json({ message: false })
    }
  }

  async compareRole (req, res) {
    try {
      return res.status(200).json({ message: true })
    } catch (e) {
      return res.status(400).json({ message: false })
    }
  }
}

module.exports = new authController()
