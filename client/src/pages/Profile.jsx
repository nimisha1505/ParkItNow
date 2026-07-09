import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Shield, UserCheck } from 'lucide-react';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-slate-400">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-100">Not Logged In</h2>
        <p className="text-slate-400">Please sign in to view your profile page details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-700 pb-6">
          <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-full">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100">{user.name}</h2>
            <span className="bg-slate-900 border border-slate-700 text-slate-300 text-xs px-2.5 py-0.5 rounded capitalize font-semibold">
              {user.role} Account
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Account Specifications</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-lg border border-slate-750">
              <Mail className="h-5 w-5 text-slate-500" />
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Email Address</span>
                <span className="text-slate-200 text-sm font-medium">{user.email}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-lg border border-slate-750">
              <Shield className="h-5 w-5 text-slate-500" />
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">Account Role</span>
                <span className="text-slate-200 text-sm font-medium capitalize">{user.role}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-lg border border-slate-750">
              <UserCheck className="h-5 w-5 text-slate-500" />
              <div>
                <span className="text-[10px] text-slate-500 font-semibold block uppercase">User ID</span>
                <span className="text-slate-355 text-xs font-mono">{user._id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
export { Profile };
