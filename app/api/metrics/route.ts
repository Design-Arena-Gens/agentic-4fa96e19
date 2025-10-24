import { NextResponse } from "next/server";
import dayjs from "dayjs";
import { connectMongo, getCycleMetricModel } from "@/lib/db";
import { getCycleStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const dateParam = dayjs().format("YYYY-MM-DD");
  try {
    const conn = await connectMongo();
    const Model = getCycleMetricModel();
    if (conn && Model) {
      const doc = await Model.findOne({ date: dateParam }).lean();
      return NextResponse.json({ cycles: doc?.cycles ?? 0 });
    }
  } catch (error) {
    console.error("Failed to fetch metrics", error);
  }

  const store = getCycleStore();
  return NextResponse.json({ cycles: store[dateParam] ?? 0 });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { cycles, date: userDate } = body;
  const date = userDate || dayjs().format("YYYY-MM-DD");

  if (typeof cycles !== "number" || cycles < 0) {
    return NextResponse.json({ error: "Invalid cycles" }, { status: 400 });
  }

  try {
    const conn = await connectMongo();
    const Model = getCycleMetricModel();
    if (conn && Model) {
      await Model.findOneAndUpdate(
        { date },
        { date, cycles },
        { upsert: true, setDefaultsOnInsert: true }
      );
      return NextResponse.json({ success: true, persisted: true });
    }
  } catch (error) {
    console.error("Failed to persist metrics", error);
  }

  const store = getCycleStore();
  store[date] = cycles;
  return NextResponse.json({ success: true, persisted: false });
}
