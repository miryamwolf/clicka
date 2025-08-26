import express from 'express'
import * as mapLayoutController from '../controllers/mapLayout.controller'

const routerMap = express.Router()
routerMap.get('/all', mapLayoutController.getAll.bind(mapLayoutController))
routerMap.get('/get/:id', mapLayoutController.getLayoutById.bind(mapLayoutController))
routerMap.post('/post-layout', mapLayoutController.createLayout.bind(mapLayoutController))
routerMap.patch('/update/:id', mapLayoutController.updateLayout.bind(mapLayoutController))
routerMap.delete('/delete/:id', mapLayoutController.deleteLayout.bind(mapLayoutController))


export default routerMap
