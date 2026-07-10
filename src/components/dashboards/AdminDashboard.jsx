import React, { useState, useEffect } from 'react'
import { Users, Package, Truck, TrendingUp, BarChart3, Settings, AlertTriangle, CheckCircle, Clock, MapPin, ArrowUpRight, ArrowDownRight, Activity, Shield, FileText, Check, X, Phone, Mail, Award, Map, LogOut, Eye, Car, Hash, Calendar, Star } from 'lucide-react'
import { collection, query, getDocs, getDoc, doc, onSnapshot } from 'firebase/firestore'
import { adminUpdateVerification } from '../../lib/reputationService'
import { db } from '../../lib/firebase'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../ui/Toast'
import SettingsDropdown from './SettingsDropdown'

// ── Transporter Detail Modal ─────────────────────────────────────────────────
function TransporterDetailModal({ user, profile, onClose }) {
  if (!user) return null
  const isTransport = user.role === 'transport'
  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-earth-100 last:border-0">
      <div className="text-terracotta-500 mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-earth-400 font-medium">{label}</p>
        <p className="text-sm text-earth-800 font-semibold mt-0.5">{value || 'Not provided'}</p>
      </div>
    </div>
  )
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.55)'}} onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-terracotta-600 to-earth-700 rounded-t-3xl px-6 py-5 flex justify-between items-start">
          <div>
            <p className="text-xs text-white/70 font-medium uppercase tracking-wider mb-1">{user.role} · Profile Review</p>
            <h2 className="text-xl font-bold text-white">{user.displayName || user.name}</h2>
            <p className="text-sm text-white/80 mt-0.5">{user.email}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Body */}
        <div className="px-6 py-4">
          {/* Contact */}
          <p className="text-xs font-bold text-earth-400 uppercase tracking-wider mb-2">Contact Information</p>
          <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
          <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={user.phone} />
          <InfoRow icon={<Calendar className="w-4 h-4" />} label="Joined" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'} />

          {/* Role-specific details */}
          {isTransport && (
            <>
              <p className="text-xs font-bold text-earth-400 uppercase tracking-wider mt-5 mb-2">Vehicle & Transport Details</p>
              <InfoRow icon={<Car className="w-4 h-4" />} label="Vehicle Type" value={profile?.vehicle_type} />
              <InfoRow icon={<Package className="w-4 h-4" />} label="Vehicle Capacity" value={profile?.vehicle_capacity} />
              <InfoRow icon={<Hash className="w-4 h-4" />} label="License Number" value={profile?.license_number} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Operating Region" value={profile?.region || profile?.community} />
            </>
          )}
          {user.role === 'farmer' && (
            <>
              <p className="text-xs font-bold text-earth-400 uppercase tracking-wider mt-5 mb-2">Farm Details</p>
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Farm Name" value={profile?.farm_name} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Community" value={profile?.community} />
              <InfoRow icon={<Award className="w-4 h-4" />} label="Farm Size" value={profile?.farm_size} />
              <InfoRow icon={<Star className="w-4 h-4" />} label="Years Experience" value={profile?.years_experience} />
            </>
          )}
          {user.role === 'buyer' && (
            <>
              <p className="text-xs font-bold text-earth-400 uppercase tracking-wider mt-5 mb-2">Business Details</p>
              <InfoRow icon={<Award className="w-4 h-4" />} label="Business Name" value={profile?.business_name} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location" value={profile?.location} />
              <InfoRow icon={<Package className="w-4 h-4" />} label="Buyer Type" value={profile?.buyer_type} />
            </>
          )}

          {/* Reputation */}
          <p className="text-xs font-bold text-earth-400 uppercase tracking-wider mt-5 mb-2">Platform Stats</p>
          <InfoRow icon={<Star className="w-4 h-4" />} label="Verification Status" value={profile?.verification_status} />
          <InfoRow icon={<CheckCircle className="w-4 h-4" />} label="Completed Deliveries" value={profile?.completed_deliveries ?? profile?.completed_orders ?? profile?.completed_purchases ?? 0} />
          <InfoRow icon={<TrendingUp className="w-4 h-4" />} label="Average Rating" value={profile?.average_rating ? `${profile.average_rating} / 5` : 'N/A'} />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard({ onNavigate, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const { logOut, currentUser } = useAuth()
  const { toast } = useToast()

  const [allUsers, setAllUsers] = useState([])
  const [verifications, setVerifications] = useState({})
  const [roleProfiles, setRoleProfiles] = useState({})
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const [userRoleFilter, setUserRoleFilter] = useState('all')
  const [verificationRoleFilter, setVerificationRoleFilter] = useState('all')

  // Real-time listener for users — only attach if we have an authenticated user
  useEffect(() => {
    if (!currentUser) return
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersList = [];
      snapshot.forEach(docSnap => {
        usersList.push({ id: docSnap.id, ...docSnap.data() });
      });
      setAllUsers(usersList);
      setPermissionDenied(false);
    }, (error) => {
      console.error('Firestore users listener error:', error);
      if (error.code === 'permission-denied') {
        setPermissionDenied(true);
        toast('Admin access denied — update Firestore security rules to allow admins.', 'error');
      }
    });
    return unsub;
  }, [currentUser]);

  // Real-time listener for verifications
  useEffect(() => {
    if (!currentUser) return
    const unsub = onSnapshot(collection(db, 'verifications'), (snapshot) => {
      const verMap = {};
      snapshot.forEach(docSnap => {
        verMap[docSnap.id] = docSnap.data();
      });
      setVerifications(verMap);
    }, (error) => {
      console.error('Firestore verifications listener error:', error);
    });
    return unsub;
  }, [currentUser]);

  // Real-time listener for role profiles
  useEffect(() => {
    if (!currentUser) return
    const handleError = (label) => (error) => {
      console.error(`Firestore ${label} listener error:`, error);
    };
    const unsubFarmers = onSnapshot(collection(db, 'farmers'), (snapshot) => {
      setRoleProfiles(prev => {
        const next = { ...prev };
        snapshot.forEach(docSnap => {
          next[docSnap.id] = { ...docSnap.data(), role: 'farmer' };
        });
        return next;
      });
    }, handleError('farmers'));
    const unsubBuyers = onSnapshot(collection(db, 'buyers'), (snapshot) => {
      setRoleProfiles(prev => {
        const next = { ...prev };
        snapshot.forEach(docSnap => {
          next[docSnap.id] = { ...docSnap.data(), role: 'buyer' };
        });
        return next;
      });
    }, handleError('buyers'));
    const unsubTransporters = onSnapshot(collection(db, 'transporters'), (snapshot) => {
      setRoleProfiles(prev => {
        const next = { ...prev };
        snapshot.forEach(docSnap => {
          next[docSnap.id] = { ...docSnap.data(), role: 'transport' };
        });
        return next;
      });
    }, handleError('transporters'));

    return () => {
      unsubFarmers();
      unsubBuyers();
      unsubTransporters();
    };
  }, [currentUser]);

  // Live-only users list from Firestore
  const usersPending = React.useMemo(() => {
    return allUsers.map(user => {
      const ver = verifications[user.id] || {
        phone_verified: false,
        email_verified: false,
        national_id_verified: false,
        location_verified: false,
        vehicle_verified: false,
      };
      const profile = roleProfiles[user.id] || {};
      return {
        ...user,
        name: user.displayName || profile.farm_name || profile.business_name || 'User',
        verifications: ver,
        ...profile,
      };
    });
  }, [allUsers, verifications, roleProfiles]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    { id: 'verifications', label: 'Verifications', icon: <Shield className="w-5 h-5" /> },
    { id: 'supply', label: 'Supply Chain', icon: <Truck className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
  ]

  const overviewStats = React.useMemo(() => {
    const totalUsers = allUsers.length;
    const activeListings = allUsers.length;
    const transportJobs = allUsers.filter(u => u.role === 'transport').length;
    const revenue = '₵0';

    return [
      { label: 'Total Users', value: totalUsers.toString(), change: '', icon: <Users className="w-5 h-5" />, color: 'terracotta' },
      { label: 'Active Listings', value: activeListings.toString(), change: '', icon: <Package className="w-5 h-5" />, color: 'forest' },
      { label: 'Transporters', value: transportJobs.toString(), change: '', icon: <Truck className="w-5 h-5" />, color: 'gold' },
      { label: 'Monthly Revenue', value: revenue, change: '', icon: <TrendingUp className="w-5 h-5" />, color: 'earth' },
    ];
  }, [allUsers]);

  const recentUsers = React.useMemo(() => {
    const processed = allUsers.map(user => {
      const profile = roleProfiles[user.id] || {};

      let joinedDate = null;
      if (user.createdAt) {
        joinedDate = user.createdAt;
      } else if (profile.joined_date) {
        joinedDate = profile.joined_date;
      }

      const formattedJoined = joinedDate
        ? new Date(joinedDate).toLocaleDateString()
        : 'N/A';

      return {
        ...user,
        name: user.displayName || profile.farm_name || profile.business_name || 'User',
        location: profile.community || profile.location || 'Not Specified',
        status: profile.verification_status || 'Active',
        joined: formattedJoined,
        joinedDate: joinedDate,
      };
    });

    const filtered = processed.filter(u => {
      if (userRoleFilter === 'all') return true;
      return u.role === userRoleFilter;
    });

    console.log('Users after filtering:', filtered);

    const sorted = filtered.sort((a, b) => {
      // Sort by joined date (newest first)
      if (!a.joinedDate && !b.joinedDate) return 0;
      if (!a.joinedDate) return 1;
      if (!b.joinedDate) return -1;
      return new Date(b.joinedDate) - new Date(a.joinedDate);
    });

    console.log('Final sorted users:', sorted);
    return sorted;
  }, [allUsers, roleProfiles, userRoleFilter]);

  const supplyChainActivity = React.useMemo(() => {
    return [
      { id: 1, type: 'order', from: 'Ho', to: 'Keta', status: 'in_transit', progress: 65 },
      { id: 2, type: 'order', from: 'Anloga', to: 'Ho', status: 'loading', progress: 30 },
      { id: 3, type: 'order', from: 'Keta', to: 'Anloga', status: 'delivered', progress: 100 },
    ];
  }, []);

  const alerts = React.useMemo(() => {
    const list = [
      { id: 'alert-1', type: 'warning', message: 'High spoilage risk for tomatoes in Anloga', time: '2 hours ago' },
      { id: 'alert-2', type: 'info', message: 'New transport route available: Ho - Keta', time: '4 hours ago' },
      { id: 'alert-3', type: 'success', message: 'Weekly revenue target exceeded by 15%', time: '6 hours ago' },
    ];
    // Dynamic alerts
    allUsers.forEach(u => {
      const profile = roleProfiles[u.id];
      if (u.role === 'transport' && profile && profile.verification_status === 'pending_review') {
        list.push({
          id: `alert-trans-${u.id}`,
          type: 'warning',
          message: `Transporter ${u.displayName || 'Partner'} submitted documents for review`,
          time: 'New'
        });
      }
    });
    return list;
  }, [allUsers, roleProfiles]);

  const regionData = React.useMemo(() => {
    return [
      { region: 'Ho', users: 847, listings: 423, revenue: '₵18,500', growth: '+12%' },
      { region: 'Anloga', users: 623, listings: 312, revenue: '₵12,300', growth: '+18%' },
      { region: 'Keta', users: 512, listings: 287, revenue: '₵10,200', growth: '+15%' },
    ];
  }, []);

  async function handleLogout() {
    await logOut()
    if (onLogout) onLogout()
  }

  return (
    <div className="min-h-screen bg-ivory-50 pb-24">
      {/* User Detail Modal */}
      {selectedUser && (
        <TransporterDetailModal
          user={selectedUser.user}
          profile={selectedUser.profile}
          onClose={() => setSelectedUser(null)}
        />
      )}
      {/* Firestore Permission-Denied Warning Banner */}
      {permissionDenied && (
        <div className="sticky top-0 z-[60] flex items-start gap-3 bg-red-50 border-b-2 border-red-400 px-6 py-4 text-red-800">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-bold text-sm">Firestore Permission Denied</p>
            <p className="text-xs mt-0.5">
              Your admin account does not have Firestore read access yet.
              Deploy the <code className="bg-red-100 px-1 rounded font-mono">firestore.rules</code> file
              in your project root to the Firebase Console under <strong>Firestore → Rules</strong>, then reload.
            </p>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-earth-900">Admin Dashboard</h1>
            <p className="text-sm text-earth-500">Platform Overview</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => toast(`Platform status: Healthy. All systems operational.`, 'info')}
              className="relative p-2 rounded-xl hover:bg-earth-100 transition-colors"
            >
              <AlertTriangle className="w-6 h-6 text-earth-600" />
              {alerts.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-sunset-500 rounded-full" />
              )}
            </button>
            <SettingsDropdown onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-terracotta-600 text-white'
                  : 'bg-white text-earth-600 hover:bg-earth-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="px-6 py-6 max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {overviewStats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Alerts */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-earth-900 mb-4">Recent Alerts</h2>
              <div className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-sm text-earth-500">No active alerts at this time.</p>
                ) : (
                  alerts.map((alert) => (
                    <AlertItem key={alert.id} alert={alert} />
                  ))
                )}
              </div>
            </div>

            {/* Region Performance */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-earth-900 mb-4">Region Performance</h2>
              <div className="space-y-4">
                {regionData.length === 0 ? (
                  <p className="text-sm text-earth-500">No region data loaded.</p>
                ) : (
                  regionData.map((region, index) => (
                    <RegionCard key={index} region={region} />
                  ))
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-bold text-earth-900 mb-4">Platform Activity</h2>
              <div className="space-y-3">
                <ActivityItem message="New farmer registered in Ho" time="10 min ago" type="user" />
                <ActivityItem message="Order #2847 completed successfully" time="25 min ago" type="order" />
                <ActivityItem message="Transport route optimized for Keta" time="1 hour ago" type="system" />
                <ActivityItem message="Market price alert: Cassava +12%" time="2 hours ago" type="alert" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-earth-900">User Management</h2>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {['all', 'farmer', 'buyer', 'transport'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setUserRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                      userRoleFilter === role
                        ? 'bg-terracotta-600 text-white border-terracotta-600'
                        : 'bg-white text-earth-600 border-earth-200 hover:bg-earth-50'
                    }`}
                  >
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              {recentUsers.length === 0 ? (
                <p className="text-sm text-earth-500 p-6 text-center">No users match this filter.</p>
              ) : (
                recentUsers.map((user) => {
                  const profile = roleProfiles[user.id] || {}
                  return (
                    <UserCard 
                      key={user.id} 
                      user={user} 
                      profile={profile}
                      onViewDetails={() => setSelectedUser({ user, profile })} 
                    />
                  )
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-earth-900">Document Verification Queue</h2>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                {['all', 'farmer', 'buyer', 'transport'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setVerificationRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border whitespace-nowrap ${
                      verificationRoleFilter === role
                        ? 'bg-terracotta-600 text-white border-terracotta-600'
                        : 'bg-white text-earth-600 border-earth-200 hover:bg-earth-50'
                    }`}
                  >
                    {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              {usersPending.filter(u => {
                if (verificationRoleFilter !== 'all' && u.role !== verificationRoleFilter) return false;
                const ver = u.verifications;
                const isFullyVerified = ver.phone_verified && ver.email_verified && ver.national_id_verified && ver.location_verified && (u.role !== 'transport' || ver.vehicle_verified);
                return !isFullyVerified;
              }).length === 0 ? (
                <p className="text-sm text-earth-500 p-6 text-center bg-white rounded-3xl border border-earth-100">No users pending verification.</p>
              ) : (
                usersPending.filter(u => {
                  if (verificationRoleFilter !== 'all' && u.role !== verificationRoleFilter) return false;
                  const ver = u.verifications;
                  const isFullyVerified = ver.phone_verified && ver.email_verified && ver.national_id_verified && ver.location_verified && (u.role !== 'transport' || ver.vehicle_verified);
                  return !isFullyVerified;
                }).map((user) => {
                  const checklistItems = [
                    { key: 'phone_verified', label: 'Phone Verification', icon: <Phone className="w-4 h-4" /> },
                    { key: 'email_verified', label: 'Email Verification', icon: <Mail className="w-4 h-4" /> },
                    { key: 'national_id_verified', label: 'National Identity ID', icon: <Award className="w-4 h-4" /> },
                    { key: 'location_verified', label: 'Location Audit', icon: <Map className="w-4 h-4" /> },
                  ]
                  if (user.role === 'transport') {
                    checklistItems.push({ key: 'vehicle_verified', label: 'Vehicle Condition Audit', icon: <Truck className="w-4 h-4" /> })
                  }

                  const handleApproveUser = async (user) => {
                    const fields = ['phone_verified','email_verified','national_id_verified','location_verified'];
                    if (user.role === 'transport') fields.push('vehicle_verified');
                    try {
                      for (const f of fields) {
                        await adminUpdateVerification(user.id, f, true, user.role);
                      }
                      toast(`Approved ${user.name} successfully!`, 'success');
                    } catch (error) {
                      console.error('Approve error:', error);
                      toast(`Failed to approve ${user.name}: ${error.message}`, 'error');
                    }
                  };

                  const handleRejectUser = async (user) => {
                    
                    const fields = ['phone_verified','email_verified','national_id_verified','location_verified'];
                    if (user.role === 'transport') fields.push('vehicle_verified');
                    try {
                      for (const f of fields) {
                        await adminUpdateVerification(user.id, f, false, user.role);
                      }
                      toast(`Rejected/Reset verification for ${user.name}`, 'info');
                    } catch (error) {
                      console.error('Reject error:', error);
                      toast(`Failed to reject ${user.name}: ${error.message}`, 'error');
                    }
                  };

                  const handleToggle = async (field, currentValue) => {
                    const updatedValue = !currentValue
                    try {
                      console.log(`Toggling ${field} for user ${user.id} from ${currentValue} to ${updatedValue}`);
                      await adminUpdateVerification(user.id, field, updatedValue, user.role)
                      console.log(`Successfully updated ${field} to ${updatedValue}`);
                      toast(`${field.replace('_', ' ')} updated successfully.`, 'success')
                    } catch (error) {
                      console.error("Toggle error:", error)
                      toast(`Failed to update ${field.replace('_', ' ')}: ${error.message}`, 'error')
                    }
                  }

                  const profile = roleProfiles[user.id] || {}

                  return (
                    <div key={user.id} className="glass rounded-3xl p-6 hover:shadow-md transition duration-300">
                      <div className="flex justify-between items-start border-b border-earth-100 pb-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-earth-900">{user.name}</h3>
                          <p className="text-xs font-semibold text-terracotta-600 capitalize">
                            {user.role} · {profile.farm_name || profile.business_name || profile.vehicle_type || 'Transport Partner'}
                          </p>
                          {user.email && <p className="text-xs text-earth-400 mt-0.5">{user.email}</p>}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-2.5 py-0.5 bg-earth-100 text-earth-800 rounded-full text-xs capitalize font-medium">
                            ID: {user.id.substring(0, 8)}...
                          </span>
                          <button
                            onClick={() => setSelectedUser({ user, profile })}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-terracotta-50 hover:bg-terracotta-100 text-terracotta-700 rounded-xl text-xs font-semibold transition-all border border-terracotta-200"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-bold text-earth-400 uppercase tracking-wider">Credential Verification Checks</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {checklistItems.map(item => {
                            const isVerified = user.verifications[item.key]
                            return (
                              <div key={item.key} className="flex items-center justify-between p-3 bg-earth-50/50 rounded-2xl border border-earth-100">
                                <div className="flex items-center gap-2">
                                  <div className="text-earth-500">
                                    {item.icon}
                                  </div>
                                  <span className="text-xs text-earth-700 font-medium">{item.label}</span>
                                </div>
                                
                                <button
                                  onClick={() => handleToggle(item.key, isVerified)}
                                  className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold transition-all duration-300 ${
                                    isVerified
                                      ? 'bg-forest-100 hover:bg-forest-200 text-forest-700'
                                      : 'bg-terracotta-100 hover:bg-terracotta-200 text-terracotta-700'
                                  }`}
                                >
                                  {isVerified ? (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Verified</span>
                                    </>
                                  ) : (
                                    <>
                                      <X className="w-3.5 h-3.5" />
                                      <span>Unverified</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div className="flex gap-3 pt-6">
                        <button onClick={() => handleApproveUser(user)} className="flex-1 px-4 py-2 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition">Approve All</button>
                        <button onClick={() => handleRejectUser(user)} className="flex-1 px-4 py-2 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition">Reject / Reset</button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'supply' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Supply Chain Activity</h2>
            <div className="grid gap-4">
              {supplyChainActivity.map((activity) => (
                <SupplyChainCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">User Growth</h3>
                <div className="h-48 bg-earth-50 rounded-xl flex items-center justify-center">
                  <p className="text-earth-500">Growth chart</p>
                </div>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Revenue Trends</h3>
                <div className="h-48 bg-earth-50 rounded-xl flex items-center justify-center">
                  <p className="text-earth-500">Revenue chart</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-earth-900 mb-4">Key Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <MetricCard label="Avg Order Value" value="₵850" change="+8%" />
                <MetricCard label="Completion Rate" value="94%" change="+2%" />
                <MetricCard label="Active Users" value="1,847" change="+12%" />
                <MetricCard label="Satisfaction" value="4.8/5" change="+0.2" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-earth-900">Reports</h2>
            
            <div className="grid gap-4">
              <ReportCard 
                title="Weekly Performance Report" 
                date="This week" 
                status="ready"
                icon={<Activity />}
              />
              <ReportCard 
                title="Monthly Revenue Summary" 
                date="This month" 
                status="ready"
                icon={<TrendingUp />}
              />
              <ReportCard 
                title="Supply Chain Analysis" 
                date="Last month" 
                status="ready"
                icon={<Truck />}
              />
              <ReportCard 
                title="User Engagement Report" 
                date="Last month" 
                status="processing"
                icon={<Users />}
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-earth-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <NavItem icon={<BarChart3 className="w-6 h-6" />} label="Home" onClick={() => onNavigate('home')} />
          <NavItem icon={<Users className="w-6 h-6" />} label="Users" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon={<Shield className="w-6 h-6" />} label="Verify" active={activeTab === 'verifications'} onClick={() => setActiveTab('verifications')} />
        </div>
      </nav>
    </div>
  )
}

function StatCard({ stat }) {
  const colorClasses = {
    terracotta: 'from-terracotta-500 to-terracotta-600 bg-terracotta-50',
    forest: 'from-forest-500 to-forest-600 bg-forest-50',
    gold: 'from-gold-500 to-gold-600 bg-gold-50',
    earth: 'from-earth-500 to-earth-600 bg-earth-50',
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[stat.color]} flex items-center justify-center text-white mb-3`}>
        {stat.icon}
      </div>
      <p className="text-sm text-earth-600 mb-1">{stat.label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-earth-900">{stat.value}</span>
        <span className="text-sm font-medium text-forest-600">{stat.change}</span>
      </div>
    </div>
  )
}

function AlertItem({ alert }) {
  const typeColors = {
    warning: 'bg-sunset-100 text-sunset-700',
    info: 'bg-forest-100 text-forest-700',
    success: 'bg-gold-100 text-gold-700',
  }

  const typeIcons = {
    warning: <AlertTriangle className="w-4 h-4" />,
    info: <Activity className="w-4 h-4" />,
    success: <CheckCircle className="w-4 h-4" />,
  }

  return (
    <div className="flex items-center gap-4 p-3 bg-earth-50 rounded-xl">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${typeColors[alert.type]}`}>
        {typeIcons[alert.type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-earth-900">{alert.message}</p>
        <p className="text-xs text-earth-500">{alert.time}</p>
      </div>
    </div>
  )
}

function RegionCard({ region }) {
  return (
    <div className="flex items-center justify-between p-4 bg-earth-50 rounded-xl hover:bg-earth-100 transition-colors">
      <div>
        <p className="font-semibold text-earth-900">{region.region}</p>
        <p className="text-sm text-earth-500">{region.users} users • {region.listings} listings</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-earth-900">{region.revenue}</p>
        <p className="text-sm font-medium text-forest-600">{region.growth}</p>
      </div>
    </div>
  )
}

function ActivityItem({ message, time, type }) {
  const typeColors = {
    user: 'bg-terracotta-100 text-terracotta-600',
    order: 'bg-forest-100 text-forest-600',
    system: 'bg-gold-100 text-gold-600',
    alert: 'bg-sunset-100 text-sunset-600',
  }

  return (
    <div className="flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full ${typeColors[type]}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-earth-900">{message}</p>
        <p className="text-xs text-earth-500">{time}</p>
      </div>
    </div>
  )
}

function UserCard({ user, profile, onViewDetails }) {
  const statusColors = {
    active: 'bg-forest-100 text-forest-700',
    pending: 'bg-gold-100 text-gold-700',
    suspended: 'bg-sunset-100 text-sunset-700',
  }

  const roleColors = {
    farmer: 'bg-terracotta-100 text-terracotta-700',
    buyer: 'bg-forest-100 text-forest-700',
    transport: 'bg-gold-100 text-gold-700',
    admin: 'bg-purple-100 text-purple-700',
  }

  // Format creation timestamp
  let timestampLabel = 'N/A'
  if (user.createdAt) {
    const dateObj = user.createdAt.seconds 
      ? new Date(user.createdAt.seconds * 1000) 
      : new Date(user.createdAt)
    timestampLabel = dateObj.toLocaleString()
  } else if (profile?.joined_date) {
    timestampLabel = new Date(profile.joined_date).toLocaleString()
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-earth-900">{user.name}</h3>
          <div className="flex items-center gap-2 text-sm text-earth-600 mt-1">
            <MapPin className="w-4 h-4" />
            <span>{user.location || user.community || 'Not Specified'}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${roleColors[user.role] || 'bg-earth-100 text-earth-700'}`}>
            {user.role}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${statusColors[user.status?.toLowerCase()] || 'bg-earth-100 text-earth-700'}`}>
            {user.status || 'Active'}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-earth-100">
        <div>
          <p className="text-xs text-earth-400 font-medium">Registration Timestamp</p>
          <p className="text-sm font-semibold text-earth-700 mt-0.5">{timestampLabel}</p>
        </div>
        <button 
          onClick={onViewDetails}
          className="px-4 py-2 bg-white text-earth-900 rounded-xl font-semibold hover:bg-earth-100 transition-colors border border-earth-200 text-xs shrink-0 self-end sm:self-auto"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

function ProduceListingCard({ produce }) {
  const statusColors = {
    listed: 'bg-forest-100 text-forest-700',
    pending: 'bg-gold-100 text-gold-700',
    sold: 'bg-earth-100 text-earth-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-earth-900">{produce.name}</h3>
          <p className="text-sm text-earth-500">{produce.farmer} • {produce.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[produce.status]}`}>
          {produce.status}
        </span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm text-earth-500">{produce.quantity}</p>
          <p className="text-xl font-bold text-terracotta-600">{produce.price}</p>
        </div>
        <button className="px-4 py-2 bg-white text-earth-900 rounded-xl font-medium hover:bg-earth-100 transition-colors border border-earth-200">
          Manage
        </button>
      </div>
    </div>
  )
}

function SupplyChainCard({ activity }) {
  const statusColors = {
    loading: 'bg-gold-100 text-gold-700',
    in_transit: 'bg-terracotta-100 text-terracotta-700',
    delivered: 'bg-forest-100 text-forest-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-terracotta-600" />
          <div className="flex items-center gap-2 text-earth-900 font-semibold">
            <span>{activity.from}</span>
            <ArrowUpRight className="w-4 h-4" />
            <span>{activity.to}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
          {activity.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-earth-600">Progress</span>
          <span className="text-sm font-medium text-earth-900">{activity.progress}%</span>
        </div>
        <div className="h-2 bg-earth-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-terracotta-500 to-forest-500 rounded-full"
            style={{ width: `${activity.progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, change }) {
  return (
    <div className="p-4 bg-earth-50 rounded-xl">
      <p className="text-xs text-earth-500 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-xl font-bold text-earth-900">{value}</span>
        <span className="text-sm font-medium text-forest-600">{change}</span>
      </div>
    </div>
  )
}

function ReportCard({ title, date, status, icon }) {
  const statusColors = {
    ready: 'bg-forest-100 text-forest-700',
    processing: 'bg-gold-100 text-gold-700',
    pending: 'bg-earth-100 text-earth-700',
  }

  return (
    <div className="glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-terracotta-100 rounded-xl flex items-center justify-center text-terracotta-600">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-earth-900">{title}</h3>
            <p className="text-sm text-earth-500">{date}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      
      <button className="w-full px-4 py-2 bg-terracotta-600 text-white rounded-xl font-medium hover:bg-terracotta-700 transition-colors">
        Download Report
      </button>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all duration-300 ${
        active ? 'text-terracotta-600' : 'text-earth-400 hover:text-earth-600'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}
