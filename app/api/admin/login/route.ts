import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    // Mengambil kode rahasia dari .env.local
    const correctCode = process.env.ADMIN_ACCESS_CODE;
    console.log("Input User:", code);
    console.log("Kode Seharusnya:", correctCode);

    if (code === correctCode) {
      const cookieStore = await cookies();

      // Memberikan cookie sebagai tanda sudah login
      cookieStore.set("admin_session", "is_logged_in", {
        httpOnly: true, // Supaya tidak bisa dimaling oleh script jahat di browser
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // Berlaku selama 24 jam
        path: "/",
      });

      return NextResponse.json({ message: "Login Berhasil" }, { status: 200 });
    }

    return NextResponse.json({ message: "Kode akses salah!" }, { status: 401 });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan sistem" },
      { status: 500 },
    );
  }
}
