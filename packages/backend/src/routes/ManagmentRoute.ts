import express from 'express'
import * as RoomReservationController from '../controllers/roomReservation.controller'

const router = express.Router()

router.post('/create', RoomReservationController.createOrderByCustomer)
// router.post('/', RoomReservationController.createWorkspaceMap)
// router.put('/:id', RoomReservationController.updateWorkspaceMap)
// router.delete('/:id', RoomReservationController.deleteWorkspaceMap)
// router.post('/filter', RoomReservationController.filterMap)

export default router
