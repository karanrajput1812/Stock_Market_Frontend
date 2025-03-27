import React from "react";
import '../Components.css'
import { Link } from "react-router-dom";

function AdminNavigation() {
  return (
    <aside className="aside">
      <h3>Admin Section</h3>
      <ul>
        <li>
          <Link to="/admin/view-shares">View Shares</Link>
        </li>
        <li>
          <Link to="/admin/add-shares">Add Shares</Link>
        </li>
        <li>
          <Link to="/admin/update-shares">Update Shares</Link>
        </li>
        <li>
          <Link to="/admin/delete-shares">Delete Shares</Link>
        </li>
        <li>
          <Link to="/">Logout</Link>
        </li>
      </ul>
    </aside>
  );
}

export default AdminNavigation;
