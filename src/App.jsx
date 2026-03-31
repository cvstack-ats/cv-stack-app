import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "cvstack_pro_app_v6";

const uid = () => Math.random().toString(36).slice(2, 10);
const currency = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const today = () => new Date().toISOString().slice(0, 10);
const whatsappUrl = (message, number = "") =>
  `https://wa.me/${String(number || "").replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

const defaultData = {
  site: {
    logoText: "CV STACK",
    logoImage: "",
    logoSize: 48,
    headerTitle: "CV STACK",
    headerSubtitle: "Professional CV Creation Service",
    headerTitleSize: 22,
    headerSubtitleSize: 13,
    heroTitle: "Build a Professional CV With Confidence",
    heroSubtitle:
      "Submit your details, preview your template, choose a package, and continue to WhatsApp for payment.",
    supportWhatsapp: "+971500000000",
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    paymentNote:
      "After submitting, you will be redirected to WhatsApp with your job ID and payment amount.",
    circleBannerTitle: "CV STACK Circle",
    circleBannerText:
      "Track your successful referrals, claimed amount, pending amount, and latest news in one place.",
  },

  formFields: [
    {
      id: uid(),
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "Enter your full name",
      options: [],
    },
    {
      id: uid(),
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "Enter your email",
      options: [],
    },
    {
      id: uid(),
      label: "Phone Number",
      type: "text",
      required: true,
      placeholder: "Enter your phone number",
      options: [],
    },
    {
      id: uid(),
      label: "Current Location",
      type: "text",
      required: true,
      placeholder: "City / Country",
      options: [],
    },
    {
      id: uid(),
      label: "Target Job Role",
      type: "text",
      required: true,
      placeholder: "Example: Guest Service Agent",
      options: [],
    },
    {
      id: uid(),
      label: "Professional Summary",
      type: "textarea",
      required: true,
      placeholder: "Brief summary about your experience",
      options: [],
    },
    {
      id: uid(),
      label: "Years of Experience",
      type: "number",
      required: true,
      placeholder: "Example: 3",
      options: [],
    },
    {
      id: uid(),
      label: "Highest Qualification",
      type: "select",
      required: true,
      placeholder: "",
      options: ["High School", "Diploma", "Bachelor's", "Master's", "Other"],
    },
    {
      id: uid(),
      label: "Upload Documents / Picture",
      type: "file",
      required: false,
      placeholder: "",
      options: [],
    },
  ],

  templates: [
    {
      id: uid(),
      name: "Executive Blue",
      image: "",
      imageName: "",
      description: "Clean executive layout with premium spacing.",
      active: true,
    },
    {
      id: uid(),
      name: "Modern Minimal",
      image: "",
      imageName: "",
      description: "Simple ATS-friendly structure with modern style.",
      active: true,
    },
  ],

  packages: [
    { id: uid(), name: "ATS CV", price: 499, description: "ATS-focused CV", active: true },
    {
      id: uid(),
      name: "CV + Cover Letter",
      price: 799,
      description: "Professional CV with cover letter",
      active: true,
    },
    {
      id: uid(),
      name: "LinkedIn Optimization",
      price: 999,
      description: "Optimize LinkedIn profile",
      active: true,
    },
    {
      id: uid(),
      name: "Fastrack CV",
      price: 999,
      description: "Priority CV delivery",
      active: true,
    },
    {
      id: uid(),
      name: "CV + Cover Letter + LinkedIn Optimization",
      price: 1999,
      description: "Complete branding package",
      active: true,
    },
  ],

  submissions: [],

  circleMembers: [
    {
      id: uid(),
      memberName: "Demo Circle Member",
      referralId: "CIRCLE1001",
      password: "1234",
      phone: "",
      notes: "",
      latestNewsSeen: "",
      active: true,
      referrals: [
        {
          id: uid(),
          referredName: "Aisha Khan",
          orderId: "JOB-10001",
          amount: 100,
          status: "successful",
          paid: false,
          createdAt: today(),
        },
      ],
    },
  ],

  news: [
    {
      id: uid(),
      title: "Welcome to CV STACK Circle",
      content:
        "Referral rewards are processed after successful service delivery. Keep sharing your referral ID.",
      createdAt: today(),
    },
  ],

  adminUsers: [
    {
      id: uid(),
      name: "Super Admin",
      username: "admin",
      password: "1234",
      role: "super_admin",
      active: true,
      permissions: {
        submissions: true,
        branding: true,
        home: true,
        formBuilder: true,
        templates: true,
        packages: true,
        circle: true,
        news: true,
        staff: true,
        sales: true,
        backup: true,
      },
    },
  ],
};

function App() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultData;
      const parsed = JSON.parse(raw);
      if (!parsed.adminUsers || !Array.isArray(parsed.adminUsers) || parsed.adminUsers.length === 0) {
        return defaultData;
      }
      return parsed;
    } catch (error) {
      console.error("Failed to load app data:", error);
      return defaultData;
    }
  });

  const [screen, setScreen] = useState("home");
  const [customerStep, setCustomerStep] = useState(0);
  const [customerForm, setCustomerForm] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [joinCircle, setJoinCircle] = useState(false);
  const [customerReferralId, setCustomerReferralId] = useState("");
  const [customerNotice, setCustomerNotice] = useState("");
  const [submittedOrderId, setSubmittedOrderId] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const [circleLogin, setCircleLogin] = useState({ referralId: "", password: "" });
  const [circleSession, setCircleSession] = useState(null);
  const [circleError, setCircleError] = useState("");

  const [adminLogin, setAdminLogin] = useState({ username: "", password: "" });
  const [adminSession, setAdminSession] = useState(null);
  const [adminError, setAdminError] = useState("");
  const [adminTab, setAdminTab] = useState("submissions");

  const [circleDrafts, setCircleDrafts] = useState({});
  const [staffDrafts, setStaffDrafts] = useState({});
  const [templateDrafts, setTemplateDrafts] = useState({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const activeTemplates = data.templates.filter((t) => t.active);
  const activePackages = data.packages.filter((p) => p.active);

  const selectedPackageData = activePackages.find((p) => p.id === selectedPackage);
  const selectedTemplateData = activeTemplates.find((t) => t.id === selectedTemplate);

  const salesSummary = useMemo(() => {
    const totalOrders = data.submissions.length;
    const paidOrders = data.submissions.filter((s) => s.paymentStatus === "paid").length;
    const totalRevenue = data.submissions
      .filter((s) => s.paymentStatus === "paid")
      .reduce((sum, s) => sum + Number(s.packagePrice || 0), 0);

    const circleRewards = data.circleMembers.reduce((sum, m) => {
      return sum + m.referrals.reduce((a, r) => a + Number(r.amount || 0), 0);
    }, 0);

    return { totalOrders, paidOrders, totalRevenue, circleRewards };
  }, [data]);

  const currentCircleMember = circleSession
    ? data.circleMembers.find((m) => m.id === circleSession.id) || circleSession
    : null;

  const circleStats = currentCircleMember
    ? {
        successfulCount: currentCircleMember.referrals.filter((r) => r.status === "successful").length,
        eligibleAmount: currentCircleMember.referrals.reduce((sum, r) => sum + Number(r.amount || 0), 0),
        paidAmount: currentCircleMember.referrals
          .filter((r) => r.paid)
          .reduce((sum, r) => sum + Number(r.amount || 0), 0),
      }
    : { successfulCount: 0, eligibleAmount: 0, paidAmount: 0 };

  circleStats.yetToPayAmount = circleStats.eligibleAmount - circleStats.paidAmount;

  const adminTabs = [
    { key: "submissions", label: "Customer Results", permission: "submissions" },
    { key: "branding", label: "Branding", permission: "branding" },
    { key: "home", label: "Main Screen", permission: "home" },
    { key: "formBuilder", label: "About Me Form", permission: "formBuilder" },
    { key: "templates", label: "Templates", permission: "templates" },
    { key: "packages", label: "Packages", permission: "packages" },
    { key: "circle", label: "Circle Members", permission: "circle" },
    { key: "news", label: "Latest News", permission: "news" },
    { key: "staff", label: "Staff Access", permission: "staff" },
    { key: "sales", label: "Sales Track", permission: "sales" },
    { key: "backup", label: "Backup / Print", permission: "backup" },
  ];

  const resetCustomerFlow = () => {
    setCustomerStep(0);
    setCustomerForm({});
    setSelectedTemplate("");
    setSelectedPackage("");
    setJoinCircle(false);
    setCustomerReferralId("");
    setCustomerNotice("");
    setSubmittedOrderId("");
    setPreviewTemplate(null);
    setScreen("home");
  };

  const resetAppData = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const validateFormStep = () => {
    for (const field of data.formFields) {
      if (!field.required) continue;
      const value = customerForm[field.id];
      if (field.type === "file") {
        if (!value || value.length === 0) return false;
      } else if (!String(value || "").trim()) {
        return false;
      }
    }
    return true;
  };

  const canGoNext = () => {
    if (customerStep === 0) return true;
    if (customerStep === 1) return validateFormStep();
    if (customerStep === 2) return !!selectedTemplate;
    if (customerStep === 3) return !!selectedPackage;
    return false;
  };

  const hasPermission = (key) => adminSession?.permissions?.[key] || adminSession?.role === "super_admin";

  const handleFileField = (fieldId, files) => {
    const fileObjects = Array.from(files || []).map((f) => ({
      name: f.name,
      type: f.type,
      size: f.size,
      url: URL.createObjectURL(f),
    }));
    setCustomerForm((prev) => ({ ...prev, [fieldId]: fileObjects }));
  };

  const generateOrderId = () => {
    const nextNumber = 10001 + data.submissions.length;
    return `JOB-${nextNumber}`;
  };

  const submitOrder = () => {
    const orderId = generateOrderId();

    const customerName =
      customerForm[data.formFields[0]?.id] ||
      customerForm[data.formFields[1]?.id] ||
      "Customer";

    const newSubmission = {
      id: uid(),
      orderId,
      createdAt: new Date().toISOString(),
      customerData: customerForm,
      templateId: selectedTemplate,
      templateName: selectedTemplateData?.name || "",
      packageId: selectedPackage,
      packageName: selectedPackageData?.name || "",
      packagePrice: selectedPackageData?.price || 0,
      paymentStatus: "pending",
      referralIdUsed: customerReferralId.trim(),
      wantsCircleMembership: joinCircle,
      circleMembershipRequested: joinCircle ? "yes" : "no",
      status: "new",
      customerName,
    };

    const nextData = { ...data, submissions: [newSubmission, ...data.submissions] };

    if (customerReferralId.trim()) {
      const memberIndex = nextData.circleMembers.findIndex(
        (m) => m.referralId.toLowerCase() === customerReferralId.trim().toLowerCase()
      );

      if (memberIndex >= 0) {
        nextData.circleMembers[memberIndex].referrals.unshift({
          id: uid(),
          referredName: customerName,
          orderId,
          amount: 100,
          status: "successful",
          paid: false,
          createdAt: today(),
        });
      } else {
        setCustomerNotice("Referral ID not matched. Order submitted without referral benefit.");
      }
    }

    setData(nextData);
    setSubmittedOrderId(orderId);

    const whatsappMessage = `Hello CV STACK,

I want to proceed with payment.

Job ID: ${orderId}
Name: ${customerName}
Package: ${newSubmission.packageName}
Payment Amount: ${currency(newSubmission.packagePrice)}
Template: ${newSubmission.templateName}

Please share the payment instructions.`;

    window.open(whatsappUrl(whatsappMessage, data.site.supportWhatsapp), "_blank");
    setScreen("orderSuccess");
  };

  const handleCircleLogin = () => {
    const member = data.circleMembers.find(
      (m) =>
        m.referralId.toLowerCase() === circleLogin.referralId.trim().toLowerCase() &&
        m.password === circleLogin.password &&
        m.active
    );

    if (!member) {
      setCircleError("Invalid referral ID, password, or inactive account.");
      return;
    }

    setCircleSession(member);
    setCircleError("");
    setScreen("circleDashboard");
  };

  const handleAdminLogin = () => {
    const username = adminLogin.username.trim().toLowerCase();
    const password = adminLogin.password;

    const user = data.adminUsers.find(
      (u) =>
        String(u.username || "").trim().toLowerCase() === username &&
        String(u.password || "") === password &&
        u.active !== false
    );

    if (!user) {
      setAdminError("Invalid username, password, or inactive account.");
      return;
    }

    setAdminSession(user);
    setAdminError("");
    setAdminTab("submissions");
    setScreen("adminDashboard");
  };

  const updateSite = (key, value) =>
    setData((prev) => ({ ...prev, site: { ...prev.site, [key]: value } }));

  const addFormField = () => {
    setData((prev) => ({
      ...prev,
      formFields: [
        ...prev.formFields,
        {
          id: uid(),
          label: "New Field",
          type: "text",
          required: false,
          placeholder: "",
          options: [],
        },
      ],
    }));
  };

  const updateFormField = (id, patch) => {
    setData((prev) => ({
      ...prev,
      formFields: prev.formFields.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  };

  const deleteFormField = (id) => {
    setData((prev) => ({
      ...prev,
      formFields: prev.formFields.filter((f) => f.id !== id),
    }));
  };

  const addTemplate = () => {
    const newTemplate = {
      id: uid(),
      name: "New Template",
      image: "",
      imageName: "",
      description: "",
      active: true,
    };

    setTemplateDrafts((prev) => ({ ...prev, [newTemplate.id]: newTemplate }));
    setData((prev) => ({
      ...prev,
      templates: [...prev.templates, newTemplate],
    }));
  };

  const updateTemplateDraft = (id, patch) => {
    setTemplateDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || data.templates.find((t) => t.id === id) || {}),
        ...patch,
      },
    }));
  };

  const saveTemplate = (id) => {
    const draft = templateDrafts[id];
    if (!draft) return;

    setData((prev) => ({
      ...prev,
      templates: prev.templates.map((t) => (t.id === id ? { ...t, ...draft } : t)),
    }));
  };

  const deleteTemplate = (id) => {
    setData((prev) => ({
      ...prev,
      templates: prev.templates.filter((t) => t.id !== id),
    }));
  };

  const addPackage = () => {
    setData((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          id: uid(),
          name: "New Package",
          price: 0,
          description: "",
          active: true,
        },
      ],
    }));
  };

  const updatePackage = (id, patch) => {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  };

  const deletePackage = (id) => {
    setData((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== id),
    }));
  };

  const addCircleMember = () => {
    const newMember = {
      id: uid(),
      memberName: "New Member",
      referralId: `CIRCLE${1000 + data.circleMembers.length + 1}`,
      password: "1234",
      phone: "",
      notes: "",
      latestNewsSeen: "",
      active: true,
      referrals: [],
    };

    setCircleDrafts((prev) => ({ ...prev, [newMember.id]: newMember }));
    setData((prev) => ({
      ...prev,
      circleMembers: [newMember, ...prev.circleMembers],
    }));
  };

  const updateCircleDraft = (id, patch) => {
    setCircleDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || data.circleMembers.find((m) => m.id === id) || {}),
        ...patch,
      },
    }));
  };

  const saveCircleMember = (id) => {
    const draft = circleDrafts[id];
    if (!draft) return;

    setData((prev) => ({
      ...prev,
      circleMembers: prev.circleMembers.map((m) => (m.id === id ? { ...m, ...draft } : m)),
    }));
  };

  const deleteCircleMember = (id) => {
    setData((prev) => ({
      ...prev,
      circleMembers: prev.circleMembers.filter((m) => m.id !== id),
    }));
  };

  const toggleReferralPaid = (memberId, referralId) => {
    setData((prev) => ({
      ...prev,
      circleMembers: prev.circleMembers.map((m) =>
        m.id !== memberId
          ? m
          : {
              ...m,
              referrals: m.referrals.map((r) =>
                r.id === referralId ? { ...r, paid: !r.paid } : r
              ),
            }
      ),
    }));
  };

  const addNews = () => {
    setData((prev) => ({
      ...prev,
      news: [{ id: uid(), title: "New Update", content: "", createdAt: today() }, ...prev.news],
    }));
  };

  const updateNews = (id, patch) => {
    setData((prev) => ({
      ...prev,
      news: prev.news.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
  };

  const deleteNews = (id) => {
    setData((prev) => ({
      ...prev,
      news: prev.news.filter((n) => n.id !== id),
    }));
  };

  const addStaff = () => {
    const newStaff = {
      id: uid(),
      name: "New Staff",
      username: `staff${data.adminUsers.length + 1}`,
      password: "1234",
      role: "staff",
      active: true,
      permissions: {
        submissions: true,
        branding: false,
        home: false,
        formBuilder: false,
        templates: false,
        packages: false,
        circle: false,
        news: false,
        staff: false,
        sales: true,
        backup: false,
      },
    };

    setStaffDrafts((prev) => ({ ...prev, [newStaff.id]: newStaff }));
    setData((prev) => ({
      ...prev,
      adminUsers: [...prev.adminUsers, newStaff],
    }));
  };

  const updateStaffDraft = (id, patch) => {
    setStaffDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || data.adminUsers.find((u) => u.id === id) || {}),
        ...patch,
      },
    }));
  };

  const saveStaff = (id) => {
    const draft = staffDrafts[id];
    if (!draft) return;

    setData((prev) => ({
      ...prev,
      adminUsers: prev.adminUsers.map((u) => (u.id === id ? { ...u, ...draft } : u)),
    }));
  };

  const togglePermission = (userId, permissionKey) => {
    setData((prev) => ({
      ...prev,
      adminUsers: prev.adminUsers.map((u) =>
        u.id === userId
          ? {
              ...u,
              permissions: {
                ...u.permissions,
                [permissionKey]: !u.permissions[permissionKey],
              },
            }
          : u
      ),
    }));
  };

  const deleteAdminUser = (id) => {
    setData((prev) => ({
      ...prev,
      adminUsers: prev.adminUsers.filter((u) => u.id !== id),
    }));
  };

  const togglePaymentStatus = (submissionId) => {
    setData((prev) => ({
      ...prev,
      submissions: prev.submissions.map((s) =>
        s.id === submissionId
          ? { ...s, paymentStatus: s.paymentStatus === "paid" ? "pending" : "paid" }
          : s
      ),
    }));
  };

  const downloadJsonBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cvstack-backup-${today()}.json`;
    a.click();
  };

  const downloadSubmissionsCsv = () => {
    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Template",
      "Package",
      "Price",
      "Payment Status",
      "Referral ID Used",
    ];

    const rows = data.submissions.map((s) => [
      s.orderId,
      s.createdAt,
      s.customerName,
      s.templateName,
      s.packageName,
      s.packagePrice,
      s.paymentStatus,
      s.referralIdUsed,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `cvstack-submissions-${today()}.csv`;
    a.click();
  };

  const downloadTextPdf = (title, content) => {
    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body{font-family:Arial,sans-serif;padding:24px;color:#111;}
            h1{margin-bottom:16px;}
            pre{white-space:pre-wrap;line-height:1.6;font-size:14px;}
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <pre>${content}</pre>
          <script>window.print()</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const exportSalesPdf = () => {
    const content = `
Total Orders: ${salesSummary.totalOrders}
Paid Orders: ${salesSummary.paidOrders}
Total Revenue: ${currency(salesSummary.totalRevenue)}
Circle Benefits Tracked: ${currency(salesSummary.circleRewards)}
    `;
    downloadTextPdf("Sales Report", content);
  };

  const exportSubmissionsPdf = () => {
    const content = data.submissions
      .map(
        (s) => `
Order ID: ${s.orderId}
Date: ${s.createdAt}
Customer Name: ${s.customerName || "-"}
Package: ${s.packageName}
Template: ${s.templateName}
Amount: ${currency(s.packagePrice)}
Payment Status: ${s.paymentStatus}
Referral ID: ${s.referralIdUsed || "-"}
----------------------------------------
`
      )
      .join("\n");

    downloadTextPdf("Customer Data Report", content || "No submissions yet.");
  };

  const exportCirclePdf = () => {
    const content = data.circleMembers
      .map(
        (m) => `
Member: ${m.memberName}
Referral ID: ${m.referralId}
Phone: ${m.phone || "-"}
Status: ${m.active ? "Active" : "Inactive"}
Notes: ${m.notes || "-"}
Total Referrals: ${m.referrals.length}
----------------------------------------
`
      )
      .join("\n");

    downloadTextPdf("Circle Membership Report", content || "No members.");
  };

  const exportStaffPdf = () => {
    const content = data.adminUsers
      .map(
        (u) => `
Name: ${u.name}
Username: ${u.username}
Role: ${u.role}
Status: ${u.active ? "Active" : "Inactive"}
----------------------------------------
`
      )
      .join("\n");

    downloadTextPdf("Staff Report", content || "No staff.");
  };

  const printOrder = (submission) => {
    const customerRows = data.formFields
      .map((field) => {
        const val = submission.customerData?.[field.id];
        const rendered = Array.isArray(val)
          ? val
              .map((item) =>
                typeof item === "object" && item?.url
                  ? `<a href="${item.url}" download="${item.name}">${item.name}</a>`
                  : item
              )
              .join(", ")
          : val ?? "";

        return `<tr><td style="padding:8px;border:1px solid #ccc;"><b>${field.label}</b></td><td style="padding:8px;border:1px solid #ccc;">${rendered}</td></tr>`;
      })
      .join("");

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`
      <html>
        <head>
          <title>${submission.orderId}</title>
          <style>
            body{font-family:Arial,sans-serif;padding:24px;color:#111;}
            h1,h2{margin:0 0 12px;}
            table{width:100%;border-collapse:collapse;margin-top:16px;}
            .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
            .box{border:1px solid #ddd;padding:12px;border-radius:8px;}
          </style>
        </head>
        <body>
          <h1>CV STACK Order Document</h1>
          <div class="grid">
            <div class="box"><b>Order ID:</b> ${submission.orderId}</div>
            <div class="box"><b>Date:</b> ${submission.createdAt}</div>
            <div class="box"><b>Template:</b> ${submission.templateName}</div>
            <div class="box"><b>Package:</b> ${submission.packageName} (${currency(
              submission.packagePrice
            )})</div>
            <div class="box"><b>Payment Status:</b> ${submission.paymentStatus}</div>
          </div>
          <h2>Customer Information</h2>
          <table>${customerRows}</table>
          <script>window.print()</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div
          className="brand-block"
          style={{
            "--logo-size": `${data.site.logoSize || 48}px`,
            "--title-size": `${data.site.headerTitleSize || 22}px`,
            "--subtitle-size": `${data.site.headerSubtitleSize || 13}px`,
          }}
        >
          {data.site.logoImage ? (
            <img src={data.site.logoImage} alt="Logo" className="real-logo" />
          ) : (
            <div className="brand-logo">{(data.site.logoText || "CV").slice(0, 2)}</div>
          )}

          <div className="brand-text">
            <h1>{data.site.headerTitle || data.site.logoText}</h1>
            <p>{data.site.headerSubtitle}</p>
          </div>
        </div>

        <div className="topbar-actions">
          <button className="ghost-btn" onClick={() => setScreen("home")}>
            Home
          </button>
          <a
            className="ghost-btn linklike"
            href={`https://wa.me/${data.site.supportWhatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp Support
          </a>
        </div>
      </header>

      {screen === "home" && (
        <div className="page">
          <section className="hero">
            <div className="hero-copy">
              <span className="pill">Professional CV Management Portal</span>
              <h2>{data.site.heroTitle}</h2>
              <p>{data.site.heroSubtitle}</p>
              <div className="hero-actions">
                <button className="primary-btn" onClick={() => setScreen("createCv")}>
                  Start Creating CV
                </button>
                <button className="secondary-btn" onClick={() => setScreen("circleLogin")}>
                  Circle Login
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {screen === "createCv" && (
        <div className="page narrow-page">
          <div className="section-card">
            <div className="step-header">
              <div>
                <h2>Start Creating CV</h2>
                <p>Complete each step before moving to the next one.</p>
              </div>
              <div className="step-badges">
                {["Referral", "About Me", "CV Templates", "Packages"].map((label, index) => (
                  <div
                    key={label}
                    className={`step-badge ${customerStep === index ? "active" : ""} ${
                      customerStep > index ? "done" : ""
                    }`}
                  >
                    {index + 1}. {label}
                  </div>
                ))}
              </div>
            </div>

            {customerStep === 0 && (
              <div>
                <div className="title-row">
                  <h3>Referral Code</h3>
                  <p className="helper-text">Enter referral ID at the beginning if available.</p>
                </div>
                <div className="summary-card">
                  <input
                    type="text"
                    placeholder="Enter referral ID if available"
                    value={customerReferralId}
                    onChange={(e) => setCustomerReferralId(e.target.value)}
                  />
                  <p className="helper-text">Circle accounts are created only by admin.</p>
                </div>
              </div>
            )}

            {customerStep === 1 && (
              <div>
                <div className="title-row">
                  <h3>About Me</h3>
                  <p className="helper-text">Customer data retrieval is prioritized here.</p>
                </div>

                <div className="form-grid">
                  {data.formFields.map((field) => (
                    <div key={field.id} className="form-group">
                      <label>
                        {field.label} {field.required && <span className="req">*</span>}
                      </label>

                      {field.type === "textarea" && (
                        <textarea
                          placeholder={field.placeholder}
                          value={customerForm[field.id] || ""}
                          onChange={(e) =>
                            setCustomerForm((prev) => ({ ...prev, [field.id]: e.target.value }))
                          }
                        />
                      )}

                      {field.type === "select" && (
                        <select
                          value={customerForm[field.id] || ""}
                          onChange={(e) =>
                            setCustomerForm((prev) => ({ ...prev, [field.id]: e.target.value }))
                          }
                        >
                          <option value="">Select an option</option>
                          {field.options.map((opt, idx) => (
                            <option key={idx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}

                      {["text", "email", "number"].includes(field.type) && (
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={customerForm[field.id] || ""}
                          onChange={(e) =>
                            setCustomerForm((prev) => ({ ...prev, [field.id]: e.target.value }))
                          }
                        />
                      )}

                      {field.type === "file" && (
                        <div className="file-box">
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileField(field.id, e.target.files)}
                          />
                          {Array.isArray(customerForm[field.id]) &&
                            customerForm[field.id].length > 0 && (
                              <div className="file-list">
                                {customerForm[field.id].map((file, idx) => (
                                  <a
                                    key={idx}
                                    className="file-chip"
                                    href={file.url}
                                    download={file.name}
                                  >
                                    {file.name}
                                  </a>
                                ))}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customerStep === 2 && (
              <div>
                <div className="title-row">
                  <h3>CV Templates</h3>
                  <p className="helper-text">Select one template and preview it before proceeding.</p>
                </div>

                <div className="template-grid">
                  {activeTemplates.map((template) => (
                    <div key={template.id} className={`template-card ${selectedTemplate === template.id ? "selected-card" : ""}`}>
                      <button
                        className="template-select-btn"
                        onClick={() => setSelectedTemplate(template.id)}
                        type="button"
                      >
                        {template.image ? (
                          <img src={template.image} alt={template.name} />
                        ) : (
                          <div className="template-empty">No Image Uploaded</div>
                        )}
                        <div className="template-card-body">
                          <h4>{template.name}</h4>
                          <p>{template.description}</p>
                        </div>
                      </button>

                      <div className="template-actions">
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customerStep === 3 && (
              <div>
                <div className="title-row">
                  <h3>Packages</h3>
                  <p className="helper-text">Select your package and click submit to continue to WhatsApp.</p>
                </div>

                <div className="package-grid">
                  {activePackages.map((pkg) => (
                    <button
                      key={pkg.id}
                      className={`package-card ${selectedPackage === pkg.id ? "selected-card" : ""}`}
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      <div>
                        <h4>{pkg.name}</h4>
                        <p>{pkg.description}</p>
                      </div>
                      <strong>{currency(pkg.price)}</strong>
                    </button>
                  ))}
                </div>

                <div className="summary-card" style={{ marginTop: "16px" }}>
                  <h4>Circle Membership</h4>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={joinCircle}
                      onChange={(e) => setJoinCircle(e.target.checked)}
                    />
                    <span>Do you like to become a Circle member?</span>
                  </label>
                </div>
              </div>
            )}

            {customerNotice && <div className="notice">{customerNotice}</div>}

            <div className="wizard-actions">
              <button
                className="ghost-btn"
                onClick={() => {
                  if (customerStep === 0) {
                    setScreen("home");
                  } else {
                    setCustomerStep((prev) => prev - 1);
                  }
                }}
              >
                Back
              </button>

              {customerStep < 3 ? (
                <button
                  className="primary-btn"
                  onClick={() => {
                    if (!canGoNext()) {
                      if (customerStep === 1) {
                        setCustomerNotice("Please complete the current form before proceeding.");
                      } else if (customerStep === 2) {
                        setCustomerNotice("Please select a template before proceeding.");
                      } else {
                        setCustomerNotice("Please complete the current step before proceeding.");
                      }
                      return;
                    }
                    setCustomerNotice("");
                    setCustomerStep((prev) => prev + 1);
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  className="primary-btn"
                  onClick={() => {
                    if (!selectedPackage) {
                      setCustomerNotice("Please select a package before submitting.");
                      return;
                    }
                    setCustomerNotice("");
                    submitOrder();
                  }}
                >
                  Submit Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {screen === "orderSuccess" && (
        <div className="page narrow-page">
          <div className="section-card center-card">
            <span className="success-icon">✓</span>
            <h2>Order Submitted Successfully</h2>
            <p>{data.site.paymentNote}</p>
            <div className="job-box">Your Job ID: {submittedOrderId}</div>
            <div className="cta-row">
              <button className="secondary-btn" onClick={resetCustomerFlow}>
                Home Screen
              </button>
              <a
                className="primary-btn linklike"
                href={whatsappUrl(
                  `Hello, I have completed my order.\nJob ID: ${submittedOrderId}\nPlease check my submission.`,
                  data.site.supportWhatsapp
                )}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {previewTemplate && (
        <div className="preview-overlay" onClick={() => setPreviewTemplate(null)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="title-row">
              <h3>{previewTemplate.name}</h3>
              <button className="ghost-btn" onClick={() => setPreviewTemplate(null)}>
                Close
              </button>
            </div>

            {previewTemplate.image ? (
              <img
                src={previewTemplate.image}
                alt={previewTemplate.name}
                style={{
                  width: "100%",
                  maxHeight: "75vh",
                  objectFit: "contain",
                  borderRadius: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            ) : (
              <div className="template-empty">No Image Uploaded</div>
            )}

            <p style={{ marginTop: "14px", color: "#94a3b8" }}>{previewTemplate.description}</p>
          </div>
        </div>
      )}

      {screen === "circleLogin" && (
        <div className="page narrow-page">
          <div className="section-card" style={{ marginBottom: "18px" }}>
            <div
              className="hero-copy"
              style={{ padding: "22px", cursor: "default" }}
              onDoubleClick={() => setScreen("adminLogin")}
            >
              <span className="pill">Member Area</span>
              <h2 style={{ fontSize: "2rem", marginTop: "14px" }}>
                {data.site.circleBannerTitle} !
              </h2>
              <p>{data.site.circleBannerText}</p>
            </div>
          </div>

          <div className="auth-card">
            <h2>Circle Login</h2>
            <p>Only admin can create Circle member accounts.</p>
            <input
              type="text"
              placeholder="Referral ID"
              value={circleLogin.referralId}
              onChange={(e) => setCircleLogin((p) => ({ ...p, referralId: e.target.value }))}
            />
            <input
              type="password"
              placeholder="Password"
              value={circleLogin.password}
              onChange={(e) => setCircleLogin((p) => ({ ...p, password: e.target.value }))}
            />
            {circleError && <div className="error-box">{circleError}</div>}
            <button className="primary-btn" onClick={handleCircleLogin}>
              Login
            </button>
          </div>
        </div>
      )}

      {screen === "circleDashboard" && currentCircleMember && (
        <div className="page">
          <div className="dashboard-head">
            <div>
              <h2>Circle Dashboard</h2>
              <p>Welcome, {currentCircleMember.memberName}</p>
            </div>
            <button
              className="ghost-btn"
              onClick={() => {
                setCircleSession(null);
                setScreen("home");
              }}
            >
              Logout
            </button>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>{circleStats.successfulCount}</h3>
              <p>Total Successful Referrals</p>
            </div>
            <div className="stat-card">
              <h3>{currency(circleStats.eligibleAmount)}</h3>
              <p>Total Eligible Amount</p>
            </div>
            <div className="stat-card">
              <h3>{currency(circleStats.paidAmount)}</h3>
              <p>Paid Amount</p>
            </div>
            <div className="stat-card">
              <h3>{currency(circleStats.yetToPayAmount)}</h3>
              <p>Yet to Pay</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="section-card">
              <h3>Referral Records</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Referred Member</th>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCircleMember.referrals.length === 0 ? (
                      <tr>
                        <td colSpan="5">No referrals yet.</td>
                      </tr>
                    ) : (
                      currentCircleMember.referrals.map((ref) => (
                        <tr key={ref.id}>
                          <td>{ref.referredName}</td>
                          <td>{ref.orderId}</td>
                          <td>{currency(ref.amount)}</td>
                          <td>{ref.status}</td>
                          <td>{ref.paid ? "Yes" : "No"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="section-card">
              <h3>Latest News</h3>
              <div className="news-list">
                {data.news.map((item) => (
                  <div key={item.id} className="news-card">
                    <h4>{item.title}</h4>
                    <small>{item.createdAt}</small>
                    <p>{item.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {screen === "adminLogin" && (
        <div className="page narrow-page">
          <div className="auth-card">
            <h2>Admin Login</h2>
            <p>Password protected admin access.</p>

            <input
              type="text"
              placeholder="Username"
              value={adminLogin.username}
              onChange={(e) => setAdminLogin((p) => ({ ...p, username: e.target.value }))}
            />

            <input
              type="password"
              placeholder="Password"
              value={adminLogin.password}
              onChange={(e) => setAdminLogin((p) => ({ ...p, password: e.target.value }))}
            />

            {adminError && <div className="error-box">{adminError}</div>}

            <button className="primary-btn" onClick={handleAdminLogin}>
              Login
            </button>

            <button className="secondary-btn" onClick={resetAppData}>
              Reset App Data
            </button>

            <p className="helper-text">Default demo login: admin / 1234</p>
          </div>
        </div>
      )}

      {screen === "adminDashboard" && adminSession && (
        <div className="page">
          <div className="dashboard-head">
            <div>
              <h2>Admin Dashboard</h2>
              <p>
                {adminSession.name} · {adminSession.role}
              </p>
            </div>
            <button
              className="ghost-btn"
              onClick={() => {
                setAdminSession(null);
                setScreen("home");
              }}
            >
              Logout
            </button>
          </div>

          <div className="admin-layout">
            <aside className="admin-sidebar">
              {adminTabs
                .filter((tab) => hasPermission(tab.permission))
                .map((tab) => (
                  <button
                    key={tab.key}
                    className={`sidebar-tab ${adminTab === tab.key ? "active" : ""}`}
                    onClick={() => setAdminTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
            </aside>

            <main className="admin-main">
              {adminTab === "submissions" && hasPermission("submissions") && (
                <div className="section-card">
                  <div className="title-row">
                    <h3>Customer Submission Results</h3>
                    <p className="helper-text">Prioritized customer data retrieval view.</p>
                  </div>

                  <div className="cta-row" style={{ marginBottom: "14px" }}>
                    <button className="secondary-btn" onClick={exportSubmissionsPdf}>
                      Download Customer Data PDF
                    </button>
                    <button className="secondary-btn" onClick={downloadSubmissionsCsv}>
                      Download Orders CSV
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Name</th>
                          <th>Package</th>
                          <th>Template</th>
                          <th>Amount</th>
                          <th>Payment</th>
                          <th>Status Toggle</th>
                          <th>Files</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.submissions.length === 0 ? (
                          <tr>
                            <td colSpan="10">No submissions yet.</td>
                          </tr>
                        ) : (
                          data.submissions.map((s) => {
                            const uploadField = data.formFields.find((f) => f.type === "file");
                            const files = uploadField ? s.customerData?.[uploadField.id] || [] : [];

                            return (
                              <tr key={s.id}>
                                <td>{s.orderId}</td>
                                <td>{new Date(s.createdAt).toLocaleString()}</td>
                                <td>{s.customerName || "-"}</td>
                                <td>{s.packageName}</td>
                                <td>{s.templateName}</td>
                                <td>{currency(s.packagePrice)}</td>
                                <td>{s.paymentStatus}</td>
                                <td>
                                  <button className="tiny-btn" onClick={() => togglePaymentStatus(s.id)}>
                                    Toggle
                                  </button>
                                </td>
                                <td>
                                  <div style={{ display: "grid", gap: "6px" }}>
                                    {files.length === 0 ? (
                                      <span>-</span>
                                    ) : (
                                      files.map((file, idx) => (
                                        <a
                                          key={idx}
                                          className="file-chip"
                                          href={file.url}
                                          download={file.name}
                                        >
                                          {file.name}
                                        </a>
                                      ))
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <button className="tiny-btn" onClick={() => printOrder(s)}>
                                    Print
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {adminTab === "branding" && hasPermission("branding") && (
                <div className="section-card">
                  <h3>Branding Settings</h3>
                  <div className="form-grid two-col">
                    <div className="form-group">
                      <label>Logo Text</label>
                      <input
                        value={data.site.logoText}
                        onChange={(e) => updateSite("logoText", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Main Logo Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          updateSite("logoImage", URL.createObjectURL(file));
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Logo Size (px)</label>
                      <input
                        type="number"
                        value={data.site.logoSize || 48}
                        onChange={(e) => updateSite("logoSize", Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label>Header Title</label>
                      <input
                        value={data.site.headerTitle || ""}
                        onChange={(e) => updateSite("headerTitle", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Header Subtitle</label>
                      <input
                        value={data.site.headerSubtitle || ""}
                        onChange={(e) => updateSite("headerSubtitle", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Header Title Size (px)</label>
                      <input
                        type="number"
                        value={data.site.headerTitleSize || 22}
                        onChange={(e) => updateSite("headerTitleSize", Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label>Header Subtitle Size (px)</label>
                      <input
                        type="number"
                        value={data.site.headerSubtitleSize || 13}
                        onChange={(e) => updateSite("headerSubtitleSize", Number(e.target.value))}
                      />
                    </div>

                    <div className="form-group">
                      <label>Support WhatsApp Number</label>
                      <input
                        value={data.site.supportWhatsapp}
                        onChange={(e) => updateSite("supportWhatsapp", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Circle Banner Title</label>
                      <input
                        value={data.site.circleBannerTitle}
                        onChange={(e) => updateSite("circleBannerTitle", e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                      <label>Circle Banner Text</label>
                      <textarea
                        value={data.site.circleBannerText}
                        onChange={(e) => updateSite("circleBannerText", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {adminTab === "home" && hasPermission("home") && (
                <div className="section-card">
                  <h3>Main Screen Customization</h3>
                  <div className="form-group">
                    <label>Hero Title</label>
                    <input
                      value={data.site.heroTitle}
                      onChange={(e) => updateSite("heroTitle", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hero Subtitle</label>
                    <textarea
                      value={data.site.heroSubtitle}
                      onChange={(e) => updateSite("heroSubtitle", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {adminTab === "formBuilder" && hasPermission("formBuilder") && (
                <div className="section-card">
                  <div className="title-row">
                    <h3>About Me Form Builder</h3>
                    <button className="primary-btn" onClick={addFormField}>
                      Add Field
                    </button>
                  </div>

                  <div className="stack-list">
                    {data.formFields.map((field) => (
                      <div key={field.id} className="editable-card">
                        <div className="form-grid two-col">
                          <div className="form-group">
                            <label>Label</label>
                            <input
                              value={field.label}
                              onChange={(e) => updateFormField(field.id, { label: e.target.value })}
                            />
                          </div>

                          <div className="form-group">
                            <label>Type</label>
                            <select
                              value={field.type}
                              onChange={(e) => updateFormField(field.id, { type: e.target.value })}
                            >
                              <option value="text">Text</option>
                              <option value="email">Email</option>
                              <option value="number">Number</option>
                              <option value="textarea">Textarea</option>
                              <option value="select">Select</option>
                              <option value="file">File Upload</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label>Placeholder</label>
                            <input
                              value={field.placeholder}
                              onChange={(e) => updateFormField(field.id, { placeholder: e.target.value })}
                            />
                          </div>

                          <div className="form-group">
                            <label>Select Options (comma separated)</label>
                            <input
                              value={field.options.join(", ")}
                              onChange={(e) =>
                                updateFormField(field.id, {
                                  options: e.target.value
                                    .split(",")
                                    .map((x) => x.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="row-between">
                          <label className="checkbox-row">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateFormField(field.id, { required: e.target.checked })}
                            />
                            <span>Required</span>
                          </label>

                          <button className="danger-btn" onClick={() => deleteFormField(field.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === "templates" && hasPermission("templates") && (
                <div className="section-card">
                  <div className="title-row">
                    <h3>Template Manager</h3>
                    <button className="primary-btn" onClick={addTemplate}>
                      Add Template
                    </button>
                  </div>

                  <p className="helper-text">
                    Created templates are listed below. Edit each one and click Save.
                  </p>

                  <div className="stack-list">
                    {data.templates.map((template) => {
                      const draft = templateDrafts[template.id] || template;
                      return (
                        <div key={template.id} className="editable-card">
                          <div className="form-grid two-col">
                            <div className="form-group">
                              <label>Template Name</label>
                              <input
                                value={draft.name || ""}
                                onChange={(e) => updateTemplateDraft(template.id, { name: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Template Image Upload</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  updateTemplateDraft(template.id, {
                                    image: URL.createObjectURL(file),
                                    imageName: file.name,
                                  });
                                }}
                              />
                              {draft.image && (
                                <div style={{ marginTop: "10px" }}>
                                  <img
                                    src={draft.image}
                                    alt={draft.name}
                                    style={{
                                      width: "120px",
                                      borderRadius: "12px",
                                      border: "1px solid #334155",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Description</label>
                            <textarea
                              value={draft.description || ""}
                              onChange={(e) => updateTemplateDraft(template.id, { description: e.target.value })}
                            />
                          </div>

                          <div className="row-between">
                            <label className="checkbox-row">
                              <input
                                type="checkbox"
                                checked={!!draft.active}
                                onChange={(e) => updateTemplateDraft(template.id, { active: e.target.checked })}
                              />
                              <span>Active</span>
                            </label>

                            <div style={{ display: "flex", gap: "10px" }}>
                              <button className="primary-btn" onClick={() => saveTemplate(template.id)}>
                                Save
                              </button>
                              <button className="danger-btn" onClick={() => deleteTemplate(template.id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {adminTab === "packages" && hasPermission("packages") && (
                <div className="section-card">
                  <div className="title-row">
                    <h3>Package Manager</h3>
                    <button className="primary-btn" onClick={addPackage}>
                      Add Package
                    </button>
                  </div>

                  <div className="stack-list">
                    {data.packages.map((pkg) => (
                      <div key={pkg.id} className="editable-card">
                        <div className="form-grid two-col">
                          <div className="form-group">
                            <label>Package Name</label>
                            <input
                              value={pkg.name}
                              onChange={(e) => updatePackage(pkg.id, { name: e.target.value })}
                            />
                          </div>

                          <div className="form-group">
                            <label>Price</label>
                            <input
                              type="number"
                              value={pkg.price}
                              onChange={(e) => updatePackage(pkg.id, { price: Number(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Description</label>
                          <textarea
                            value={pkg.description}
                            onChange={(e) => updatePackage(pkg.id, { description: e.target.value })}
                          />
                        </div>

                        <div className="row-between">
                          <label className="checkbox-row">
                            <input
                              type="checkbox"
                              checked={pkg.active}
                              onChange={(e) => updatePackage(pkg.id, { active: e.target.checked })}
                            />
                            <span>Active</span>
                          </label>

                          <button className="danger-btn" onClick={() => deletePackage(pkg.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === "circle" && hasPermission("circle") && (
                <div className="section-card">
                  <div className="title-row">
                    <h3>Circle Membership Creation & Management</h3>
                    <div className="cta-row">
                      <button className="primary-btn" onClick={addCircleMember}>
                        Create Circle Member
                      </button>
                      <button className="secondary-btn" onClick={exportCirclePdf}>
                        Download Circle PDF
                      </button>
                    </div>
                  </div>

                  <p className="helper-text">
                    Created circle members are listed below. Edit and click Save.
                  </p>

                  <div className="stack-list">
                    {data.circleMembers.map((member) => {
                      const draft = circleDrafts[member.id] || member;

                      return (
                        <div key={member.id} className="editable-card">
                          <div className="form-grid two-col">
                            <div className="form-group">
                              <label>Member Name</label>
                              <input
                                value={draft.memberName || ""}
                                onChange={(e) => updateCircleDraft(member.id, { memberName: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Referral ID</label>
                              <input
                                value={draft.referralId || ""}
                                onChange={(e) => updateCircleDraft(member.id, { referralId: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Password</label>
                              <input
                                value={draft.password || ""}
                                onChange={(e) => updateCircleDraft(member.id, { password: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Phone</label>
                              <input
                                value={draft.phone || ""}
                                onChange={(e) => updateCircleDraft(member.id, { phone: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Status</label>
                              <select
                                value={draft.active ? "active" : "inactive"}
                                onChange={(e) => updateCircleDraft(member.id, { active: e.target.value === "active" })}
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>

                          <div className="form-group">
                            <label>Notes</label>
                            <textarea
                              value={draft.notes || ""}
                              onChange={(e) => updateCircleDraft(member.id, { notes: e.target.value })}
                            />
                          </div>

                          <div className="table-wrap compact-table">
                            <table>
                              <thead>
                                <tr>
                                  <th>Referred Name</th>
                                  <th>Order ID</th>
                                  <th>Amount</th>
                                  <th>Benefit Paid</th>
                                  <th>Toggle</th>
                                </tr>
                              </thead>
                              <tbody>
                                {member.referrals.length === 0 ? (
                                  <tr>
                                    <td colSpan="5">No referrals.</td>
                                  </tr>
                                ) : (
                                  member.referrals.map((ref) => (
                                    <tr key={ref.id}>
                                      <td>{ref.referredName}</td>
                                      <td>{ref.orderId}</td>
                                      <td>{currency(ref.amount)}</td>
                                      <td>{ref.paid ? "Paid" : "Unpaid"}</td>
                                      <td>
                                        <button
                                          className="tiny-btn"
                                          onClick={() => toggleReferralPaid(member.id, ref.id)}
                                        >
                                          Toggle Paid
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>

                          <div className="row-end" style={{ gap: "10px" }}>
                            <button className="primary-btn" onClick={() => saveCircleMember(member.id)}>
                              Save
                            </button>
                            <button className="danger-btn" onClick={() => deleteCircleMember(member.id)}>
                              Delete Member
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {adminTab === "news" && hasPermission("news") && (
                <div className="section-card">
                  <div className="title-row">
                    <h3>Latest News Screen</h3>
                    <button className="primary-btn" onClick={addNews}>
                      Add News
                    </button>
                  </div>

                  <div className="stack-list">
                    {data.news.map((item) => (
                      <div key={item.id} className="editable-card">
                        <div className="form-grid two-col">
                          <div className="form-group">
                            <label>Title</label>
                            <input
                              value={item.title}
                              onChange={(e) => updateNews(item.id, { title: e.target.value })}
                            />
                          </div>

                          <div className="form-group">
                            <label>Date</label>
                            <input
                              value={item.createdAt}
                              onChange={(e) => updateNews(item.id, { createdAt: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Content</label>
                          <textarea
                            value={item.content}
                            onChange={(e) => updateNews(item.id, { content: e.target.value })}
                          />
                        </div>

                        <div className="row-end">
                          <button className="danger-btn" onClick={() => deleteNews(item.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {adminTab === "staff" && hasPermission("staff") && (
                <div className="section-card">
                  <div className="title-row">
                    <h3>Admin / Staff Access Control</h3>
                    <div className="cta-row">
                      <button className="primary-btn" onClick={addStaff}>
                        Create Staff Account
                      </button>
                      <button className="secondary-btn" onClick={exportStaffPdf}>
                        Download Staff PDF
                      </button>
                    </div>
                  </div>

                  <p className="helper-text">
                    Created staff accounts are listed below. Edit and click Save.
                  </p>

                  <div className="stack-list">
                    {data.adminUsers.map((user) => {
                      const draft = staffDrafts[user.id] || user;

                      return (
                        <div key={user.id} className="editable-card">
                          <div className="form-grid two-col">
                            <div className="form-group">
                              <label>Name</label>
                              <input
                                value={draft.name || ""}
                                onChange={(e) => updateStaffDraft(user.id, { name: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Username</label>
                              <input
                                value={draft.username || ""}
                                onChange={(e) => updateStaffDraft(user.id, { username: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Password</label>
                              <input
                                value={draft.password || ""}
                                onChange={(e) => updateStaffDraft(user.id, { password: e.target.value })}
                              />
                            </div>

                            <div className="form-group">
                              <label>Role</label>
                              <select
                                value={draft.role || "staff"}
                                onChange={(e) => updateStaffDraft(user.id, { role: e.target.value })}
                              >
                                <option value="super_admin">super_admin</option>
                                <option value="staff">staff</option>
                              </select>
                            </div>

                            <div className="form-group">
                              <label>Status</label>
                              <select
                                value={draft.active ? "active" : "inactive"}
                                onChange={(e) => updateStaffDraft(user.id, { active: e.target.value === "active" })}
                              >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                            </div>
                          </div>

                          <div className="permission-grid">
                            {[
                              "submissions",
                              "branding",
                              "home",
                              "formBuilder",
                              "templates",
                              "packages",
                              "circle",
                              "news",
                              "staff",
                              "sales",
                              "backup",
                            ].map((perm) => (
                              <label key={perm} className="checkbox-row">
                                <input
                                  type="checkbox"
                                  checked={user.permissions?.[perm] || false}
                                  onChange={() => togglePermission(user.id, perm)}
                                  disabled={user.role === "super_admin"}
                                />
                                <span>{perm}</span>
                              </label>
                            ))}
                          </div>

                          <div className="row-end" style={{ gap: "10px" }}>
                            <button className="primary-btn" onClick={() => saveStaff(user.id)}>
                              Save
                            </button>
                            {data.adminUsers.length > 1 && (
                              <button className="danger-btn" onClick={() => deleteAdminUser(user.id)}>
                                Delete User
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {adminTab === "sales" && hasPermission("sales") && (
                <div className="section-card">
                  <div className="title-row">
                    <h3>Full Track of Sales</h3>
                    <button className="secondary-btn" onClick={exportSalesPdf}>
                      Download Sales PDF
                    </button>
                  </div>

                  <div className="stats-grid">
                    <div className="stat-card">
                      <h3>{salesSummary.totalOrders}</h3>
                      <p>Total Orders</p>
                    </div>
                    <div className="stat-card">
                      <h3>{salesSummary.paidOrders}</h3>
                      <p>Paid Orders</p>
                    </div>
                    <div className="stat-card">
                      <h3>{currency(salesSummary.totalRevenue)}</h3>
                      <p>Total Revenue</p>
                    </div>
                    <div className="stat-card">
                      <h3>{currency(salesSummary.circleRewards)}</h3>
                      <p>Circle Benefits Tracked</p>
                    </div>
                  </div>
                </div>
              )}

              {adminTab === "backup" && hasPermission("backup") && (
                <div className="section-card">
                  <h3>Backup Data Printing & Export</h3>
                  <div className="cta-row">
                    <button className="primary-btn" onClick={downloadJsonBackup}>
                      Download Full Backup JSON
                    </button>
                    <button className="secondary-btn" onClick={downloadSubmissionsCsv}>
                      Download Orders CSV
                    </button>
                    <button className="secondary-btn" onClick={exportSubmissionsPdf}>
                      Customer Data PDF
                    </button>
                    <button className="secondary-btn" onClick={exportCirclePdf}>
                      Circle PDF
                    </button>
                    <button className="secondary-btn" onClick={exportStaffPdf}>
                      Staff PDF
                    </button>
                    <button className="secondary-btn" onClick={exportSalesPdf}>
                      Sales PDF
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;