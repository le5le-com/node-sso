const express = require("express")
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require("uuid")
const app = express()
const port = 3000
const secretOrPrivateKey = "12345678" // 这是加密的key（密钥）

app.use(express.json())
// 登陆接口
app.post("/api/login", (req, res) => {
  // 1.假设用户名和密码校验通过

  // 2.签发token
  let content = { user: req.body.account } // 要生成token的主题信息
  let token = jwt.sign(content, secretOrPrivateKey, {
    expiresIn: 60 * 60 * 12, // 12小时过期
  })
  res.send({ status: 200, msg: "success", token })
})

app.get("/api/profile", (req, res) => {
  let token = req.headers.authorization // 从headers中获取token
  token = token.split(" ")[1];// Bearer xxx
  if(!token) return res.sendStatus(401);
  // 校验token
  jwt.verify(token, secretOrPrivateKey, function (err, decode) {
    console.log('err',err);
    if (err) {
      //  时间失效的时候/ 伪造的token
      res.sendStatus(401)
    } else {
      // 通过校验
      res.send({ username: decode.user, id: uuidv4() })
    }
  })
})
// 服务监听
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
