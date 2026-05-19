import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import "../styles/admin.css";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_reservas: 0,
    total_clientes: 0,
    total_servicios: 0
  });

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(setStats)
      .catch(err => console.error("Error stats:", err));
  }, []);

  const statsCards = [
    { title: "Total Reservas", value: stats.total_reservas },
    { title: "Clientes", value: stats.total_clientes },
    { title: "Servicios", value: stats.total_servicios },
  ];

  const chartData = [
    { name: "Lun", reservas: 5 },
    { name: "Mar", reservas: 8 },
    { name: "Mié", reservas: 6 },
    { name: "Jue", reservas: 10 },
    { name: "Vie", reservas: 12 },
  ];

  return (
    <div className="admin-container">
      <h1>Panel de Administración</h1>

      {/* STATS */}
      <div className="stats">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <h3>{stat.title}</h3>
            <p>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* GRÁFICOS */}
      <div className="charts">

        <div className="chart-box">
          <h3>Reservas por día</h3>
          <LineChart width={300} height={200} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="reservas" stroke="#3b82f6" />
          </LineChart>
        </div>

        <div className="chart-box">
          <h3>Comparativa</h3>
          <BarChart width={300} height={200} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="reservas" fill="#7c3aed" />
          </BarChart>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;