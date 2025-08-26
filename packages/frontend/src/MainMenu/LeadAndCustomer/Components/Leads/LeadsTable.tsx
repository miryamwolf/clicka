import { useNavigate } from "react-router-dom";
import { Table, TableColumn } from "../../../../Common/Components/BaseComponents/Table";
import { Button } from "../../../../Common/Components/BaseComponents/Button";
import { Lead, LeadStatus } from "shared-types";

interface LeadsTableProps {
  leads: Lead[];
  onDelete: (id: string) => void;
}

interface RowData {
  id: string;
  name: string;
  status: LeadStatus;
  phone: string;
  email: string;
}

export const LeadsTable = ({ leads, onDelete }: LeadsTableProps) => {
  const navigate = useNavigate();
  const handleRegistration = (lead: Lead | undefined) => {
    if (lead) {
      navigate("interestedCustomerRegistration", {
        state: { data: lead },
      });
    }
  };

  const valuesToTable: RowData[] = leads.map((lead) => ({
    id: lead.id!,
    name: lead.name,
    status: lead.status,
    phone: lead.phone,
    email: lead.email || "",
  }));

  const columns: TableColumn<RowData>[] = [
    { header: "שם", accessor: "name" },
    { header: "סטטוס", accessor: "status" },
    { header: "פלאפון", accessor: "phone" },
    { header: "מייל", accessor: "email" },
  ];

  return (
    <Table<RowData>
      data={valuesToTable}
      columns={columns}
      onDelete={(row) => onDelete(row.id)}
      renderActions={(row) => (
        <Button
          onClick={() => handleRegistration(leads.find((l) => l.id === row.id))}
          variant="primary"
          size="sm"
        >
          לטופס רישום
        </Button>
      )}
    />
  );
};
