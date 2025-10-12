import React, { useState, useEffect } from "react";
import {
	getAllUsers,
	addUser,
	updateUser,
	deleteUser,
	generateUserToken,
} from "../../../services/firestoreService";

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

	// Fetch all users on component mount
	useEffect(() => {
		fetchUsers();
	}, []);

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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			if (editingUser) {
				// Update existing user
				await updateUser(editingUser.id, formData);
				alert("User updated successfully!");
			} else {
				// Add new user
				const result = await addUser(formData);
				alert(`User added successfully!\nToken: ${result.token}`);
			}

			// Reset form and refresh users
			setFormData({
				name: "",
				email: "",
				role: "user",
				phone: "",
				address: "",
			});
			setShowModal(false);
			setEditingUser(null);
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
		setEditingUser(null);
		setFormData({
			name: "",
			email: "",
			role: "user",
			phone: "",
			address: "",
		});
		setShowModal(true);
	};

	const closeModal = () => {
		setShowModal(false);
		setEditingUser(null);
	};

	return (
		<main
			style={{
				padding: "20px",
				width: "100%",
				backgroundColor: "#f5f5f5",
				minHeight: "100vh",
			}}>
			<div style={{ maxWidth: "1200px", margin: "0 auto" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						marginBottom: "20px",
					}}>
					<h1>Admin Dashboard</h1>
					<button
						onClick={handleAddNew}
						style={{
							padding: "10px 20px",
							backgroundColor: "#4CAF50",
							color: "white",
							border: "none",
							borderRadius: "5px",
							cursor: "pointer",
						}}>
						Add New User
					</button>
				</div>

				{loading ? (
					<p>Loading users...</p>
				) : (
					<div style={{ overflowX: "auto" }}>
						<table
							style={{
								width: "100%",
								borderCollapse: "collapse",
								backgroundColor: "white",
								boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
							}}>
							<thead>
								<tr style={{ backgroundColor: "#f5f5f5" }}>
									<th style={tableHeaderStyle}>Name</th>
									<th style={tableHeaderStyle}>Email</th>
									<th style={tableHeaderStyle}>Role</th>
									<th style={tableHeaderStyle}>Token</th>
									<th style={tableHeaderStyle}>Status</th>
									<th style={tableHeaderStyle}>Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.length === 0 ? (
									<tr>
										<td
											colSpan="6"
											style={{ textAlign: "center", padding: "20px" }}>
											No users found
										</td>
									</tr>
								) : (
									users.map((user) => (
										<tr
											key={user.id}
											style={{ borderBottom: "1px solid #eee" }}>
											<td style={tableCellStyle}>{user.name}</td>
											<td style={tableCellStyle}>{user.email}</td>
											<td style={tableCellStyle}>{user.role}</td>
											<td style={tableCellStyle}>
												<code
													style={{
														backgroundColor: "#f5f5f5",
														padding: "2px 6px",
														borderRadius: "3px",
														fontSize: "12px",
													}}>
													{user.token}
												</code>
											</td>
											<td style={tableCellStyle}>
												<span
													style={{
														padding: "4px 8px",
														borderRadius: "12px",
														backgroundColor:
															user.status === "active" ? "#4CAF50" : "#f44336",
														color: "white",
														fontSize: "12px",
													}}>
													{user.status}
												</span>
											</td>
											<td style={tableCellStyle}>
												<button
													onClick={() => handleEdit(user)}
													style={editButtonStyle}>
													Edit
												</button>
												<button
													onClick={() => handleDelete(user.id)}
													style={deleteButtonStyle}>
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
			</div>

			{/* Modal */}
			{showModal && (
				<div style={modalOverlayStyle}>
					<div style={modalContentStyle}>
						<h2>{editingUser ? "Edit User" : "Add New User"}</h2>
						<form onSubmit={handleSubmit}>
							<div style={formGroupStyle}>
								<label style={labelStyle}>Name:</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
									style={inputStyle}
								/>
							</div>

							<div style={formGroupStyle}>
								<label style={labelStyle}>Email:</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleInputChange}
									required
									style={inputStyle}
								/>
							</div>

							<div style={formGroupStyle}>
								<label style={labelStyle}>Role:</label>
								<select
									name="role"
									value={formData.role}
									onChange={handleInputChange}
									style={inputStyle}>
									<option value="user">User</option>
									<option value="admin">Admin</option>
									<option value="moderator">Moderator</option>
								</select>
							</div>

							<div style={formGroupStyle}>
								<label style={labelStyle}>Phone:</label>
								<input
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleInputChange}
									style={inputStyle}
								/>
							</div>

							<div style={formGroupStyle}>
								<label style={labelStyle}>Address:</label>
								<textarea
									name="address"
									value={formData.address}
									onChange={handleInputChange}
									style={{ ...inputStyle, minHeight: "80px" }}
								/>
							</div>

							<div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
								<button type="submit" style={submitButtonStyle}>
									{editingUser ? "Update" : "Create"}
								</button>
								<button
									type="button"
									onClick={closeModal}
									style={cancelButtonStyle}>
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

// Styles
const tableHeaderStyle = {
	padding: "12px",
	textAlign: "left",
	borderBottom: "2px solid #ddd",
	fontWeight: "600",
};

const tableCellStyle = {
	padding: "12px",
};

const editButtonStyle = {
	padding: "6px 12px",
	marginRight: "8px",
	backgroundColor: "#2196F3",
	color: "white",
	border: "none",
	borderRadius: "4px",
	cursor: "pointer",
};

const deleteButtonStyle = {
	padding: "6px 12px",
	backgroundColor: "#f44336",
	color: "white",
	border: "none",
	borderRadius: "4px",
	cursor: "pointer",
};

const modalOverlayStyle = {
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	backgroundColor: "rgba(0, 0, 0, 0.5)",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	zIndex: 1000,
};

const modalContentStyle = {
	backgroundColor: "white",
	padding: "30px",
	borderRadius: "8px",
	width: "90%",
	maxWidth: "500px",
	maxHeight: "90vh",
	overflowY: "auto",
};

const formGroupStyle = {
	marginBottom: "15px",
};

const labelStyle = {
	display: "block",
	marginBottom: "5px",
	fontWeight: "500",
};

const inputStyle = {
	width: "100%",
	padding: "8px 12px",
	border: "1px solid #ddd",
	borderRadius: "4px",
	fontSize: "14px",
};

const submitButtonStyle = {
	flex: 1,
	padding: "10px 20px",
	backgroundColor: "#4CAF50",
	color: "white",
	border: "none",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "16px",
};

const cancelButtonStyle = {
	flex: 1,
	padding: "10px 20px",
	backgroundColor: "#757575",
	color: "white",
	border: "none",
	borderRadius: "4px",
	cursor: "pointer",
	fontSize: "16px",
}