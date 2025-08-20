import React, { useMemo, useState } from "react";
import "./App.css";
// import DataTable, { Column } from "./components/DataTable";
import DataTable  from './components/DataTable';
import type { Column } from './components/DataTable';

type Person = {
  name: string;
  age: number;
  email: string;
};

const sampleData: Person[] = [
  { name: "Alice", age: 29, email: "alice@example.com" },
  { name: "Bob", age: 34, email: "bob@example.com" },
  { name: "Carol", age: 22, email: "carol@example.com" },
];

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Person[]>(sampleData);
  const [selected, setSelected] = useState<Person[]>([]);

  const columns = useMemo<Column<Person>[]>(
    () => [
      { key: "name", title: "Name", dataIndex: "name", sortable: true },
      { key: "age", title: "Age", dataIndex: "age", sortable: true },
      { key: "email", title: "Email", dataIndex: "email", sortable: true },
    ],
    []
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !value.includes("@")) {
      setError("Email must contain '@'");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleClear = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = () => {
    alert("Login Successful...!");
  };

  const isDisabled =
    email.trim() === "" || password.trim() === "" || error !== "";

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <div className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌙" : "☀️"}
      </div>

      <div className="login-box">
        <h1 className="title">Login Page</h1>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={handleEmailChange}
          />
          <p className="helper-text">{error ? error : "Enter a valid email"}</p>
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="button-group">
          <button onClick={handleSubmit} disabled={isDisabled}>
            Submit
          </button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>

      <div style={{ marginTop: "40px", padding: "20px", background: "#fff", borderRadius: "8px" }}>
        <h2>People Table</h2>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button onClick={() => setLoading(true)}>Show Loading</button>
          <button onClick={() => setLoading(false)}>Stop Loading</button>
          <button onClick={() => setRows([])}>Show Empty</button>
          <button onClick={() => setRows(sampleData)}>Reset Data</button>
        </div>

        <DataTable<Person>
          data={rows}
          columns={columns}
          loading={loading}
          selectable
          onRowSelect={(sel) => setSelected(sel)}
        />

        <div aria-live="polite" style={{ marginTop: "10px" }}>
          Selected rows: <strong>{selected.length}</strong>
        </div>
      </div>
    </div>
  );
}

export default App;
