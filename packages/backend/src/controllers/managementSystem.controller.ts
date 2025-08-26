import { Request, Response } from 'express'
import * as systemService from '../services/management.service'

export async function checkAvailabilityRoom(req: Request, res: Response) {
  try {
    const result = await systemService.checkAvailabilityRoom(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function getAvailabilityForecast(req: Request, res: Response) {
  try {
    const result = await systemService.getAvailabilityForecast(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function getBulkAvailability(req: Request, res: Response) {
  try {
    const result = await systemService.getBulkAvailability(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function subscribeToLowAvailable(req: Request, res: Response) {
  try {
    const result = await systemService.subscribeToLowAvailable(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function getAvailabilityCalendar(req: Request, res: Response) {
  try {
    const result = await systemService.getAvailabilityCalendar(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function calculateAvailabilityWithConstraints(req: Request, res: Response) {
  try {
    const result = await systemService.calculateAvailabilityWithConstraints(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
export async function validateAvailabilityQuweies(req: Request, res: Response) {
  try {
    const result = await systemService.validateAvailabilityQuweies(req.params.id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}