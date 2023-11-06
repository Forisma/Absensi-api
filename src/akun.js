import express from 'express'
import { jwtDecode } from 'jwt-decode';
import User from './schema/User.js';
import bcrypt from 'bcrypt'
import { encryptObject } from './utils.js';

const route = express.Router()

route.post('/daftar', async (req, res) => {
    const dataUser = req.body
    //try {
        const exitingUser = await User.findOne({nama: req.body.nama})
        if (exitingUser) return res.status(409).json({ message: `Pengguna dengan nama "${dataUser.nama}" sudah ada` })

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        dataUser.hash = hashedPassword

        const user = new User(dataUser)

        await user.save().then(data => {
            res.status(201).json({ user: encryptObject(data), message: 'User berhasil daftar' })
        }).catch(err => {
            throw new Error(err)
        })
    //} catch (error) {
        //res.status(500).json({ message: 'Internal Server Error' })
    //}
})

route.post('/login/form', async (req, res) => {
    const { nama, password } = req.body;
    try {
        const user = await User.findOne({ nama })
        if (!user) {
          return res.status(401).json({ message: `Tidak ada pengguna dengan nama "${nama}"`});
        }
    
        bcrypt.compare(password, user.hash, (err, result) => {
            if (result) {
                res.json({user: encryptObject(user), message: 'Login successful' });
            } else {
                res.status(401).json({ message: 'Password salah!' });
            }
        })
    
      } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
      }
})
route.post('/login/google', async (req, res) => {
    const {picture, email} = jwtDecode(req.body.credential)
    const user = await User.findOne({email: email})

    if (!user) return res.status(401).json({ message: `Tidak ditemukan akun dengan email yang sama`});

    if (user.avatar !== picture) {
        user.avatar = picture
        await user.save()
    }

    res.json({user: encryptObject(user), msg: 'ok'})
})

route.post('/bind/google', async (req, res) => {
    const {picture, email} = jwtDecode(req.body.credential)
    const user = await User.findByIdAndUpdate(req.body._id, {$set: {email, avatar: picture}}, {new: true})
    res.json({user: encryptObject(user), msg: 'ok'})
})

export default route
