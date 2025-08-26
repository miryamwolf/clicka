import { Table, TableColumn } from '../../../../Common/Components/BaseComponents/Table';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { showAlert } from '../../../../Common/Components/BaseComponents/ShowAlert';
import { EmailTemplate } from 'shared-types';
import { useEffect, useState } from 'react';
import { UpdateEmailTemplate } from './UpdateEmailTemplate';
import { AddEmailTemplate } from './AddEmailTemplate';
import { useEmailTemplateStore } from '../../../../Stores/CoreAndIntegration/emailTemplateStore';
import { PreviewEmailTemplate } from './PreviewEmailTemplate';

export const EmailTemplateTable = () => {
  const {
    emailTemplates,
    loading,
    error,
    getEmailTemplates,
    deleteEmailTemplate,
  } = useEmailTemplateStore();

  const [showUpdateEmailTemplate, setShowUpdateEmailTemplate] = useState(false);
  const [showAddEmailTemplate, setShowAddEmailTemplate] = useState(false);
  const [selectedEmailTemplate, setSelectedEmailTemplate] = useState<EmailTemplate | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedTemplateForPreview, setSelectedTemplateForPreview] = useState<EmailTemplate | null>(null);
  const [renderedHtml, setRenderedHtml] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmailTemplates = async () => {
      await getEmailTemplates();
    };
    fetchEmailTemplates();
  }, [getEmailTemplates]);

  const sortedEmailTemplates = [...emailTemplates].sort((a, b) => a.name.localeCompare(b.name));

  const handleUpdate = (emailTemplate: EmailTemplate) => {
    setSelectedEmailTemplate(emailTemplate);
    setShowUpdateEmailTemplate(true);
  };

  const handleDelete = async (emailTemplate: EmailTemplate) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את ${emailTemplate.name}?`)) {
      try {
        await deleteEmailTemplate(emailTemplate.id as string);
        showAlert("", "תבנית המייל נמחקה בהצלחה", "success");
      } catch (error) {
        console.error("Error deleting email template:", error);
        showAlert("שגיאה", "מחיקת תבנית המייל נכשלה. נסה שוב", "error");
      }
    }
  };

  const handleAddEmailTemplate = () => {
    setShowAddEmailTemplate(true);
  };

  const handleCloseModals = () => {
    setShowUpdateEmailTemplate(false);
    setShowAddEmailTemplate(false);
    setSelectedEmailTemplate(null);
    setShowPreviewModal(false);
    setSelectedTemplateForPreview(null);
    setRenderedHtml(null); // אפס תצוגה מקדימה כשסוגרים
  };

  const handleEmailTemplateUpdated = () => {
    getEmailTemplates();
    handleCloseModals();
  };

  const handlePreview = (emailTemplate: EmailTemplate) => {
    setSelectedTemplateForPreview(emailTemplate);
    setShowPreviewModal(true);
  };

  const emailTemplateColumns: TableColumn<EmailTemplate>[] = [
    { header: "שם", accessor: "name" },
    { header: "נושא", accessor: "subject" },
    { header: "גוף הטקסט", accessor: "bodyText" },
    { header: "שפה", accessor: "language", render: value => value === 'he' ? 'עברית' : 'English' },
    {
      header: "משתנים",
      accessor: "variables",
      render: (variables: string[]) => variables.join(', ') // המרה למחרוזת עם פסיקים ורווחים
    }
  ];

  // הצגת HTML בלבד אם קיים
  if (renderedHtml !== null) {
    return (
      <div dir="rtl" style={{ padding: '2rem', background: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Button onClick={() => setRenderedHtml(null)}>חזור</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="p-6">טוען תבניות דוא"ל...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">שגיאה: {error}</div>;
  }

  if (showAddEmailTemplate) {
    return (
      <AddEmailTemplate
        onClose={handleCloseModals}
        onEmailTemplateAdded={handleEmailTemplateUpdated}
      />
    );
  }

  if (showUpdateEmailTemplate && selectedEmailTemplate) {
    return (
      <UpdateEmailTemplate
        emailTemplate={selectedEmailTemplate}
        onClose={handleCloseModals}
        onEmailTemplateUpdated={handleEmailTemplateUpdated}
      />
    );
  }

  if (showPreviewModal && selectedTemplateForPreview) {
    return (
      <PreviewEmailTemplate
        emailTemplate={selectedTemplateForPreview}
        onClose={handleCloseModals}
        onRenderHtml={setRenderedHtml} // העברת פונקציה להצגת HTML
      />
    );
  }

  return (
    <div className="p-6">
      {/* כפתור */}
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddEmailTemplate}>+ הוסף תבנית דוא"ל</Button>
      </div>
      
      {/* כותרת */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">ניהול תבניות דוא"ל</h2>
      </div>

      <Table<EmailTemplate>
        data={sortedEmailTemplates}
        columns={emailTemplateColumns}
        dir="rtl"
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        renderActions={(emailTemplate: EmailTemplate) => (
          <Button onClick={() => handlePreview(emailTemplate)}>תצוגה מקדימה</Button>
        )}
      />
    </div >
  );
};
