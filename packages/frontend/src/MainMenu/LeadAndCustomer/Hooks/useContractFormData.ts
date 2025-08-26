import { Contract, WorkspaceType, ContractStatus } from "shared-types";
import { ContractFormData } from "../Components/Contracts/editContract";

export const mapRawContractToCamelCase = (raw: any): Contract => ({
  ...raw,
  startDate: raw.start_date,
  endDate: raw.end_date,
  signDate: raw.sign_date,
  signedBy: raw.signed_by,
  witnessedBy: raw.witnessed_by,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
});

export const getContractFormData  = (contract: Contract | null): ContractFormData => {
  const terms = contract?.terms ?? {};
  return {
    status: contract?.status ?? ContractStatus.ACTIVE,
    version: contract?.version ? String(contract.version) : "",
    startDate: contract?.startDate?.slice(0, 10) ?? "",
    endDate: contract?.endDate?.slice(0, 10),
    signDate: contract?.signDate?.slice(0, 10),
    workspaceType: (terms as any)?.workspaceType ?? WorkspaceType.PRIVATE_ROOM1,
    workspaceCount: (terms as any)?.workspaceCount ?? 1,
    monthlyRate: (terms as any)?.monthlyRate ?? 0,
    duration: (terms as any)?.duration ?? 1,
    renewalTerms: (terms as any)?.renewalTerms ?? "",
    terminationNotice: (terms as any)?.terminationNotice ?? 0,
    specialConditions: (terms as any)?.specialConditions?.join(", ") ?? "",
    signedBy: contract?.signedBy ?? "",
    witnessedBy: contract?.witnessedBy ?? "",
    documents: contract?.documents ?? [],
  };
};
