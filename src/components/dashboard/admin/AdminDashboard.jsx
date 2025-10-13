import React, { useState, useEffect } from "react";
import {
	getAllUsers,
	addUser,
	updateUser,
	deleteUser,
	generateUserToken,
} from "../../../services/firestoreService";
import "./dashboard.css";

export default function AdminDashboard() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		role: "user",
		phone: "",
		address: "",
	});

	useEffect(() => {
		fetchUsers();
	}, []);

	// 🔹 Fetch all users
	const fetchUsers = async () => {
		try {
			setLoading(true);
			const userData = await getAllUsers();
			setUsers(userData);
		} catch (error) {
			console.error("Error fetching users:", error);
			alert("Failed to fetch users");
		} finally {
			setLoading(false);
		}
	};

	// 🔹 Handle form changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// 🔹 Add / Update user
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editingUser) {
				await updateUser(editingUser.id, formData);
				alert("User updated successfully!");
			} else {
				const result = await addUser(formData);
				alert(`User added successfully!\nToken: ${result.token}`);
			}

			resetForm();
			fetchUsers();
		} catch (error) {
			console.error("Error saving user:", error);
			alert("Failed to save user");
		}
	};

	const handleEdit = (user) => {
		setEditingUser(user);
		setFormData({
			name: user.name || "",
			email: user.email || "",
			role: user.role || "user",
			phone: user.phone || "",
			address: user.address || "",
		});
		setShowModal(true);
	};

	const handleDelete = async (userId) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				await deleteUser(userId);
				alert("User deleted successfully!");
				fetchUsers();
			} catch (error) {
				console.error("Error deleting user:", error);
				alert("Failed to delete user");
			}
		}
	};

	const handleAddNew = () => {
		resetForm();
		setShowModal(true);
	};

	const resetForm = () => {
		setEditingUser(null);
		setFormData({
			name: "",
			email: "",
			role: "user",
			phone: "",
			address: "",
		});
		setShowModal(false);
	};

	return (
		<main className="dashboard-container">
			<div className="dashboard-header">
				<h1>Admin Dashboard</h1>
				<button onClick={handleAddNew} className="btn btn-primary">
					Add New User
				</button>
			</div>

			{loading ? (
				<p className="loading">Loading users...</p>
			) : (
				<div className="dashboard-table-container">
					<table className="dashboard-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Email</th>
								<th>Role</th>
								<th>Token</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.length === 0 ? (
								<tr>
									<td colSpan="6" className="no-data">
										No users found
									</td>
								</tr>
							) : (
								users.map((user) => (
									<tr key={user.id}>
										<td>{user.name}</td>
										<td>{user.email}</td>
										<td>{user.role}</td>
										<td>
											<code className="token">{user.token}</code>
										</td>
										<td>
											<span
												className={`status-badge ${
													user.status === "active" ? "active" : "inactive"
												}`}>
												{user.status || "inactive"}
											</span>
										</td>
										<td>
											<button
												onClick={() => handleEdit(user)}
												className="btn btn-edit">
												Edit
											</button>
											<button
												onClick={() => handleDelete(user.id)}
												className="btn btn-delete">
												Delete
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			)}

			{/* Divider */}
			<div className="dashboard-divider" />

			{/* Modal */}
			{showModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<h2>{editingUser ? "Edit User" : "Add New User"}</h2>
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label>Name:</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div className="form-group">
								<label>Email:</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
							</div>

							<div className="form-group">
								<label>Role:</label>
								<select
									name="role"
									value={formData.role}
									onChange={handleInputChange}>
									<option value="user">User</option>
									<option value="admin">Admin</option>
									<option value="moderator">Moderator</option>
								</select>
							</div>

							<div className="form-group">
								<label>Phone:</label>
								<input
									type="tel"
									name="phone"
									value={formData.contactNumber}
									onChange={handleInputChange}
								/>
							</div>

							<div className="form-group">
								<label>Address:</label>
								<textarea
									name="address"
									value={formData.address}
									onChange={handleInputChange}
								/>
							</div>

							<div className="form-actions">
								<button type="submit" className="btn btn-primary">
									{editingUser ? "Update" : "Create"}
								</button>
								<button
									type="button"
									onClick={resetForm}
									className="btn btn-cancel">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</main>
	);
}