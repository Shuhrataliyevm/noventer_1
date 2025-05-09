import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ToshkentMap"
import { toast } from "sonner";
import "./Register.scss";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [coordinates, setCoordinates] = useState<{
    latitude: string;
    longitude: string;
  }>({
    latitude: "",
    longitude: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapClick = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const latitude = (41.3 + (y / 400) * 0.1).toFixed(6);
    const longitude = (69.2 + (x / 600) * 0.1).toFixed(6);

    setCoordinates({ latitude, longitude });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Parollar mos emas");
      return;
    }
    if (!/^\+?998[0-9]{9}$/.test(formData.phoneNumber)) {
      toast.error("Telefon raqami +998 bilan boshlanishi kerak");
      return;
    }
    if (!coordinates.latitude || !coordinates.longitude) {
      toast.error("Xaritadan joy tanlang");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://s-libraries.uz/api/v1/auth/register-library/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: {
              password: formData.password,
              name: formData.fullName,
              phone: formData.phoneNumber,
            },
            library: {
              address: "Tashkent",
              social_media: {},
              can_rent_books: true,
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
            },
          }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Xatolik yuz berdi");

      toast.success("Muvaffaqiyatli ro‘yxatdan o‘tildi");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h1>Ro‘yxatdan o‘tish</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Ism:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Telefon:</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+998xxxxxxxxx"
            required
          />
        </div>
        <div className="form-group">
          <label>Parol:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Parolni tasdiqlash:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Xaritadan joy tanlang:</label>
          <canvas
            width={600}
            height={400}
            onClick={handleMapClick}
            className="map-canvas"
          ></canvas>
          <p>
            Latitude: {coordinates.latitude} | Longitude:{" "}
            {coordinates.longitude}
          </p>
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Yuborilmoqda..." : "Ro‘yxatdan o‘tish"}
        </button>
      </form>
    </div>
  );
};

export default Register;
