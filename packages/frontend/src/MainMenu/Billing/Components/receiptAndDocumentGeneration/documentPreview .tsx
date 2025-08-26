import { useReceiptAndDocumentsStore } from "../../../../Stores/Billing/receiptAndDocumentsStore";
export const DocumentPreview = () => {
  const {fetchDocumentForPreview}=useReceiptAndDocumentsStore();
 //functions
 //in the store


  return (
    <div>
      <h1>Document Preview</h1>
      <p>This section will display the preview of the generated document.</p>
      {/* Additional UI components for document preview can be added here */}
    </div>
  );
}