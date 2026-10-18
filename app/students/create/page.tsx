import prisma from "@/app/lib/prisma";
import { redirect } from "next/navigation";
import { studentSchema } from "../validation";


async function createStudent(formData: FormData) {
    "use server";

    const studentCode = formData.get("studentCode") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const major = formData.get("major") as string;
    const year = Number(formData.get("year"));

    await prisma.student.create({
        data: {
            studentCode,
            name,
            email: email || null,
            major,
            year,
        },
    });

    redirect("/students");
}

export default function CreateStudentPage() {
    return (
        <main className="mx-auto max-w-2xl p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    เพิ่มนักศึกษา
                </h1>

                <p className="mt-2 text-gray-600">
                    กรอกข้อมูลนักศึกษา
                </p>
            </div>

            <form
                action={createStudent}
                className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
                <div>
                    <label
                        htmlFor="studentCode"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        รหัสนักศึกษา
                    </label>

                    <input
                        id="studentCode"
                        type="text"
                        name="studentCode"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        ชื่อ-นามสกุล
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="major"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        สาขา
                    </label>

                    <input
                        id="major"
                        type="text"
                        name="major"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label
                        htmlFor="year"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        ชั้นปี
                    </label>

                    <input
                        id="year"
                        type="number"
                        name="year"
                        min="1"
                        max="8"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
                    >
                        บันทึก
                    </button>

                    <a
                        href="/students"
                        className="rounded-md border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        ยกเลิก
                    </a>
                </div>
            </form>
        </main>
    );
}