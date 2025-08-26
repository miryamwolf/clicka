import { Request, Response } from 'express'
import * as RoomreservationService from '../services/roomReservation.service'

export async function createOrderByCustomer(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.createOrderByCustomer(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function orderConfirmation(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.orderConfirmation(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function deleteOrder(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.deleteOrder(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function updateOrder(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.updateOrder(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function checkValidOrder(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.checkValidOrder(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function messageOnCinfirmation(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.messageOnCinfirmation(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function createOrderByUsers(req: Request, res: Response) {
  try {
    // const result = await RoomreservationService.createOrderByUsers(req.params.id)
    // res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function paymentManagement(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.paymentManagement(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function calculateFines(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.calculateFines(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function validUsers(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.validUsers(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function checkOrders(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.checkOrders(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function sendApprovalReminder(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.sendApprovalReminder(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function recalculateCharge(req: Request, res: Response) {
  try {
    const result = await RoomreservationService.recalculateCharge(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}