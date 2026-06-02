import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const perfis = db.prepare("SELECT * FROM perfis").all();
  return NextResponse.json(perfis);
}

export async function POST(request: Request) {
  const body = await request.json();
  const stmt = db.prepare("INSERT INTO perfis (nome, descricao) VALUES (?, ?)");
  const result = stmt.run(body.nome, body.descricao);
  return NextResponse.json({ id: result.lastInsertRowid, ...body });
}