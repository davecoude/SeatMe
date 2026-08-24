import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())

console.log(process.env.NODE_ENV)

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: "ok"
  })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})