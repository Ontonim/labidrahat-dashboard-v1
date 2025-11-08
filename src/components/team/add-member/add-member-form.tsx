"use client";

import type React from "react";
import { ExpertiseInput } from "./expertise-input";
import { ImageUpload } from "./image-upload";
import { useAddMemberForm } from "@/hooks/team-members/use-add-member-form";
import { useImageUpload } from "@/hooks/team-members/use-image-upload";
import { addMember } from "@/actions/team-members/add-members";

export default function AddMemberForm() {
  const form = useAddMemberForm();
  const imageUpload = useImageUpload();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.formData.name.trim()) {
      form.setFormError("Name is required");
      return;
    }
    if (!form.formData.email.trim()) {
      form.setFormError("Email is required");
      return;
    }
    if (!form.formData.password.trim()) {
      form.setFormError("Password is required");
      return;
    }
    if (!form.formData.image) {
      form.setFormError("Image is required");
      return;
    }
    if (!form.formData.mobile) {
      form.setFormError("Mobile number is required");
    }
    if (!form.formData.role) {
      form.setFormError("Role is required");
    }
    if (!form.formData.bio) {
      form.setFormError("Bio is required");
    }
    if (form.formData.expertise.length === 0) {
      form.setFormError("Add at least one expertise");
      return;
    }

    form.setFormLoading(true);

    try {
      const result = await addMember(form.formData);

      if (result.success) {
        form.setFormSuccess(true);
        form.resetForm();
        imageUpload.clearPreview();
        setTimeout(() => {
          form.setFormSuccess(false);
        }, 3000);
      } else {
        form.setFormError(result.error || "Failed to add member");
      }
    } catch (err) {
      form.setFormError(
        err instanceof Error ? err.message : "An error occurred"
      );
    } finally {
      form.setFormLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-[#1D293D]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add Member</h1>
        <p className="text-muted-foreground">
          Create a new team member profile
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="w-[200px]">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Profile Image *
          </label>
          <ImageUpload
            preview={imageUpload.preview}
            isUploading={imageUpload.uploadProgress.isUploading}
            progress={imageUpload.uploadProgress.progress}
            error={imageUpload.uploadProgress.error}
            onFileSelect={imageUpload.handleFileSelect}
            onImageUrl={(url) => form.setImage(url)}
            onClear={imageUpload.clearPreview}
          />
        </div>
        {form.success && (
          <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-medium text-green-800">
              Member added successfully!
            </p>
          </div>
        )}

        {form.error && (
          <div className="px-4 py-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <p className="text-sm font-medium text-destructive">{form.error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Name *
            </label>
            <input
              type="text"
              value={form.formData.name}
              onChange={(e) => form.updateField("name", e.target.value)}
              placeholder="Enter full name"
              className="w-full px-4 py-3 border border-input rounded-lg bg-[#17202E] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email *
            </label>
            <input
              type="email"
              value={form.formData.email}
              onChange={(e) => form.updateField("email", e.target.value)}
              placeholder="Enter email address"
              className="w-full px-4 py-3 border border-input rounded-lg bg-[#17202E] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Password *
            </label>
            <input
              type="password"
              value={form.formData.password}
              onChange={(e) => form.updateField("password", e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-input rounded-lg bg-[#17202E] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Mobile
            </label>
            <input
              type="tel"
              value={form.formData.mobile}
              onChange={(e) => form.updateField("mobile", e.target.value)}
              placeholder="Enter mobile number"
              className="w-full px-4 py-3 border border-input rounded-lg bg-[#17202E] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Role
            </label>
            <select
              value={form.formData.role}
              onChange={(e) => form.updateField("role", e.target.value)}
              className="w-full px-4 py-3 border border-input rounded-lg bg-[#17202E] text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
            >
              <option value="" disabled>
                Select a role
              </option>
              <option value="editor">Video Editor</option>
              <option value="designer">Designer</option>
              <option value="researcher">Researcher</option>
              <option value="moderator">Moderator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Expertise *
            </label>
            <ExpertiseInput
              expertise={form.formData.expertise}
              onAdd={form.addExpertise}
              onRemove={form.removeExpertise}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Bio
          </label>
          <textarea
            value={form.formData.bio}
            onChange={(e) => form.updateField("bio", e.target.value)}
            placeholder="Enter a short bio"
            rows={4}
            className="w-full px-4 py-3 border border-input rounded-lg bg-[#17202E] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={form.isLoading}
          className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {form.isLoading ? "Adding Member..." : "Add Member"}
        </button>
      </form>
    </div>
  );
}