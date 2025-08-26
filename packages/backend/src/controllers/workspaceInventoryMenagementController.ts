// import { Request,Response } from "express";
// import workspaceInventoryMenagementService from '../services/workspaceInventoryManagement.service';

// export async function  getByAvialableStatus(req: Request, res: Response) {
//     try {
//       const result =await workspaceInventoryMenagementService.getByAvialableStatus(req.params.id);
//       res.json(result);
//     } catch (err:any) {
//        res.status(500).json({ message: err.message });
//     }
//   }
// export async function getAllTypes(req: Request, res: Response) {
//     try{
//       const result=await workspaceInventoryMenagementService.getAllTypes(req.params.id);
//       res.json(result);
//     }
//     catch(err:any){
//       res.status(500).json({message:err.message});
//     }
// }
// export async function getAllCpacities(req: Request, res: Response) {
//     try{
//       const result=await workspaceInventoryMenagementService.getAllCpacities(req.params.roomid);
//       res.json(result);
//     }
//     catch(err:any){
//       res.status(500).json({message:err.message});
//     }
// }
// export async function getBySpaceTypeAndCapacity(req: Request, res: Response) {
//     try{
//       const result=await workspaceInventoryMenagementService.getBySpaceTypeAndCapacity(req.params.id);
//       res.json(result);
//     }
//     catch(err:any){
//       res.status(500).json({message:err.message});
//     }
// }
// export async function createWorkspace(req: Request, res: Response) {
//     try{
//       const result=await workspaceInventoryMenagementService.createWorkspace(req.params.id);
//       res.json(result);
//     }
//     catch(err:any){
//       res.status(500).json({message:err.message});
//     }
// }
// export async function updateWorkSpaceById(req: Request, res: Response) {
//     try{
//       const result=await workspaceInventoryMenagementService.updateWorkSpaceById(req.params.id);
//       res.json(result);
//     }
//     catch(err:any){
//       res.status(500).json({message:err.message});
//     }
// }
// export async function deleteWorkSpaceById(req: Request, res: Response) {
//     try{
//       const result=await workspaceInventoryMenagementService.deleteWorkSpaceById(req.params.id);
//       res.json(result);
//     }
//     catch(err:any){
//       res.status(500).json({message: err.message});
//     }
// }
//   module.exports={
//     getByAvialableStatus,
//     getAllTypes,
//     getAllCpacities,
//     getBySpaceTypeAndCapacity,
//     createWorkspace,
//     updateWorkSpaceById,
//     deleteWorkSpaceById
// }