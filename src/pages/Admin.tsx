import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Signature } from "@/pages/Index";
import DatabaseStatus from '@/components/DatabaseStatus';

const Admin = () => {
  const navigate = useNavigate();
  const [signatures, setSignatures] = useState<Signature[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/signatures`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch signatures");
        }
        return response.json();
      })
      .then((data) => {
        setSignatures(data);
      })
      .catch((error) => {
        console.error("Error fetching signatures:", error);
        // Handle error appropriately, e.g., display an error message
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 md:p-8">
      <div className="max-w-screen-xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
            <p className="text-gray-600">Gerencie todas as assinaturas criadas no sistema</p>
          </div>
          <div className="flex gap-2 items-center">
            <DatabaseStatus />
            <Button variant="outline" onClick={handleLogout} className="ml-2">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <AdminDashboard signatures={signatures} />
      </div>
    </div>
  );
};

export default Admin;
