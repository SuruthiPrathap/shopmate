import React, { useState } from "react";
import MyOrders from "../components/MyOrders";
import { 
  User, 
  MapPin, 
  Package, 
  CreditCard, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  ArrowLeft,
  Phone,
  Mail,
  Home,
  Briefcase
} from "lucide-react";

function ProfilePage({ user, onUpdateUser, onBackToHome, initialTab = "info" }) {
  const [activeTab, setActiveTab] = useState(initialTab); // "info" | "address" | "orders" | "payments"
  
  // Local form state for Personal Info
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [firstName, setFirstName] = useState(user?.name ? user.name.split(" ")[0] : "Rahul");
  const [lastName, setLastName] = useState(user?.name ? user.name.split(" ").slice(1).join(" ") || "Sharma" : "Sharma");
  const [email, setEmail] = useState(user?.email || "rahul.sharma@example.com");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [gender, setGender] = useState(user?.gender || "Male");

  // Address state
  const [addresses, setAddresses] = useState(user?.addresses || [
    {
      id: 1,
      name: user?.name || "Rahul Sharma",
      phone: "9876543210",
      pincode: "560001",
      locality: "MG Road, Indiranagar",
      address: "Flat 302, Sunrise Apartments, 4th Cross",
      city: "Bengaluru",
      state: "Karnataka",
      landmark: "Near Metro Station",
      type: "Home",
      isDefault: true
    }
  ]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Address Form state
  const [addrName, setAddrName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrPincode, setAddrPincode] = useState("");
  const [addrLocality, setAddrLocality] = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrLandmark, setAddrLandmark] = useState("");
  const [addrType, setAddrType] = useState("Home");

  // Save Personal Info
  const handleSavePersonalInfo = (e) => {
    e.preventDefault();
    const updatedName = `${firstName} ${lastName}`.trim();
    const updatedUser = {
      ...user,
      name: updatedName,
      email: email,
      phone: phone,
      gender: gender,
      addresses: addresses
    };
    onUpdateUser(updatedUser);
    setIsEditingInfo(false);
    alert("Profile details updated successfully!");
  };

  // Open address form for adding or editing
  const handleOpenAddressForm = (addr = null) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddrName(addr.name);
      setAddrPhone(addr.phone);
      setAddrPincode(addr.pincode);
      setAddrLocality(addr.locality);
      setAddrStreet(addr.address);
      setAddrCity(addr.city);
      setAddrState(addr.state);
      setAddrLandmark(addr.landmark || "");
      setAddrType(addr.type || "Home");
    } else {
      setEditingAddressId(null);
      setAddrName(user?.name || "");
      setAddrPhone(phone.replace("+91 ", "") || "");
      setAddrPincode("");
      setAddrLocality("");
      setAddrStreet("");
      setAddrCity("");
      setAddrState("");
      setAddrLandmark("");
      setAddrType("Home");
    }
    setShowAddressForm(true);
  };

  // Save Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      // Edit existing address
      const updated = addresses.map((a) =>
        a.id === editingAddressId
          ? {
              ...a,
              name: addrName,
              phone: addrPhone,
              pincode: addrPincode,
              locality: addrLocality,
              address: addrStreet,
              city: addrCity,
              state: addrState,
              landmark: addrLandmark,
              type: addrType
            }
          : a
      );
      setAddresses(updated);
      onUpdateUser({ ...user, addresses: updated });
    } else {
      // Add new address
      const newAddr = {
        id: Date.now(),
        name: addrName,
        phone: addrPhone,
        pincode: addrPincode,
        locality: addrLocality,
        address: addrStreet,
        city: addrCity,
        state: addrState,
        landmark: addrLandmark,
        type: addrType,
        isDefault: addresses.length === 0
      };
      const updated = [...addresses, newAddr];
      setAddresses(updated);
      onUpdateUser({ ...user, addresses: updated });
    }
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  // Delete Address
  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    onUpdateUser({ ...user, addresses: updated });
  };

  const displayName = user?.name || `${firstName} ${lastName}`;

  return (
    <div className="profile-page-container">
      {/* Top Navigation */}
      <div className="profile-page-nav">
        <button className="back-btn-pill" onClick={onBackToHome}>
          <ArrowLeft size={16} />
          <span>Back to Shopping</span>
        </button>
        <span className="page-breadcrumb">Home &gt; My Account &gt; Profile Details</span>
      </div>

      <div className="profile-layout">
        {/* Left Sidebar */}
        <aside className="profile-sidebar">
          {/* User Welcome Card */}
          <div className="profile-user-card">
            <div className="profile-avatar-large">
              {displayName ? displayName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="user-card-text">
              <span className="greeting">Hello,</span>
              <h3 className="user-name">{displayName}</h3>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="profile-nav-menu">
            <div 
              className={`nav-menu-item ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
            >
              <User size={18} />
              <span>Personal Information</span>
            </div>

            <div 
              className={`nav-menu-item ${activeTab === "address" ? "active" : ""}`}
              onClick={() => setActiveTab("address")}
            >
              <MapPin size={18} />
              <span>Manage Addresses</span>
            </div>

            <div 
              className={`nav-menu-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <Package size={18} />
              <span>My Orders</span>
            </div>

            <div 
              className={`nav-menu-item ${activeTab === "payments" ? "active" : ""}`}
              onClick={() => setActiveTab("payments")}
            >
              <CreditCard size={18} />
              <span>Saved Cards & UPI</span>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="profile-content-area">
          {/* ================= TAB 1: PERSONAL INFO ================= */}
          {activeTab === "info" && (
            <div className="profile-section-card">
              <div className="section-title-row">
                <h2>Personal Information</h2>
                {!isEditingInfo ? (
                  <button className="edit-section-btn" onClick={() => setIsEditingInfo(true)}>
                    <Edit2 size={15} />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <button className="cancel-edit-btn" onClick={() => setIsEditingInfo(false)}>
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePersonalInfo} className="profile-info-form">
                {/* Names */}
                <div className="form-row dual">
                  <div className="form-field">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditingInfo}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditingInfo}
                      required
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="form-field">
                  <label>Your Gender</label>
                  <div className="gender-radio-group">
                    <label className={`radio-pill ${gender === "Male" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={gender === "Male"}
                        onChange={(e) => setGender(e.target.value)}
                        disabled={!isEditingInfo}
                      />
                      <span>Male</span>
                    </label>
                    <label className={`radio-pill ${gender === "Female" ? "selected" : ""}`}>
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={gender === "Female"}
                        onChange={(e) => setGender(e.target.value)}
                        disabled={!isEditingInfo}
                      />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                {/* Email Address */}
                <div className="form-section-block">
                  <div className="block-title">
                    <Mail size={16} color="#2874f0" />
                    <h3>Email Address</h3>
                  </div>
                  <div className="form-field">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditingInfo}
                      required
                    />
                  </div>
                </div>

                {/* Mobile Phone Number */}
                <div className="form-section-block">
                  <div className="block-title">
                    <Phone size={16} color="#2874f0" />
                    <h3>Mobile Phone Number</h3>
                  </div>
                  <div className="form-field">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditingInfo}
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>

                {isEditingInfo && (
                  <button type="submit" className="save-profile-btn">
                    <Check size={16} />
                    <span>Save Changes</span>
                  </button>
                )}
              </form>
            </div>
          )}

          {/* ================= TAB 2: MANAGE ADDRESSES ================= */}
          {activeTab === "address" && (
            <div className="profile-section-card">
              <div className="section-title-row">
                <h2>Manage Delivery Addresses</h2>
                {!showAddressForm && (
                  <button className="add-address-btn" onClick={() => handleOpenAddressForm()}>
                    <Plus size={16} />
                    <span>ADD A NEW ADDRESS</span>
                  </button>
                )}
              </div>

              {/* Add / Edit Address Form */}
              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="address-editor-form">
                  <h3>{editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}</h3>

                  <div className="form-row dual">
                    <div className="form-field">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        placeholder="Name"
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>10-digit mobile number *</label>
                      <input
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row dual">
                    <div className="form-field">
                      <label>Pincode *</label>
                      <input
                        type="text"
                        placeholder="6 digits [0-9] PIN code"
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Locality / Area *</label>
                      <input
                        type="text"
                        placeholder="Locality"
                        value={addrLocality}
                        onChange={(e) => setAddrLocality(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Address (House No, Building, Street, Area) *</label>
                    <textarea
                      rows={3}
                      placeholder="Flat No, Building Name, Street Name"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row dual">
                    <div className="form-field">
                      <label>City / District / Town *</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>State *</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>Landmark (Optional)</label>
                    <input
                      type="text"
                      placeholder="E.g. Near Apollo Hospital"
                      value={addrLandmark}
                      onChange={(e) => setAddrLandmark(e.target.value)}
                    />
                  </div>

                  {/* Address Type Selection */}
                  <div className="form-field">
                    <label>Address Type</label>
                    <div className="type-selector">
                      <button
                        type="button"
                        className={`type-btn ${addrType === "Home" ? "active" : ""}`}
                        onClick={() => setAddrType("Home")}
                      >
                        <Home size={15} />
                        <span>Home (All day delivery)</span>
                      </button>

                      <button
                        type="button"
                        className={`type-btn ${addrType === "Work" ? "active" : ""}`}
                        onClick={() => setAddrType("Work")}
                      >
                        <Briefcase size={15} />
                        <span>Work (10 AM - 6 PM)</span>
                      </button>
                    </div>
                  </div>

                  <div className="form-actions-row">
                    <button type="submit" className="save-addr-submit-btn">
                      SAVE ADDRESS
                    </button>
                    <button 
                      type="button" 
                      className="cancel-addr-btn" 
                      onClick={() => { setShowAddressForm(false); setEditingAddressId(null); }}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Addresses List */}
              <div className="addresses-list">
                {addresses.length === 0 ? (
                  <div className="no-address-state">
                    <MapPin size={40} color="#ccc" />
                    <p>No saved delivery addresses found. Add a new address above!</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="address-card">
                      <div className="address-card-header">
                        <span className="address-type-pill">{addr.type || "HOME"}</span>
                        {addr.isDefault && <span className="default-badge">DEFAULT</span>}
                      </div>

                      <div className="address-card-body">
                        <div className="person-info">
                          <h4 className="person-name">{addr.name}</h4>
                          <span className="person-phone">{addr.phone}</span>
                        </div>
                        <p className="full-address-text">
                          {addr.address}, {addr.locality}, {addr.landmark ? `(Landmark: ${addr.landmark}), ` : ""}
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>

                      <div className="address-card-actions">
                        <button className="addr-action-btn edit" onClick={() => handleOpenAddressForm(addr)}>
                          <Edit2 size={14} />
                          <span>EDIT</span>
                        </button>
                        <button className="addr-action-btn delete" onClick={() => handleDeleteAddress(addr.id)}>
                          <Trash2 size={14} />
                          <span>DELETE</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: MY ORDERS ================= */}
          {activeTab === "orders" && (
            <div className="profile-section-card">
              <div className="section-title-row">
                <h2>My Orders & Purchases</h2>
              </div>
              <MyOrders />
            </div>
          )}

          {/* ================= TAB 4: SAVED PAYMENTS ================= */}
          {activeTab === "payments" && (
            <div className="profile-section-card">
              <div className="section-title-row">
                <h2>Saved Cards & UPI ID</h2>
              </div>
              <div className="payments-list">
                <div className="payment-method-card">
                  <CreditCard size={24} color="#2874f0" />
                  <div className="payment-info">
                    <h4>HDFC Bank Credit Card</h4>
                    <p>•••• •••• •••• 4092 (Expires 08/29)</p>
                  </div>
                </div>
                <div className="payment-method-card">
                  <CreditCard size={24} color="#388e3c" />
                  <div className="payment-info">
                    <h4>Google Pay UPI</h4>
                    <p>rahul.sharma@okaxis</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;
