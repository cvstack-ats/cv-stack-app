import React, { useState } from "react";
import HomePage from "./pages/HomePage";
import DataCollectionPage from "./pages/DataCollectionPage";
import TemplateSelectionPage from "./pages/TemplateSelectionPage";
import PackageSelectionPage from "./pages/PackageSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import AtsCheckerPage from "./pages/AtsCheckerPage";
import CircleLoginPage from "./pages/CircleLoginPage";
import CircleDashboardPage from "./pages/CircleDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_ANON_KEY
import TopRightLogo from "./components/common/TopRightLogo";
import { supabase } from "./lib/supabase";

export default function App() {
  const [screen, setScreen] = useState("home");

  const [cvForm, setCvForm] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [referralCode, setReferralCode] = useState("");
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [referralMessage, setReferralMessage] = useState("");

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [jobNumber, setJobNumber] = useState("");

  const [loggedMember, setLoggedMember] = useState(null);

  function goTo(nextScreen) {
    setScreen(nextScreen);
  }

  function updateCvForm(fieldKey, value) {
    setCvForm((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }

  function resetFlow() {
    setCvForm({});
    setSelectedTemplate(null);
    setSelectedPackage(null);
    setReferralCode("");
    setReferralDiscount(0);
    setReferralMessage("");
    setJobNumber("");
    setScreen("home");
  }

  async function handlePackageNext() {
    if (!selectedPackage) {
      alert("Please select a package.");
      return;
    }

    if (!referralCode.trim()) {
      setReferralDiscount(0);
      setReferralMessage("");
      goTo("payment");
      return;
    }

    const { data, error } = await supabase
      .from("circle_members")
      .select("*")
      .eq("referral_code", referralCode.trim())
      .maybeSingle();

    if (error) {
      alert("Failed to verify referral code.");
      return;
    }

    if (!data) {
      setReferralDiscount(0);
      setReferralMessage("Check referral code");
      alert("Check referral code");
      return;
    }

    setReferralDiscount(0);
    setReferralMessage("Referral code applied");
    goTo("payment");
  }
  <TopRightLogo onClickHome={() => goTo("home")} />

  async function handleSaveOrder() {
    try {
      setPaymentLoading(true);

      const newJobNumber = "CV" + Math.floor(100000 + Math.random() * 900000);

      const deliveryDays = Number(selectedPackage?.delivery_days || 3);
      const dueDateObj = new Date();
      dueDateObj.setDate(dueDateObj.getDate() + deliveryDays);
      const dueDate = dueDateObj.toISOString().split("T")[0];

      const finalAmount = Math.max(
        Number(selectedPackage?.price || 0) - Number(referralDiscount || 0),
        0
      );

      const sanitizedFormData = {};
      const pendingFiles = [];

      Object.entries(cvForm).forEach(([key, value]) => {
        if (value instanceof File) {
          pendingFiles.push({ key, file: value });
          sanitizedFormData[key] = value.name;
        } else {
          sanitizedFormData[key] = value;
        }
      });

      const { data: insertedOrder, error } = await supabase
        .from("orders")
        .insert([
          {
            customer_name: cvForm.fullName || "",
            email: cvForm.email || "",
            phone: cvForm.phone || "",
            location: cvForm.location || "",
            job_number: newJobNumber,

            template_name: selectedTemplate?.name || "",
            package_name: selectedPackage?.name || "",
            package_price: selectedPackage?.price || 0,

            referral_code: referralCode || null,
            referral_discount: referralDiscount || 0,
            final_amount: finalAmount,

            delivery_days: deliveryDays,
            due_date: dueDate,

            payment_status: "Pending",
            status: "Received",
            form_data: sanitizedFormData,
          },
        ])
        .select()
        .single();

      if (error) {
        alert("Error saving order: " + error.message);
        return;
      }

      if (pendingFiles.length > 0 && insertedOrder?.id) {
        for (const item of pendingFiles) {
          const fileName = `${insertedOrder.id}-${Date.now()}-${item.file.name}`;

          const { error: uploadError } = await supabase.storage
            .from("order-files")
            .upload(fileName, item.file);

          if (uploadError) {
            console.error(uploadError);
            continue;
          }

          const { data: publicUrlData } = supabase.storage
            .from("order-files")
            .getPublicUrl(fileName);

          await supabase.from("order_files").insert([
            {
              order_id: insertedOrder.id,
              file_name: item.file.name,
              file_url: publicUrlData.publicUrl,
            },
          ]);
        }
      }

      await supabase.from("notifications").insert([
        {
          type: "order",
          title: "New CV Order",
          message: `New order received from ${cvForm.fullName || "Customer"} - ${newJobNumber}`,
          is_read: false,
          related_id: insertedOrder?.id ? String(insertedOrder.id) : null,
        },
      ]);

      const message = `Hello CV STACK,

New Order Confirmed ✅

Reference Number: ${newJobNumber}
Customer Name: ${cvForm.fullName || "Customer"}
Package: ${selectedPackage?.name || "-"}
Amount: ₹${finalAmount}

Please proceed with my CV.`;

      window.open(
        `https://wa.me/918136806685?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      setJobNumber(newJobNumber);
      goTo("confirmation");
    } catch (err) {
      console.error(err);
      alert("Unexpected error");
    } finally {
      setPaymentLoading(false);
    }
  }

  return (
    <>
      {screen === "home" && (
        <HomePage
          onCreateCv={() => goTo("data")}
          onCheckAts={() => goTo("ats")}
          onCircleLogin={() => goTo("circle-login")}
        />
      )}

      {screen === "data" && (
        <DataCollectionPage
          formData={cvForm}
          onBack={() => goTo("home")}
          onChange={updateCvForm}
          onNext={() => goTo("templates")}
        />
      )}

      {screen === "templates" && (
        <TemplateSelectionPage
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onBack={() => goTo("data")}
          onNext={() => {
            if (!selectedTemplate) {
              alert("Please select a template.");
              return;
            }
            goTo("packages");
          }}
        />
      )}

      {screen === "packages" && (
        <PackageSelectionPage
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
          referralCode={referralCode}
          referralMessage={referralMessage}
          onReferralCodeChange={setReferralCode}
          onBack={() => goTo("templates")}
          onNext={handlePackageNext}
        />
      )}

      {screen === "payment" && (
        <PaymentPage
          selectedTemplate={selectedTemplate}
          selectedPackage={selectedPackage}
          referralDiscount={referralDiscount}
          paymentLoading={paymentLoading}
          onBack={() => goTo("packages")}
          onPayNow={handleSaveOrder}
        />
      )}

      {screen === "confirmation" && (
        <ConfirmationPage
          jobNumber={jobNumber}
          customerName={cvForm.fullName}
          selectedPackage={selectedPackage}
          totalAmount={Math.max(
            Number(selectedPackage?.price || 0) - Number(referralDiscount || 0),
            0
          )}
          onBackHome={resetFlow}
        />
      )}

      {screen === "ats" && <AtsCheckerPage onBack={() => goTo("home")} />}

      {screen === "circle-login" && (
        <CircleLoginPage
          onBack={() => goTo("home")}
          onLoginSuccess={(member) => {
            setLoggedMember(member);
            goTo("circle-dashboard");
          }}
          onAdminLogin={() => goTo("admin-login")}
        />
      )}

      {screen === "circle-dashboard" && (
        <CircleDashboardPage
          member={loggedMember}
          onLogout={() => {
            setLoggedMember(null);
            goTo("home");
          }}
        />
      )}

      {screen === "admin-login" && (
        <AdminLoginPage
          onBack={() => goTo("circle-login")}
          onLoginSuccess={() => goTo("admin-dashboard")}
        />
      )}

      {screen === "admin-dashboard" && (
        <AdminDashboardPage onLogout={() => goTo("home")} />
      )}
    </>
  );
}

