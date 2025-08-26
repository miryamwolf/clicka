import { z } from "zod";
import { Form } from '../../../../Common/Components/BaseComponents/Form';
import { InputField } from '../../../../Common/Components/BaseComponents/Input';
import { CheckboxField } from '../../../../Common/Components/BaseComponents/CheckBox';
import { SelectField } from '../../../../Common/Components/BaseComponents/Select';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { User, UserRole } from 'shared-types';
import { useUserStore } from '../../../../Stores/CoreAndIntegration/userStore';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showAlert } from '../../../../Common/Components/BaseComponents/ShowAlert';

const schema = z.object({
  email: z.string().email("אימייל לא תקין").nonempty("אימייל הוא שדה חובה"),
  firstName: z.string().nonempty("שם פרטי הוא שדה חובה"),
  lastName: z.string().nonempty("שם משפחה הוא שדה חובה"),
  role: z.string().nonempty("תפקיד הוא שדה חובה"),
  active: z.boolean().optional(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "יש לאשר את התנאים",
  }),
});

interface AddUserProps {
  onClose?: () => void;
  onUserAdded?: () => void;
}

export const AddUser = ({ onClose, onUserAdded }: AddUserProps) => {
  const { createUser, loading } = useUserStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      active: true,
    }
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    setIsSubmitting(true);

    try {
      const newUser: User = {
        id: "",
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role as UserRole,
        googleId: "",
        lastLogin: "",
        active: data.active ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const createdUser = await createUser(newUser);

      if (createdUser) {
        showAlert("", "המשתמש נוסף בהצלחה", "success");
        onUserAdded?.();
        onClose?.();
      } else {
        showAlert("שגיאה", "הוספת המשתמש נכשלה", "error");
      }
    } catch (error) {
        showAlert("שגיאה", "הוספת המשתמש נכשלה. נסה שוב", "error");
        // לא סוגרים את המודאל כדי שהמשתמש יוכל לנסות שוב
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    { value: UserRole.ADMIN, label: "Admin" },
    { value: UserRole.MANAGER, label: "Manager" },
    { value: UserRole.SYSTEM_ADMIN, label: "System Admin" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">הוספת משתמש חדש</h2>
        {onClose && (
          <Button variant="secondary" onClick={onClose}>
            ביטול
          </Button>
        )}
      </div>

      <Form
        label="פרטי משתמש"
        schema={schema}
        onSubmit={handleSubmit}
        methods={methods}
        className="space-y-4"
        dir="rtl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField name="firstName" label="שם פרטי" required />
          <InputField name="lastName" label="שם משפחה" required />
        </div>

        <InputField name="email" label="אימייל" required type="email" />

        <SelectField name="role" label="Role" options={roleOptions} required />

        <CheckboxField name="active" label="משתמש פעיל" />

        <CheckboxField name="acceptTerms" label="אשר את התנאים וההגבלות" required />

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || loading}
            className="flex-1"
          >
            {isSubmitting ? "יוצר..." : "צור משתמש"}
          </Button>
        </div>
      </Form>
    </div>
  );
};