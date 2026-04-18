import {NextRequest, NextResponse} from "next/server";
import {sendRegistrationEmails, type RegistrationData} from "@/lib/resend";
import {appendRegistration} from "@/lib/google-sheets";

const VALID_GENDERS = ["Man", "Vrouw", "Male", "Female"];
const VALID_POSITIONS = [
  "Guard",
  "Forward",
  "Center",
  "N.v.t.",
  "N/A",
  "Anders",
  "Other",
];
const VALID_INTERESTS = [
  "Trainen én competitie spelen",
  "Alleen trainen",
  "Nog niet zeker",
  "Training and competing",
  "Training only",
  "Not sure yet",
];

function validate(body: Record<string, unknown>): string | null {
  const required = [
    "name",
    "birthDate",
    "email",
    "gender",
    "lastLevel",
    "lastSeason",
    "position",
    "interest",
    "remarks",
  ];
  for (const field of required) {
    if (
      !body[field] ||
      typeof body[field] !== "string" ||
      !(body[field] as string).trim()
    ) {
      return `Missing field: ${field}`;
    }
  }
  const email = body.email as string;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email";
  if (!VALID_GENDERS.includes(body.gender as string)) return "Invalid gender";
  if (!VALID_POSITIONS.includes(body.position as string))
    return "Invalid position";
  if (!VALID_INTERESTS.includes(body.interest as string))
    return "Invalid interest";
  return null;
}

async function verifyRecaptcha(token: unknown): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });
  const data = (await res.json()) as {success: boolean; score?: number};
  return data.success && (data.score ?? 0) >= 0.5;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({error: "Invalid JSON"}, {status: 400});
  }

  const captchaOk = await verifyRecaptcha(body.recaptchaToken);
  if (!captchaOk) {
    return NextResponse.json(
      {error: "reCAPTCHA verification failed"},
      {status: 400},
    );
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({error: validationError}, {status: 400});
  }

  const data: RegistrationData = {
    name: (body.name as string).trim(),
    birthDate: (body.birthDate as string).trim(),
    email: (body.email as string).trim().toLowerCase(),
    gender: body.gender as string,
    lastLevel: (body.lastLevel as string).trim(),
    lastSeason: (body.lastSeason as string).trim(),
    position: body.position as string,
    interest: body.interest as string,
    remarks: typeof body.remarks === "string" ? body.remarks.trim() : "",
    locale: typeof body.locale === "string" ? body.locale : "nl",
  };

  try {
    await Promise.all([appendRegistration(data), sendRegistrationEmails(data)]);
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({error: "Internal server error"}, {status: 500});
  }

  return NextResponse.json({ok: true});
}
