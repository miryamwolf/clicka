import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { useEmailStore } from '../../../../Stores/CoreAndIntegration/SendEmailStore';
import { useEmailTemplateStore } from '../../../../Stores/CoreAndIntegration/emailTemplateStore';
import { EmailTemplate } from 'shared-types';

const emailFormSchema = z.object({
  subject: z.string().optional(),
  body: z.string().optional(),
  isHtml: z.boolean().optional(),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;

type EmailMultiInputProps = {
  label: string;
  values: string[];
  onChange: (newValues: string[]) => void;
};

const EmailMultiInput = ({ label, values, onChange }: EmailMultiInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',' || e.key === ' ') && inputValue.trim()) {
      e.preventDefault();
      const newEmail = inputValue.trim();
      if (!values.includes(newEmail)) {
        onChange([...values, newEmail]);
      }
      setInputValue('');
    }
  };

  const removeEmail = (index: number) => {
    const updated = [...values];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="mb-4 col-span-full">
      <label className="block font-bold mb-1">{label}</label>
      <div className="flex flex-wrap items-center border p-2 rounded min-h-[44px]">
        {values.map((email, i) => (
          <span
            key={i}
            className="bg-gray-200 px-2 py-1 rounded mr-2 mb-2 flex items-center text-sm"
          >
            {email}
            <button
              type="button"
              onClick={() => removeEmail(i)}
              className="ml-1 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder="הוסף מייל..."
          className="flex-1 outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export const SendEmail = () => {
  const {
    attachments,
    loading,
    message,
    addAttachments,
    removeAttachment,
    clearAttachments,
    setLoading,
    setMessage,
  } = useEmailStore();

  const {
    emailTemplates,
    getEmailTemplates,
  } = useEmailTemplateStore();

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [search, setSearch] = useState('');

  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);

  const methods = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    mode: 'onSubmit',
  });

  const { register } = methods;

  useEffect(() => {
    getEmailTemplates();
  }, [getEmailTemplates]);

  const onSubmit: SubmitHandler<EmailFormValues> = async (data) => {
    if (!to.length) {
      setMessage('נא להזין לפחות נמען אחד');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();

      to.forEach((email) => formData.append('to', email));
      cc.forEach((email) => formData.append('cc', email));
      bcc.forEach((email) => formData.append('bcc', email));

      formData.append('subject', data.subject || '');
      formData.append('body', data.body || '');
      formData.append('isHtml', String(data.isHtml || false));

      attachments.forEach((file) => {
        formData.append('attachments', file);
      });

      await axios.post(`${process.env.REACT_APP_API_URL}/gmail/v1/users/me/messages/send`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('המייל נשלח בהצלחה!');
      clearAttachments();
      setTo([]);
      setCc([]);
      setBcc([]);
    } catch (err: any) {
      setMessage(`שגיאה בשליחה: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelected = (template: EmailTemplate) => {
    methods.setValue('subject', template.subject || '');
    methods.setValue('body', template.bodyText || '');
    methods.setValue('isHtml', true);
    setShowTemplateSelector(false);
  };

  const filteredTemplates = emailTemplates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Form<EmailFormValues>
        label="שליחת מייל"
        schema={emailFormSchema}
        onSubmit={onSubmit}
        methods={methods}
        dir="rtl"
      >
        <EmailMultiInput label="נמענים (To)" values={to} onChange={setTo} />
        <EmailMultiInput label="עותק (Cc)" values={cc} onChange={setCc} />
        <EmailMultiInput label="עותק מוסתר (Bcc)" values={bcc} onChange={setBcc} />

        <input
          type="text"
          placeholder="נושא"
          {...register('subject')}
          className="border p-2 rounded col-span-full mb-4"
        />
        <textarea
          placeholder="תוכן המייל"
          rows={6}
          {...register('body')}
          className="border p-2 rounded col-span-full mb-4"
        />

        <div className="col-span-full flex gap-4 mb-4">
          <div className="flex-1">
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={(e) => e.target.files && addAttachments(e.target.files)}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="w-full block bg-blue-600 text-white py-2 px-4 rounded cursor-pointer text-center"
            >
              בחר קובץ
            </label>
          </div>
          <button
            type="button"
            onClick={() => setShowTemplateSelector(true)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded cursor-pointer text-center"
          >
            בחר תבנית
          </button>
        </div>

        {attachments.length > 0 && (
          <div className="col-span-full mb-4">
            <strong>קבצים שנבחרו:</strong>
            <ul>
              {attachments.map((file, index) => (
                <li key={index}>
                  {file.name}{' '}
                  <Button type="button" onClick={() => removeAttachment(index)}>
                    הסר
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded col-span-full"
        >
          {loading ? 'שולח...' : 'שלח מייל'}
        </button>

        {message && <p className="col-span-full text-center mt-4">{message}</p>}
      </Form>

      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[600px] max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4">בחר תבנית</h3>
            <input
              type="text"
              placeholder="חפש תבנית לפי שם..."
              className="w-full border p-2 mb-4 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="space-y-2">
              {filteredTemplates.map((template) => (
                <li key={template.id} className="flex justify-between items-center border-b py-2">
                  <div>
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-sm text-gray-600">{template.subject}</div>
                  </div>
                  <Button onClick={() => handleTemplateSelected(template)}>בחר</Button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setShowTemplateSelector(false)}>סגור</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
