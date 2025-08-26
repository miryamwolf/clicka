import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTemplateStore } from '../../../Stores/DocumentManagement/DocumentTemplateStore';
import { DocumentType } from 'shared-types';

interface FormData {
  name: string;
  type: DocumentType;
  language: 'hebrew' | 'english';
  template: string;
  variables: string[];
  isDefault: boolean;
  active: boolean;
}
const AddDocumentTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { createDocumentTemplate, error, clearError } = useDocumentTemplateStore();
  const currentDocumentTemplate = useDocumentTemplateStore(state => state.currentDocumentTemplate);
  const [formData, setFormData] = useState<FormData>(  currentDocumentTemplate
    ? {
        name: currentDocumentTemplate.name || '',
        type: currentDocumentTemplate.type || DocumentType.RECEIPT,
        language: currentDocumentTemplate.language || 'hebrew',
        template: currentDocumentTemplate.template || '',
        variables: currentDocumentTemplate.variables || [],
        isDefault: false, // תמיד לא ברירת מחדל בשכפול
        active: true
      }
    : {
        name: '',
        type: DocumentType.RECEIPT,
        language: 'hebrew',
        template: '',
        variables: [],
        isDefault: false,
        active: true
      }
);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newVariable, setNewVariable] = useState('');
  const [showPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddVariable = () => {
    if (newVariable.trim() && !formData.variables.includes(newVariable.trim())) {
      setFormData(prev => ({
        ...prev,
        variables: [...prev.variables, newVariable.trim()]
      }));
      setNewVariable('');
    }
  };

  const handleRemoveVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'יש להזין שם תבנית';
    if (!formData.template.trim()) errors.template = 'תוכן התבנית נדרש';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validateForm()) return;
    try {
      await createDocumentTemplate(formData);      
      alert('התבנית נוצרה בהצלחה!');
      navigate('/document-templates');
    } catch {
      alert('שגיאה ביצירת התבנית');
    }
  };

  const renderPreview = () => {
    let previewContent = formData.template;
    formData.variables.forEach(variable => {
      const regex = new RegExp(`{{${variable}}}`, 'g');
      previewContent = previewContent.replace(regex, `[${variable}]`);
    });
    return previewContent;
  };
useEffect(() => {
  if (currentDocumentTemplate) {
    setFormData({
      name: currentDocumentTemplate.name || '',
      type: currentDocumentTemplate.type || DocumentType.RECEIPT,
      language: currentDocumentTemplate.language || 'hebrew',
      template: currentDocumentTemplate.template || '',
      variables: currentDocumentTemplate.variables || [],
      isDefault: false,
      active: true
    });
  }
}, [currentDocumentTemplate]);
  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-4">הוספת תבנית מסמך</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input name="name" placeholder="שם תבנית" value={formData.name} onChange={handleInputChange} className="w-full p-2 border" />
        {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}

        <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 border">
          <option value="RECEIPT">קבלה</option>
          <option value="INVOICE">חשבונית</option>
          <option value="TAX_INVOICE">חשבונית מס</option>
          <option value="CREDIT_NOTE">זיכוי</option>
          <option value="STATEMENT">דו"ח מצב</option>
        </select>

        <select name="language" value={formData.language} onChange={handleInputChange} className="w-full p-2 border">
          <option value="hebrew">עברית</option>
          <option value="english">אנגלית</option>
        </select>
       <a
  href="https://wordtohtml.net/"
  className="text-blue-500 hover:underline"
  target="_blank"
  rel="noopener noreferrer"
>
  ליצירת תוכן תבנית לחץ כאן עצב תוכן והעתק קוד
</a>
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                                <h4 className="font-semibold text-blue-800 mb-2">עצות לכתיבת תבניות:</h4>
                                <ul className="text-sm text-blue-700 space-y-1">
                                    <li>• השתמש ב-{`{{variable_name}}`} להוספת משתנים</li>
                                    <li>• לדוגמה: שלום {`{{customer_name}}`}, סכום לתשלום: {`{{amount}}`}</li>
                                    <li>• ודא שהמשתנים מופיעים ברשימת המשתנים</li>
                                </ul>
                            </div>
        <textarea name="template" value={formData.template} onChange={handleInputChange} className="w-full h-40 p-2 border" placeholder="תוכן התבנית" />
        {formErrors.template && <p className="text-red-500 text-sm">{formErrors.template}</p>}

        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800">רשימת המשתנים:</h4>
          <div className="flex"> 
            <input value={newVariable} onChange={(e) => setNewVariable(e.target.value)} className="flex-1 p-2 border" placeholder="משתנה חדש" />
            <button type="button" onClick={handleAddVariable} className="p-2 bg-green-500 text-white">הוסף</button>
          </div>
          {formData.variables.map((v, i) => (
            <div key={i} className="flex justify-between border p-2">
              <span>{`{{${v}}}`}</span>
              <button type="button" onClick={() => handleRemoveVariable(i)}>הסר</button>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <label>
            <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} /> ברירת מחדל
          </label>
          <label>
            <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} /> פעיל
          </label>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">שמור</button>
        {/* <button type="button" onClick={() => setShowPreview(!showPreview)} className="bg-gray-500 text-white px-4 py-2 ml-2 rounded">
          תצוגה מקדימה
        </button> */}
      </form>

      {showPreview && (
        <div className="mt-6 border p-4 bg-gray-50 rounded">
          <h2 className="text-lg font-bold mb-2">תצוגה מקדימה:</h2>
          <div className="whitespace-pre-wrap text-sm">{renderPreview()}</div>
        </div>
      )}
    </div>
  );
};

export default AddDocumentTemplate;
