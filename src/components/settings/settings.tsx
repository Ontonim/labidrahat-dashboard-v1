"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Lock } from "lucide-react";

export function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "John Creator",
    email: "john@example.com",
    bio: "Content creator and digital entrepreneur",
    website: "https://example.com",
  });

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Profile Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Name
            </label>
            <Input
              value={profile.name}
              onChange={(e) => handleProfileChange("name", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => handleProfileChange("email", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Bio
            </label>
            <Input
              value={profile.bio}
              onChange={(e) => handleProfileChange("bio", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Website
            </label>
            <Input
              value={profile.website}
              onChange={(e) => handleProfileChange("website", e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </Card>

      {/* Password Settings */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Current Password
            </label>
            <Input
              type="password"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              New Password
            </label>
            <Input
              type="password"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">
              Confirm Password
            </label>
            <Input
              type="password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
            <Lock className="w-4 h-4" />
            Update Password
          </Button>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Notification Preferences
        </h2>
        <div className="space-y-3">
          {[
            { label: "Email notifications for new comments", checked: true },
            { label: "Newsletter subscriber updates", checked: true },
            { label: "Team activity notifications", checked: false },
            { label: "Weekly analytics summary", checked: true },
          ].map((item, index) => (
            <label
              key={index}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                defaultChecked={item.checked}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600"
              />
              <span className="text-slate-200">{item.label}</span>
            </label>
          ))}
        </div>
      </Card>
    </div>
  );
}
