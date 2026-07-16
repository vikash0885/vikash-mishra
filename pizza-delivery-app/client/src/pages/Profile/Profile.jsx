import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (['street', 'city', 'state', 'pincode'].includes(name)) {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateProfile(formData);
    if (res.success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  return (
    <div className="profile-page container">
      <h1 className="page-title text-center">My Profile</h1>
      
      <div className="profile-card glass-card animate-slide-up">
        <div className="profile-header">
          <div className="avatar-large">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="profile-title">
            <h2>{user?.name}</h2>
            <p className="text-muted"><FiMail /> {user?.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form animate-fade-in">
            <h3 className="section-title">Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-with-icon">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-with-icon">
                  <FiPhone className="input-icon" />
                  <input
                    type="text"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <h3 className="section-title mt-4">Saved Address</h3>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                name="street"
                className="form-control"
                value={formData.address.street}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  name="state"
                  className="form-control"
                  value={formData.address.state}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  className="form-control"
                  value={formData.address.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-actions">
              <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info animate-fade-in">
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Phone Number</span>
                <span className="value">{user?.phone || 'Not provided'}</span>
              </div>
              <div className="info-item full-width">
                <span className="label">Saved Address</span>
                <span className="value">
                  {user?.address?.street ? (
                    <>
                      {user.address.street}, {user.address.city}<br/>
                      {user.address.state} - {user.address.pincode}
                    </>
                  ) : 'No address saved yet'}
                </span>
              </div>
            </div>
            <button className="btn btn-primary mt-4" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
