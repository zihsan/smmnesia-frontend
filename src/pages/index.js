import { useState, useEffect } from "react";
import Alert from "@/components/Alert";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Layout from "@/layout/Layout";
import { LuArrowRight, LuClipboardPaste, LuHouse, LuInfo, LuPhoneCall, LuShoppingCart } from "react-icons/lu";
import Breadcrumbs from "@/components/Breadcrumbs";
import Modal from "@/components/Modal";
import Loading from "@/components/Loading";

export default function Home({ phoneNumber, paymentMethods, layananData }) {

  const formatRupiah = angka =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);

  const initialFormState = {
    selectedService: '',
    selectedSubService: '',
    target: '',
    harga: '',
    selectedPayment: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const { selectedService, selectedSubService, target, harga, selectedPayment } = formData;

  const isFormValid = selectedService && selectedSubService && target.trim();

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleServiceChange = ({ target: { value } }) => {
    updateFormData({
      selectedService: value,
      selectedSubService: '',
      harga: '',
      keterangan: ''
    });
  };

  const handleSubServiceChange = ({ target: { value } }) => {
    const service = layananData[selectedService]?.find(s => s.name === value);
    if (service) {
      updateFormData({
        selectedSubService: value,
        harga: service.harga,
        keterangan: service.keterangan
      });
    }
  };

  const handleTargetChange = ({ target: { value } }) => {
    updateFormData({ target: value });
  };

  const handleSelectChange = ({ target: { value } }) => {
    updateFormData({ selectedPayment: value });
  };

  const openModal = modalId => document.getElementById(modalId)?.showModal();

  useEffect(() => {
    console.log({ formData, layananData });
  }, [formData, layananData]);

  const serviceOptions = Object.keys(layananData || {})
    .filter(key => Array.isArray(layananData[key]) && layananData[key].length);

  const subServiceOptions = selectedService && Array.isArray(layananData[selectedService])
    ? layananData[selectedService].map(({ name, harga, keterangan }) => ({
      label: name,
      value: name,
      harga,
      keterangan
    }))
    : [];

  const getBaseURL = () =>
    process.env.NODE_ENV === "production"
      ? "https://laravel-smmnesia.vercel.app/api/api"
      : "http://localhost:8000/api";

  const generateRandomId = (length = 15) => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const allChars = upper + lower + numbers;

    if (length < 3) throw new Error('Minimal 3 karakter.');

    const randomChar = str => str[Math.floor(Math.random() * str.length)];

    const result = [
      randomChar(upper),
      randomChar(lower),
      randomChar(numbers),
      ...Array.from({ length: length - 3 }, () => randomChar(allChars))
    ];

    return result.sort(() => Math.random() - 0.5).join('');
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitOrder = async () => {
    if (!selectedPayment || isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      oid: generateRandomId(),
      kategori: selectedService,
      layanan: selectedSubService,
      target,
      harga,
      method: selectedPayment,
      pembayaran: selectedPayment,
      status: 'Pending',
      status_pay: 'unpaid'
    };

    console.log('💾 Sending order payload:', payload);

    try {
      const res = await fetch(`${getBaseURL()}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const orderData = await res.json();
      console.log('📦 Store Order Response:', orderData);

      if (!res.ok) {
        console.error('❌ Store Order Error:', orderData);
        alert(`Gagal: ${orderData.message || 'Terjadi kesalahan saat menyimpan order'}`);
        return;
      }

      const order = orderData.order;

      const qrRes = await fetch(`${getBaseURL()}/generate-qr/${order.oid}`);
      const qrData = await qrRes.json();
      console.log('🔲 QR Generation Response:', qrData);

      if (!qrData.success) {
        console.error('❌ QR Generation Error:', qrData);
        alert(`QR Gagal: ${qrData.message || 'Tidak bisa generate QR Code'}`);
        return;
      }

      const finalData = {
        order,
        qr: qrData.qr
      };

      console.log('✅ Final Order Data:', finalData);
      localStorage.setItem('currentOrder', JSON.stringify(finalData));

      window.location.href = '/order';

    } catch (err) {
      console.error('❌ Submit error:', err);
      alert('Gagal menghubungi server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = () => {
    if (!navigator.clipboard) {
      alert('Clipboard API tidak didukung di browser ini');
      return;
    }

    navigator.clipboard.readText()
      .then((text) => {
        updateFormData({ target: text });
      })
      .catch((err) => {
        console.error('Gagal mengambil teks dari clipboard:', err);
      });
  };

  return (
    <Layout>
      <Modal id="pg" title="METODE PEMBAYARAN" className="bg-[#DDEBFF]">
        <Select
          className="bg-[#5395FF]"
          label="Pilih Metode Pembayaran"
          placeholder="Pilih Metode Pembayaran"
          value={selectedPayment}
          onChange={handleSelectChange}
          options={paymentMethods}
        />
        <div className="flex justify-end items-end mt-4">
          <Button
            bgColor="#5395FF"
            hoverColor="#DDEBFF"
            disabled={!selectedPayment || isSubmitting}
            onClick={submitOrder}
            className="flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loading className="loading-spinner loading-xs" />
            ) : (
              <>
                <LuShoppingCart className="mr-1" />
                BELI SEKARANG
              </>
            )}
          </Button>

        </div>
      </Modal>
      <Breadcrumbs
        items={[
          {
            href: "/",
            icon: <LuHouse />,
            label: "Home",
          },
        ]}
        className="my-4 sm:mt-8 mb-6 bg-[#5395FF]"
      />
      <div className="space-y-5">
        <Select
          className="bg-[#5395FF]"
          label="Pilih Layanan"
          placeholder="Pilih Layanan"
          value={selectedService}
          onChange={handleServiceChange}
          options={serviceOptions}
        />

        {selectedService && (
          <Select
            className="bg-[#5395FF]"
            label="Pilih Yang Akan Anda Beli"
            placeholder="Pilih Yang Akan Anda Beli"
            value={selectedSubService}
            onChange={handleSubServiceChange}
            options={subServiceOptions.map(opt => opt.label)}
          />
        )}
        <Alert
          icon={<LuInfo />}
          message="Jika tidak paham melakukan pemesanan lewat web ini. Silakan pilih Layanan dan yang akan dibeli di atas. Lalu screenshot ke admin melalui WhatsApp di bawah ini. / jika ingin Request layanan."
          bgColor="#5395FF"
        />

        <div className="flex justify-end items-end">
          <a
            href={`https://api.whatsapp.com/send/?phone=${phoneNumber}&text&type=phone_number&app_absent=0`} target="_blank" rel="noopener noreferrer"
          >
            <Button bgColor="#5395FF" hoverColor="#DDEBFF">
              <LuPhoneCall className="mr-1" />HUBUNGI ADMIN
            </Button>
          </a>
        </div>
        {selectedSubService && formData.keterangan && (
          <div className="p-3 w-full bg-[#5395FF] border-2 border-black rounded-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] my-6">
            <div className="border-2 rounded-md p-4 bg-[#DDEBFF] text-sm space-y-2">
              <div
                className="text-xs break-words whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: formData.keterangan
                }}
              />
            </div>
          </div>
        )}
        {selectedSubService && (
          <Input
            className="bg-[#5395FF]"
            label="Harga"
            type="text"
            placeholder="Harga"
            value={harga ? formatRupiah(harga) : ''}
            readOnly
          />
        )}
        <div className="join w-full ">
          <Input fieldsetClassName="w-full"
            className="bg-[#5395FF] join-item"
            label="Target"
            type="text"
            placeholder="Masukan Username/Link"
            value={target}
            onChange={handleTargetChange}
          />
          <Button
            className="join-item mt-7.5 !rounded-r-none"
            bgColor="#5395FF"
            hoverColor="#DDEBFF"
            onClick={handlePaste}
          >
            <LuClipboardPaste className="mr-1" />PASTE
          </Button>
        </div>
        <Button className="w-full !rounded-l-none" bgColor="#5395FF" disabled={!isFormValid} hoverColor="#DDEBFF" onClick={() => openModal('pg')}>
          <LuArrowRight className="mr-1" />LANJUTKAN
        </Button>

      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const baseURL = process.env.NODE_ENV === "production"
    ? "https://laravel-smmnesia.vercel.app/api/api"
    : "http://localhost:8000/api";

  try {
    const [phoneRes, paymentRes, layananRes] = await Promise.all([
      fetch(`${baseURL}/get-phone-number`),
      fetch(`${baseURL}/get-payment-methods`),
      fetch(`${baseURL}/get-layanan`)
    ]);

    const phoneData = await phoneRes.json();
    const paymentData = await paymentRes.json();
    const layananData = await layananRes.json();

    return {
      props: {
        phoneNumber: phoneData.phone_number || '',
        paymentMethods: paymentData.success ? paymentData.methods : [],
        layananData: layananData.success ? layananData.data : {}
      }
    };
  } catch (error) {
    console.error('SSR Error:', error);
    return {
      props: {
        phoneNumber: '',
        paymentMethods: [],
        layananData: {}
      }
    };
  }
}