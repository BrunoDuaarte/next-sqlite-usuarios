'use client';
import { useEffect, useState } from 'react';

type Usuario = { id: number; nome: string; email: string; perfil: string };
type Perfil = { id: number; nome: string; descricao: string; criado_em: string };

const avatarColors = ['bg-blue-100 text-blue-800','bg-teal-100 text-teal-800','bg-purple-100 text-purple-800'];
const perfilColors: Record<string,string> = {
  Administrador: 'bg-orange-100 text-orange-800',
  Professor: 'bg-blue-100 text-blue-800',
  Aluno: 'bg-green-100 text-green-800',
};

function initials(nome: string) {
  return nome.split(' ').slice(0,2).map(n=>n[0]).join('').toUpperCase();
}

export default function Home() {
  const [tab, setTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [novoPerfil, setNovoPerfil] = useState('1');
  const [novoPerfilNome, setNovoPerfilNome] = useState('');
  const [novoPerfilDesc, setNovoPerfilDesc] = useState('');

  async function loadUsuarios() {
    setLoading(true);
    const r = await fetch('/api/usuarios');
    setUsuarios(await r.json());
    setLoading(false);
  }

  async function loadPerfis() {
    setLoading(true);
    const r = await fetch('/api/perfis');
    setPerfis(await r.json());
    setLoading(false);
  }

  useEffect(() => { loadUsuarios(); loadPerfis(); }, []);

  async function cadastrarUsuario() {
    if (!novoNome || !novoEmail || !novaSenha) { setMsg('Preencha todos os campos.'); return; }
    const r = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoNome, email: novoEmail, senha: novaSenha, perfil_id: parseInt(novoPerfil) }),
    });
    const data = await r.json();
    setMsg(`✅ Usuário cadastrado! ID: ${data.id}`);
    setNovoNome(''); setNovoEmail(''); setNovaSenha('');
    loadUsuarios();
  }

  async function cadastrarPerfil() {
    if (!novoPerfilNome) { setMsg('Informe o nome do perfil.'); return; }
    const r = await fetch('/api/perfis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: novoPerfilNome, descricao: novoPerfilDesc }),
    });
    const data = await r.json();
    setMsg(`✅ Perfil cadastrado! ID: ${data.id}`);
    setNovoPerfilNome(''); setNovoPerfilDesc('');
    loadPerfis();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">📊 API Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">next-sqlite-usuarios · Next.js · SQLite · TypeScript</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Usuários', value: usuarios.length, sub: 'cadastrados' },
            { label: 'Perfis', value: perfis.length, sub: 'disponíveis' },
            { label: 'Banco', value: 'SQLite', sub: 'app.db local' },
            { label: 'Status', value: '🟢 Online', sub: 'porta 3000' },
          ].map(m => (
            <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs text-gray-400 mb-1">{m.label}</p>
              <p className="text-2xl font-semibold text-gray-800">{m.value}</p>
              <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {['usuarios','perfis','cadastrar'].map(t => (
            <button key={t} onClick={() => { setTab(t); setMsg(''); }}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab===t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {{ usuarios:'👥 Usuários', perfis:'🛡️ Perfis', cadastrar:'➕ Cadastrar' }[t]}
            </button>
          ))}
        </div>

        {/* Tab Usuários */}
        {tab === 'usuarios' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Lista de usuários</span>
              <button onClick={loadUsuarios} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1 border border-gray-200 rounded-lg">↻ Atualizar</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <tr><th className="px-4 py-3 text-left">Usuário</th><th className="px-4 py-3 text-left">Perfil</th><th className="px-4 py-3 text-left">Status</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-8 text-gray-300">Carregando...</td></tr>
                ) : usuarios.map((u, i) => (
                  <tr key={u.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${avatarColors[i%3]}`}>{initials(u.nome)}</div>
                        <div>
                          <p className="font-medium text-gray-800">{u.nome}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${perfilColors[u.perfil] || 'bg-gray-100 text-gray-600'}`}>{u.perfil}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">🟢 Ativo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Perfis */}
        {tab === 'perfis' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-700">Lista de perfis</span>
              <button onClick={loadPerfis} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1 border border-gray-200 rounded-lg">↻ Atualizar</button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
                <tr><th className="px-4 py-3 text-left">ID</th><th className="px-4 py-3 text-left">Nome</th><th className="px-4 py-3 text-left">Descrição</th><th className="px-4 py-3 text-left">Criado em</th></tr>
              </thead>
              <tbody>
                {perfis.map(p => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">#{p.id}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${perfilColors[p.nome] || 'bg-gray-100 text-gray-600'}`}>{p.nome}</span></td>
                    <td className="px-4 py-3 text-gray-500">{p.descricao}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{p.criado_em?.substring(0,16) || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Cadastrar */}
        {tab === 'cadastrar' && (
          <div className="flex flex-col gap-6">
            {msg && <p className="text-sm text-green-600 bg-green-50 px-4 py-2 rounded-lg">{msg}</p>}

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Novo usuário</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs text-gray-400 block mb-1">Nome</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={novoNome} onChange={e=>setNovoNome(e.target.value)} placeholder="Ana Silva" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">E-mail</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={novoEmail} onChange={e=>setNovoEmail(e.target.value)} placeholder="ana@email.com" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Senha</label><input type="password" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={novaSenha} onChange={e=>setNovaSenha(e.target.value)} placeholder="••••••" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Perfil</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={novoPerfil} onChange={e=>setNovoPerfil(e.target.value)}>
                    {perfis.map(p=><option key={p.id} value={p.id}>{p.nome}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={cadastrarUsuario} className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">+ Cadastrar usuário</button>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-sm font-medium text-gray-700 mb-4">Novo perfil</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><label className="text-xs text-gray-400 block mb-1">Nome do perfil</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={novoPerfilNome} onChange={e=>setNovoPerfilNome(e.target.value)} placeholder="Coordenador" /></div>
                <div><label className="text-xs text-gray-400 block mb-1">Descrição</label><input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" value={novoPerfilDesc} onChange={e=>setNovoPerfilDesc(e.target.value)} placeholder="Acesso intermediário" /></div>
              </div>
              <button onClick={cadastrarPerfil} className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">+ Cadastrar perfil</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
