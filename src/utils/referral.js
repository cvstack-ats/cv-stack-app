export function validateReferralCode(code, circleMembers = [], discountAmount = 100) {
  if (!code?.trim()) {
    return {
      isValid: false,
      message: "",
      discount: 0,
      member: null,
    };
  }

  const member = circleMembers.find(
    (item) =>
      (item.referral_code || item.referralCode || "")
        .toLowerCase()
        .trim() === code.toLowerCase().trim()
  );

  if (!member) {
    return {
      isValid: false,
      message: "Check referral code",
      discount: 0,
      member: null,
    };
  }

  return {
    isValid: true,
    message: `Valid referral code applied. Discount ₹${discountAmount}`,
    discount: discountAmount,
    member,
  };
}