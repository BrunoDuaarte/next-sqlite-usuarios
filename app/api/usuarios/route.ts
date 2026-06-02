import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  const usuarios = db.prepare(`
    SELECT usuarios.id, usuarios.nome, usuarios.email, perfis.nome AS perfil
    FROM usuarios
    INNER JOIN perfis ON usuarios.perfil_id = perfis.id
  `).all();
  return NextResponse.json(usuarios);
}

export async function POST(request: Request) {
  const body = await request.json();
  const stmt = db.prepare(
    "INSERT INTO usuarios (nome, email, senha, perfil_id) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(body.nome, body.email, body.senha, body.perfil_id);
  return NextResponse.json({ id: result.lastInsertRowid, ...body });
}