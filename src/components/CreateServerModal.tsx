"use client";

import { useState, useEffect } from "react";
import {
  LinodeType,
  LinodeRegion,
  LinodeImage,
  CreateLinodeRequest,
} from "@/types/linode";
import { formatRegionDisplay, getRegionTooltip } from "@/lib/region-flags";

interface CreateServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (config: CreateLinodeRequest) => void;
  loading?: boolean;
}

export default function CreateServerModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: CreateServerModalProps) {
  const [types, setTypes] = useState<LinodeType[]>([]);
  const [regions, setRegions] = useState<LinodeRegion[]>([]);
  const [images, setImages] = useState<LinodeImage[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<CreateLinodeRequest>({
    type: "",
    region: "",
    image: "",
    label: "",
    root_pass: "",
    authorized_keys: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchModalData();
    }
  }, [isOpen]);

  const fetchModalData = async () => {
    try {
      setLoadingData(true);

      const [typesRes, regionsRes, imagesRes] = await Promise.all([
        fetch("/api/linode-types"),
        fetch("/api/regions"),
        fetch("/api/images"),
      ]);

      const [typesData, regionsData, imagesData] = await Promise.all([
        typesRes.json(),
        regionsRes.json(),
        imagesRes.json(),
      ]);

      if (typesData.success) setTypes(typesData.data);
      if (regionsData.success) setRegions(regionsData.data);
      if (imagesData.success)
        setImages(imagesData.data.filter((img: LinodeImage) => img.is_public));
    } catch (error) {
      console.error("Failed to fetch modal data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateLinodeRequest,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) newErrors.label = "Server label is required";
    if (!formData.type) newErrors.type = "Server type is required";
    if (!formData.region) newErrors.region = "Region is required";
    if (!formData.image) newErrors.image = "Image is required";
    if (!formData.root_pass || formData.root_pass.length < 8) {
      newErrors.root_pass = "Root password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "",
      region: "",
      image: "",
      label: "",
      root_pass: "",
      authorized_keys: [],
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Server</h2>
          <button className="modal-close" onClick={handleClose}>
            ×
          </button>
        </div>

        {loadingData ? (
          <div className="modal-body">
            <div className="loading">Loading server options...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="label">Server Label *</label>
                <input
                  type="text"
                  id="label"
                  value={formData.label}
                  onChange={(e) => handleInputChange("label", e.target.value)}
                  placeholder="my-new-server"
                  className={errors.label ? "error" : ""}
                />
                {errors.label && (
                  <span className="error-text">{errors.label}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="type">Server Type *</label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  className={errors.type ? "error" : ""}
                >
                  <option value="">Select a server type</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label} - ${type.price.monthly}/month
                      {type.specs
                        ? ` (${type.specs.vcpus} CPU, ${type.specs.memory}MB RAM, ${type.specs.disk}GB Storage)`
                        : " (Specs loading...)"}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span className="error-text">{errors.type}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="region">Region *</label>
                <select
                  id="region"
                  value={formData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  className={errors.region ? "error" : ""}
                >
                  <option value="">Select a region</option>
                  {regions.map((region) => (
                    <option
                      key={region.id}
                      value={region.id}
                      title={getRegionTooltip(region.id)}
                    >
                      {formatRegionDisplay(region.id)} - {region.label} (
                      {region.country})
                    </option>
                  ))}
                </select>
                {errors.region && (
                  <span className="error-text">{errors.region}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="image">Operating System *</label>
                <select
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className={errors.image ? "error" : ""}
                >
                  <option value="">Select an operating system</option>
                  {images.map((image) => (
                    <option key={image.id} value={image.id}>
                      {image.label}
                    </option>
                  ))}
                </select>
                {errors.image && (
                  <span className="error-text">{errors.image}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="root_pass">Root Password *</label>
                <input
                  type="password"
                  id="root_pass"
                  value={formData.root_pass}
                  onChange={(e) =>
                    handleInputChange("root_pass", e.target.value)
                  }
                  placeholder="Enter a secure password"
                  className={errors.root_pass ? "error" : ""}
                />
                {errors.root_pass && (
                  <span className="error-text">{errors.root_pass}</span>
                )}
                <small className="form-help">
                  Password must be at least 8 characters long
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="ssh_keys">SSH Keys (Optional)</label>
                <textarea
                  id="ssh_keys"
                  rows={3}
                  placeholder="Paste your SSH public key(s) here (one per line)"
                  onChange={(e) => {
                    const keys = e.target.value
                      .split("\n")
                      .filter((key) => key.trim());
                    setFormData((prev) => ({ ...prev, authorized_keys: keys }));
                  }}
                />
                <small className="form-help">
                  Add SSH keys for secure access without passwords
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Server"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
