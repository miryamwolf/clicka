import { Table, TableColumn } from '../../../../Common/Components/BaseComponents/Table';
import { Button } from '../../../../Common/Components/BaseComponents/Button';
import { User } from 'shared-types';
import { useEffect, useState } from 'react';
import { UpdateUser } from './UpdateUser';
import { AddUser } from './AddUser';
import { useUserStore } from '../../../../Stores/CoreAndIntegration/userStore';
import { showAlert } from '../../../../Common/Components/BaseComponents/ShowAlert';

export const UserTable = () => {
  const {
    users,
    loading,
    error,
    getAllUsers,
    removeUser
  } = useUserStore();

  const [showUpdateUser, setShowUpdateUser] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  // טיפול בשגיאות - מציג אלרט ונשאר בטבלה
  useEffect(() => {
    if (error) {
      showAlert("שגיאה", error, "error");
    }
  }, [error]);

  const handleUpdate = (user: User) => {
    setSelectedUser(user);
    setShowUpdateUser(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm(`${user.firstName} ${user.lastName}האם אתה בטוח שברצונך למחוק את המשתמש?`)) {
      try {
        await removeUser(user.id as string);
        showAlert("", "המשתמש נמחק בהצלחה", "success");
      } catch (error) {
        console.error("Error deleting user:", error);
        showAlert("שגיאה", "מחיקת המשתמש נכשלה. נסה שוב", "error");
      }
    }
  };

  const handleAddUser = () => {
    setShowAddUser(true);
  };

  const handleCloseModals = () => {
    setShowUpdateUser(false);
    setShowAddUser(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    getAllUsers(); 
    handleCloseModals();
  };

  const userColumns: TableColumn<User>[] = [
    { header: "שם פרטי", accessor: "firstName" },
    { header: "שם משפחה", accessor: "lastName" },
    { header: "אמייל", accessor: "email" },
    { header: "תפקיד", accessor: "role" },
    {
      header: "פעילות",
      accessor: "active",
      render: (value: boolean) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${value
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  // הסרנו את ה-error return כדי שהטבלה תמיד תוצג

  // If you are displaying an add or update form
  if (showAddUser) {
    return (
      <AddUser
        onClose={handleCloseModals}
        onUserAdded={handleUserUpdated}
      />
    );
  }

  if (showUpdateUser && selectedUser) {
    return (
      <UpdateUser
        user={selectedUser}
        onClose={handleCloseModals}
        onUserUpdated={handleUserUpdated}
      />
    );
  }

  return (
    <div className="p-6">
      {/* כפתורים */}
      <div className="flex justify-end gap-3 mb-4">
        <Button
          variant="primary"
          onClick={handleAddUser}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-2 py-1 rounded-lg flex items-center gap-1 whitespace-nowrap transition-colors duration-200 shadow-md text-sm"
        >
          <span className="text-lg">+</span>
          הוסף משתמש חדש
        </Button> 
        <Button
          variant="primary"
          onClick={() => window.location.href = '/registerUser'}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-2 py-1 rounded-lg whitespace-nowrap transition-colors duration-200 shadow-md text-sm"
        >
          הרשם עם סיסמה
        </Button>
      </div>
      
      {/* כותרת */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">ניהול משתמשים</h2>
      </div>
      {/* קישור להרשמה עם סיסמה */}
     

      {/* סטטיסטיקות */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600">
          סה"כ משתמשים: <span className="font-semibold">{users.length}</span>
          {" | "}
          משתמשים פעילים: <span className="font-semibold">
            {users.filter(user => user.active).length}
          </span>
        </div>
      </div>

      {/* טבלת משתמשים */}
      <Table<User>
        data={users}
        columns={userColumns}
        dir="rtl"
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};