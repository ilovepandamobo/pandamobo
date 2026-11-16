export const contactLimits = { name: 40, company: 80, role: 40, email: 80, phone: 30, service: 80, message: 1000 };
export type ContactField = keyof typeof contactLimits;
export type ContactSubmission = Record<ContactField, string> & { privacy: boolean };
export type ContactErrors = Partial<Record<ContactField | "contact" | "privacy", string>>;

const fieldLabels: Record<ContactField, string> = {
  name: "姓名", company: "公司名称", role: "职位", email: "邮箱", phone: "电话", service: "咨询方向", message: "需求描述",
};

export function parseContact(input: unknown): { data: ContactSubmission; errors: ContactErrors } | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const source = input as Record<string, unknown>;
  const data = { name: "", company: "", role: "", email: "", phone: "", service: "", message: "", privacy: source.privacy === true };
  const errors: ContactErrors = {};

  for (const field of Object.keys(contactLimits) as ContactField[]) {
    const value = source[field];
    if (value !== undefined && typeof value !== "string") return null;
    data[field] = value?.trim() ?? "";
    if (data[field].length > contactLimits[field]) errors[field] = `${fieldLabels[field]}请控制在 ${contactLimits[field]} 个字以内`;
  }
  if (!data.email && !data.phone) errors.contact = "请填写邮箱或电话，至少一种";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "请输入有效的邮箱";
  if (data.phone && (!/^[0-9+\-()\s]{6,30}$/.test(data.phone) || data.phone.replace(/\D/g, "").length < 6)) errors.phone = "请输入有效的电话";
  if (!data.privacy) errors.privacy = "请阅读隐私说明后自行勾选";
  return { data, errors };
}
