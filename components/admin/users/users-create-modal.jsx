import { useState } from "react";
import { Modal, Button, TextInput, Label, Select } from "flowbite-react";
import { toast } from "sonner";
import axios from "axios";

export default function CreateUserModal({ open, setOpen, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    nikNumber: "",
    contactNumber: "",
    email: "",
    password: "",
    role: "PELAPOR",
  });
  const [nikError, setNikError] = useState("");

  const handleSubmit = async () => {
    if (form.nikNumber.length !== 16) {
      setNikError("NIK harus tepat 16 digit.");
      return;
    }

    try {
      await axios.post("/api/users", form);
      toast.success("User berhasil ditambahkan!");
      setForm({
        name: "",
        nikNumber: "",
        contactNumber: "",
        email: "",
        password: "",
        role: "PELAPOR",
      });
      setNikError("");
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menambahkan user.");
    }
  };

  const handleNIKChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 16) {
      setForm({ ...form, nikNumber: value });
      if (value.length === 16) {
        setNikError("");
      } else {
        setNikError("NIK harus tepat 16 digit.");
      }
    }
  };

  return (
    <Modal show={open} onClose={() => setOpen(false)} size="lg">
      <Modal.Header>Tambah User Baru</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" value="Nama Lengkap" />
            <TextInput
              id="name"
              placeholder="Nama Lengkap"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="nikNumber" value="NIK (16 Digit)" />
            <TextInput
              id="nikNumber"
              placeholder="1234567890123456"
              value={form.nikNumber}
              onChange={handleNIKChange}
              maxLength={16}
              inputMode="numeric"
              pattern="\d*"
              color={nikError ? "failure" : "gray"}
              helperText={
                nikError && <span className="text-red-500">{nikError}</span>
              }
            />
          </div>
          <div>
            <Label htmlFor="contactNumber" value="No. Kontak" />
            <TextInput
              id="contactNumber"
              placeholder="08123456789"
              value={form.contactNumber}
              onChange={(e) =>
                setForm({ ...form, contactNumber: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="email" value="Email" />
            <TextInput
              id="email"
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="role" value="Role" />
            <Select
              id="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="PELAPOR">Pelapor</option>
              <option value="ADMIN">Admin</option>
              <option value="BUPATI">Bupati</option>
            </Select>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="blue" onClick={handleSubmit}>
          Simpan
        </Button>
        <Button color="gray" onClick={() => setOpen(false)}>
          Batal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
