import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import zoneRoutes from "./modules/zones/zone.routes.js"
import deskRoutes from "./modules/desks/desks.routes.js"
import amenityRoutes from "./modules/amenities/amenities.routes.js"
import deskAmenityRoutes from "./modules/desks/desk-amenity.routes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use("/zones", zoneRoutes)
app.use("/desks", deskRoutes)
app.use("/desks", deskAmenityRoutes)
app.use("/amenities", amenityRoutes)

console.log(process.env.NODE_ENV)

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: "ok"
  })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})