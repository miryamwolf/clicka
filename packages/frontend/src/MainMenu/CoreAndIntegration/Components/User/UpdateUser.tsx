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
import { showAlert } from "../../../../Common/Components/BaseComponents/ShowAlert";

const schema = z.object({
    firstName: z.string().nonempty("שם פרטי הוא שדה חובה"),
    lastName: z.string().nonempty("שם משפחה הוא שדה חובה"),
    role: z.string().nonempty("תפקיד הוא שדה חובה"),
    active: z.boolean().optional(),
    acceptTerms: z.boolean().refine(val => val === true, {
        message: "יש לאשר את השינויים",
    }),
});

interface UpdateUserProps {
    user: User;
    onClose?: () => void;
    onUserUpdated?: () => void;
}

export const UpdateUser = ({ user, onClose, onUserUpdated }: UpdateUserProps) => {
    const { updateUser, loading } = useUserStore();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const methods = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            active: user.active,
            acceptTerms: true, 
        }
    });

    const handleSubmit = async (data: z.infer<typeof schema>) => {
        setIsSubmitting(true);

        try {
            const updatedUser: User = {
                ...user,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role as UserRole,
                active: data.active ?? user.active,
                updatedAt: new Date().toISOString(),
            };

            const result = await updateUser(user.id as string, updatedUser);

            if (result) {
                showAlert("", "המשתמש עודכן בהצלחה", "success");
                onUserUpdated?.();
                onClose?.();
            } else {
                showAlert("שגיאה", "עדכון המשתמש נכשל", "error");
            }
        } catch (error) {
            console.error("Error details:", {
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : undefined,
                fullError: error
            });
            showAlert("שגיאה", "עדכון המשתמש נכשלה. נסה שוב", "error");
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
                <h2 className="text-2xl font-bold">עדכון משתמש</h2>
                {onClose && (
                    <Button variant="secondary" onClick={onClose}>
                        ביטול
                    </Button>
                )}
            </div>

            <Form
                label="עדכון פרטי משתמש"
                schema={schema}
                onSubmit={handleSubmit}
                methods={methods}
                className="space-y-4"
                dir="rtl"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        name="firstName"
                        label="שם פרטי"
                        required
                    />
                    <InputField
                        name="lastName"
                        label="שם משפחה"
                        required
                    />
                </div>

                <SelectField
                    name="role"
                    label="Role"
                    options={roleOptions}
                    required
                />

                <CheckboxField
                    name="active"
                    label="משתמש פעיל"
                />

                <CheckboxField
                    name="acceptTerms"
                    label="אשר שינויים"
                    required
                />

                <div className="flex gap-4 pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting || loading}
                        className="flex-1"
                    >
                        {isSubmitting ? "מעדכן..." : "עדכן משתמש"}
                    </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-2">פרטי משתמש נוכחיים:</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>נוצר:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                        <p><strong>עודכן לאחרונה:</strong> {new Date(user.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {isSubmitting && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                        <p className="text-blue-800">מעדכן משתמש, אנא המתן...</p>
                    </div>
                )}
            </Form>
        </div>
    );
};