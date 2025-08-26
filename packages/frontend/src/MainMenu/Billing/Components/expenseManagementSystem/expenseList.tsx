import {Button} from "../../../../Common/Components/BaseComponents/Button";
import {
    Table,
    TableColumn,
} from "../../../../Common/Components/BaseComponents/Table";
import {Expense} from "shared-types";
import {useCallback, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ExpenseDetails} from "./expenseDetails";
import axiosInstance from "../../../../Service/Axios"; // עדכן לפי נתיב הפרויקט

interface ValuesToTable {
    id: string;
    vendor_name: string;
    category: string;
    amount: number;
    status: string;
    date: string;
}

export const ExpenseList = () => {
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [allExpenses, setAllExpenses] = useState<Expense[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

    const fetchExpenses = useCallback(async () => {
        try {
            const response = await axiosInstance.get("/expenses/by-page", {
                params: {
                    page,
                    limit: 20, // או כל מספר שמתאים לך
                    categories: selectedCategory || undefined, // אם יש קטגוריה נבחרת, נשלח אותה
                },
            });

            const newExpenses: Expense[] = response.data;

            if (newExpenses.length === 0) {
                setHasMore(false); // אין יותר עמודים לטעון
                return;
            }

            setAllExpenses((prev) => [...prev, ...newExpenses]);
            setExpenses((prev) => [...prev, ...newExpenses]);
        } catch (error) {
            console.error("שגיאה בעת שליפת ההוצאות:", error);
        }
    }, [page, selectedCategory]);

    useEffect(() => {
        const fetchVendorsAndCategories = async () => {
            try {
                const categoryRes = await fetch(`${process.env.REACT_APP_API_URL ?? 'http://localhost:3001'}/expenses/categories`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!categoryRes.ok) throw new Error('Failed to fetch categories');
                const categoryJson = await categoryRes.json();
                console.log('קטגוריות נשלפו:', categoryJson);
                const formattedCategories = categoryJson.map((cat: any) => ({
                    value: cat.id,
                    label: cat.name,
                }));
                setCategories(formattedCategories);
            } catch (error) {
                console.error('שגיאה בשליפת מידע:', error);
                alert('שגיאה בטעינת נתונים: ' + error);
            }
        };
        fetchVendorsAndCategories();
    }, []);
    useEffect(() => {
        if (!selectedCategory) {
            fetchExpenses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!loaderRef.current || !hasMore || isSearching) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });
        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [hasMore, isSearching]);

    const handleSearch = async (term: string) => {
        setSearchTerm(term);

        if (!term.trim()) {
            setIsSearching(false);
            setExpenses(allExpenses);
            setPage(1);
            setHasMore(true);
            return;
        }

        setIsSearching(true);

        const filtered = allExpenses.filter(
            (expense) =>
                expense.vendor_name?.toLowerCase().includes(term.toLowerCase()) ||
                expense.description?.toLowerCase().includes(term.toLowerCase()) ||
                String(expense.category)?.toLowerCase().includes(term.toLowerCase())
        );

        if (filtered.length > 0) {
            setExpenses(filtered);
        } else {
            try {
                const response = await axiosInstance.get("/expenses/filter", {
                    params: {q: term, page: 1, limit: 50, excludePettyCash: true},
                });
                setExpenses(response.data);
            } catch (error) {
                console.error("Error searching from server:", error);
            }
        }
    };
    useEffect(() => {
        const loadByCategory = async () => {
            setExpenses([]);
            setAllExpenses([]);
            setPage(1);
            setHasMore(false);

            if (!selectedCategory) {
                setHasMore(true);
                fetchExpenses(); // טען את כל ההוצאות
                return;
            }

            try {
                const response = await axiosInstance.get("/expenses/filter", {
                    params: {categoryId: selectedCategory},
                });

                const filteredExpenses: Expense[] = response.data;
                setExpenses(filteredExpenses);
                setAllExpenses(filteredExpenses);
            } catch (error) {
                console.error("שגיאה בסינון לפי קטגוריה:", error);
            }
        };

        loadByCategory();
    }, [selectedCategory, fetchExpenses]);


    const deleteCurrentExpense = async (id: string) => {
        try {
            await axiosInstance.delete(`/expenses/${id}`);
            setExpenses([]);
            setAllExpenses([]);
            setPage(1);
            setHasMore(true);
            fetchExpenses();
            alert("הוצאה נמחקה בהצלחה");
        } catch (error) {
            console.error("שגיאה במחיקת הוצאה:", error);
            alert("מחיקה נכשלה");
        }
    };

    const valuesToTable: ValuesToTable[] = expenses.map((expense) => ({
        id: expense.id!,
        vendor_name: expense.vendor_name,
        category: expense.category ? String(expense.category) : "",
        amount: expense.amount,
        status: expense.status,
        date: new Date(expense.date).toLocaleDateString("he-IL"),
    }));

    const Columns: TableColumn<ValuesToTable>[] = [
        {header: "ספק", accessor: "vendor_name"},
        {header: "קטגוריה", accessor: "category"},
        {header: "סכום", accessor: "amount"},
        {header: "סטטוס", accessor: "status"},
        {header: "תאריך", accessor: "date"},
        {
            header: "פרטים",
            accessor: "id",
            render: (value, row) => (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedId(row.id)}
                >

                    פרטים
                </Button>
            ),
        },
    ];

    return (
        <div style={{direction: "rtl", padding: "20px"}}>
            <h2 className="text-3xl font-bold text-center text-blue-600 my-4">הוצאות</h2>
            <Button variant="primary" size="sm" onClick={() => navigate("expense-form")}>
                הוספת הוצאה חדשה
            </Button>
            <br/>
            <br/>
            <input
                type="text"
                placeholder="חפש לפי ספק, תיאור או קטגוריה"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                style={{padding: "8px", width: "250px", marginBottom: "16px"}}
            />
            <div style={{marginBottom: "16px"}}>
                <label htmlFor="category-select">סינון לפי קטגוריה:</label>{" "}
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">-- כל הקטגוריות --</option>
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>

            </div>

            <Table<ValuesToTable>
                data={valuesToTable}
                columns={Columns}
                onDelete={(val) => deleteCurrentExpense(val.id)}
                onUpdate={(val) => {
                    navigate(`/expenses/expense-form/${val.id}`);
                }}
                renderActions={() => null}
            />
            {selectedId && (
                <ExpenseDetails id={selectedId} onClose={() => setSelectedId(null)}/>
            )}
            <div ref={loaderRef} style={{height: "1px"}}/>
        </div>
    );
};