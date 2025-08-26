import express from 'express'
import * as workspaceMapController from '../controllers/workspaceMap.controller'

const routerMap = express.Router()
routerMap.get('/all', workspaceMapController.getAllWorkspacesMap.bind(workspaceMapController))
routerMap.get('/get/:id', workspaceMapController.getWorkspaceMapById.bind(workspaceMapController))
routerMap.get('/by-name/:name', workspaceMapController.getWorkspaceMapByName.bind(workspaceMapController))
routerMap.post('/post-map', workspaceMapController.createWorkspaceMap.bind(workspaceMapController))
routerMap.patch('/update/:id', workspaceMapController.updateWorkspaceMap.bind(workspaceMapController))
routerMap.delete('/delete/:id', workspaceMapController.deleteWorkspaceMap.bind(workspaceMapController))


export default routerMap
