
import type{ ID } from "shared-types";
import { create } from "zustand";


interface ReceiptAndDocumentsState  {
  // documents: GeneratedDocument[];
  // templates: DocumentTemplate[];
  // selectedDocument?: GeneratedDocument;
  // selectedTemplate?: DocumentTemplate;
  loading: boolean;

  // מסמכים
  fetchGeneratedDocuments: () => Promise<void>;
  // generateDocument: (request: GenerateDocumentRequest) => Promise<GeneratedDocument>;
  downloadDocument: (documentId: ID) => Promise<void>;
  sendDocumentByEmail: (documentId: ID, email: string) => Promise<void>;
  fetchDocumentForPreview: (documentId: ID) => Promise<void>;
  handleDeleteDocument: (documentId: ID) => Promise<void>;
  //handleSearch: (query: string) => void;
  //handleFilter: (filter: { type?: DocumentType; dateFrom?: string; dateTo?: string }) => void;

  // תבניות
  fetchDocumentTemplates: () => Promise<void>;
  fetchTemplateDetails: (templateId: ID) => Promise<void>;
  // handleFieldChange: (field: keyof DocumentTemplate, value: any) => void;
  // validateTemplateForm: (data: DocumentTemplate) => ValidationResult;
  // handleCreateTemplate: (data: DocumentTemplate) => Promise<DocumentTemplate>;
  // handleUpdateTemplate: (templateId: ID, data: DocumentTemplate) => Promise<DocumentTemplate>;
  handleDeleteTemplate: (templateId: ID) => Promise<void>;
};

export const useReceiptAndDocumentsStore = create<ReceiptAndDocumentsState>((set) => ({
  documents: [],
  templates: [],
  selectedDocument: undefined,
  selectedTemplate: undefined,
  loading: false,

  fetchGeneratedDocuments: async () => {},
  // generateDocument: async () => { return {} as GeneratedDocument; },
  downloadDocument: async () => {},
  sendDocumentByEmail: async () => {},
  fetchDocumentForPreview: async () => {},
  handleDeleteDocument: async () => {},
  //handleSearch: () => {},
  //handleFilter: () => {},

  fetchDocumentTemplates: async () => {},
  fetchTemplateDetails: async () => {},
  handleFieldChange: () => {},
  validateTemplateForm: () => ({ isValid: true, errors: [] }),
  // handleCreateTemplate: async () => { return {} as DocumentTemplate; },
  // handleUpdateTemplate: async () => { return {} as DocumentTemplate; },
  handleDeleteTemplate: async () => {},
}));