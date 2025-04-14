/* eslint-disable react-hooks/exhaustive-deps */
import Breadcrumbs from "@/components/Breadcrumbs";
import Button from "@/components/Button";
import Input from "@/components/Input";
import LayoutDashboard from "@/layout/LayoutDashboard";
import { LuDelete, LuFileText, LuLayoutDashboard, LuPen, LuPlus } from "react-icons/lu";
import { FaRupiahSign } from "react-icons/fa6";
import { useState, useEffect } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import InputIcon from "@/components/InputIcon";
import Toast from "@/components/Toast";
import { withAuth } from "@/contexts/AuthContext";
import Loading from "@/components/Loading";

const Layanan = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    cat_code: "",
    layanan: "",
    keterangan: "",
    harga: "",
    status: ""
  });
  const [currentItemId, setCurrentItemId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [searchKategori, setSearchKategori] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const itemsPerPage = 20;
  const token = localStorage.getItem("token");

  const getBaseURL = () =>
    process.env.NODE_ENV === "production"
      ? "https://laravel-smmnesia.vercel.app/api/api"
      : "http://localhost:8000/api";

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const fetchLayanan = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${getBaseURL()}/layanan`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        showToast("Gagal mengambil data layanan");
      }
    } catch (error) {
      console.error("Error fetching layanan:", error);
      showToast("Gagal mengambil data layanan");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${getBaseURL()}/kategori`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setCategories(result.data);
      } else {
        showToast("Gagal mengambil data kategori");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showToast("Gagal mengambil data kategori");
    }
  };

  useEffect(() => {
    fetchLayanan();
    fetchCategories();
  }, []);

  const filteredData = data.filter((item) =>
    item.kategori.toLowerCase().includes(searchKategori.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const openModal = (modalId, item = null) => {
    if (item) {
      setFormData({
        cat_code: item.kategori,
        layanan: item.name,
        keterangan: item.keterangan,
        harga: item.harga,
        status: item.status
      });
      setCurrentItemId(item.id);
    } else {
      setFormData({
        cat_code: "",
        layanan: "",
        keterangan: "",
        harga: "",
        status: ""
      });
      setCurrentItemId(null);
    }
    document.getElementById(modalId)?.showModal();
  };

  const closeModal = (modalId) => {
    document.getElementById(modalId)?.close();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const handleCreate = async () => {
    setLoadingCreate(true);
    try {
      const response = await fetch(`${getBaseURL()}/layanan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Create failed:", result);
        showToast(result.message || "Gagal menambahkan data");
        return;
      }

      fetchLayanan();
      closeModal("create");
      showToast("Data berhasil ditambahkan");
    } catch (error) {
      console.error("Error saat membuat data:", error);
      showToast("Gagal menambahkan data");
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleUpdate = async () => {
    setLoadingUpdate(true);
    try {
      const response = await fetch(`${getBaseURL()}/layanan/${currentItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Update failed:", result);
        showToast(result.message || "Gagal memperbarui data");
        return;
      }

      fetchLayanan();
      closeModal("update");
      showToast("Data berhasil diperbarui");
    } catch (error) {
      console.error("Error saat memperbarui data:", error);
      showToast("Gagal memperbarui data");
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDelete = async () => {
    if (!currentItemId) {
      showToast("ID tidak valid");
      closeModal("delete");
      return;
    }

    setLoadingDelete(true);
    try {
      const response = await fetch(`${getBaseURL()}/layanan/${currentItemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Delete failed:", result);
        showToast(result.message || "Gagal menghapus data");
        return;
      }

      fetchLayanan();
      closeModal("delete");
      showToast("Data berhasil dihapus");
    } catch (error) {
      console.error("Error saat menghapus data:", error);
      showToast("Gagal menghapus data");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <LayoutDashboard>
        <Modal id="create" title="CREATE" className="bg-[#DDEBFF]">
          <div className="space-y-5 mb-4">
            <Select
              className="bg-[#5395FF]"
              label="Kategori"
              placeholder="Pilih Kategori"
              options={categories.map(cat => ({ value: cat.code, label: cat.code }))}
              name="cat_code"
              value={formData.cat_code}
              onChange={handleInputChange}
            />
            <Input
              className="bg-[#5395FF]"
              label="Layanan"
              type="text"
              placeholder="Pilih Layanan"
              name="layanan"
              value={formData.layanan}
              onChange={handleInputChange}
            />
            <Textarea
              label="Keterangan"
              className="bg-[#5395FF]"
              placeholder="Keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleInputChange}
            />
            <InputIcon
              label="Harga"
              icon={FaRupiahSign}
              type="text"
              placeholder="Harga"
              className="bg-[#5395FF]"
              name="harga"
              value={formData.harga}
              onChange={handleInputChange}
            />
            <Select
              className="bg-[#5395FF]"
              label="Status"
              placeholder="Pilih Status"
              options={['AKTIF', 'NON AKTIF']}
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end items-end">
            <Button
              bgColor="#5395FF"
              hoverColor="#DDEBFF"
              onClick={handleCreate}
              disabled={loadingCreate}
            >
              {loadingCreate ? (
                <Loading className="loading-spinner loading-xs" />
              ) : (
                "SUBMIT"
              )}
            </Button>
          </div>
        </Modal>
        <Modal id="update" title="UPDATE" className="bg-[#DDEBFF]">
          <div className="space-y-5 mb-4">
            <Select
              className="bg-[#5395FF]"
              label="Kategori"
              placeholder="Pilih Kategori"
              options={categories.map(cat => ({ value: cat.code, label: cat.code }))}
              name="cat_code"
              value={formData.cat_code}
              onChange={handleInputChange}
            />
            <Input
              className="bg-[#5395FF]"
              label="Layanan"
              type="text"
              placeholder="Pilih Layanan"
              name="layanan"
              value={formData.layanan}
              onChange={handleInputChange}
            />
            <Textarea
              label="Keterangan"
              className="bg-[#5395FF]"
              placeholder="Keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleInputChange}
            />
            <InputIcon
              label="Harga"
              icon={FaRupiahSign}
              type="text"
              placeholder="Harga"
              className="bg-[#5395FF]"
              name="harga"
              value={formData.harga}
              onChange={handleInputChange}
            />
            <Select
              className="bg-[#5395FF]"
              label="Status"
              placeholder="Pilih Status"
              options={['AKTIF', 'NON AKTIF']}
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end items-end">
            <Button
              bgColor="#5395FF"
              hoverColor="#DDEBFF"
              onClick={handleUpdate}
              disabled={loadingUpdate}
            >
              {loadingUpdate ? (
                <Loading className="loading-spinner loading-xs" />
              ) : (
                "SUBMIT"
              )}
            </Button>
          </div>
        </Modal>
        <Modal id="delete" title="DELETE" className="bg-[#DDEBFF]">
          <p className="text-sm mb-4">Apakah kamu yakin ingin menghapus data ini?</p>
          <div className="flex justify-end items-end">
            <Button
              bgColor="#5395FF"
              hoverColor="#DDEBFF"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? (
                <Loading className="loading-spinner loading-xs" />
              ) : (
                "SUBMIT"
              )}
            </Button>
          </div>
        </Modal>
        <Breadcrumbs
          items={[
            {
              href: "/admin/dashboard",
              icon: <LuLayoutDashboard />,
              label: "Dashboard",
            },
            {
              href: "/admin/layanan",
              icon: <LuFileText />,
              label: "Layanan",
            },
          ]}
          className="bg-[#5395FF]"
        />
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input
            className="bg-[#5395FF] w-full"
            type="text"
            placeholder="Masukan Kategori"
            value={searchKategori}
            onChange={(e) => {
              setSearchKategori(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button onClick={() => openModal('create')}
            bgColor="#5395FF"
            hoverColor="#DDEBFF"
            className="btn-square mt-3.5"
          >
            <LuPlus />
          </Button>
        </div>
        <Table className="px-4 py-2 bg-[#5395FF] mt-3.5 mb-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>KATEGORI</th>
              <th>LAYANAN</th>
              <th>HARGA</th>
              <th>STATUS</th>
              <th>AKSI</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  <Loading className="loading-spinner loading-xs" />
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id} className="hover:bg-base-300 !truncate">
                  <td>{`#${item.id}`}</td>
                  <td>{item.kategori}</td>
                  <td>{item.name}</td>
                  <td>{item.harga}</td>
                  <td className="uppercase">{item.status}</td>
                  <td>
                    <div className="join">
                      <button
                        onClick={() => openModal('update', item)}
                        className="btn btn-xs btn-square join-item border-2 border-black bg-[#DDEBFF] text-black"
                      >
                        <LuPen />
                      </button>
                      <button
                        onClick={() => openModal('delete', item)}
                        className="btn btn-xs btn-square join-item border-2 border-black bg-[#DDEBFF] text-black"
                      >
                        <LuDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-xs ">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="flex justify-center mt-6">
          <Pagination
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
        <Toast
          toastClassName="toast-bottom toast-end"
          alertClassName="bg-base-200"
          isVisible={toastVisible}
        >
          {toastMessage}
        </Toast>
      </LayoutDashboard>
    </>
  );
};

export default withAuth(Layanan);