import { useState } from 'react';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { showAlert } from '../../../../Common/Components/BaseComponents/ShowAlert';
import { EmailTemplate } from 'shared-types';
import { useEmailTemplateStore } from '../../../../Stores/CoreAndIntegration/emailTemplateStore';

interface PreviewEmailTemplateProps {
  emailTemplate: EmailTemplate;
  onClose: () => void;
  onRenderHtml: (html: any) => void;
}

export const PreviewEmailTemplate = ({ emailTemplate, onClose, onRenderHtml }: PreviewEmailTemplateProps) => {
  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const initialVars: Record<string, string> = {};
    emailTemplate.variables.forEach(variableName => {
      const cleanKey = variableName.replace(/^"+|"+$/g, '').trim();
      initialVars[cleanKey] = '';
    });
    return initialVars;
  });

  const { previewEmailTemplate } = useEmailTemplateStore();

  const handleVariableChange = (key: string, value: string) => {
    const cleanKey = key.replace(/^"+|"+$/g, '').trim();
    setVariables(prev => ({ ...prev, [cleanKey]: value }));
  };

  const handlePreview = async () => {
    if (!emailTemplate.id) {
      showAlert("שגיאה", 'נדרש מזהה תבנית דוא"ל.', "error");
      return;
    }
    try {
      const html = await previewEmailTemplate(emailTemplate.id, variables);
      onRenderHtml(html); // מעבירה ל־ EmailTemplateTable
    } catch (error) {
      console.error("Error previewing email template:", error);
      showAlert("שגיאה", "תצוגת תבנית נכשלה.", "error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4"> תבנית דוא"ל: {emailTemplate.name}</h2>
      {emailTemplate.variables.map(variable => {
        const cleanKey = variable.replace(/^"+|"+$/g, '').trim();
        return (
          <div key={cleanKey} className="flex flex-col">
            <label className="font-semibold text-lg">{cleanKey}</label>
            <input
              type="text"
              value={variables[cleanKey] ?? ''}
              onChange={(e) => handleVariableChange(cleanKey, e.target.value)}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>
        );
      })}

      <div className="flex justify-between mt-4">
        <Button onClick={handlePreview} className="flex-1 flex justify-center">הצג</Button>
        <Button onClick={onClose} className="flex-1 flex justify-center mr-2">סגור</Button>
      </div>
    </div>
  );
};
