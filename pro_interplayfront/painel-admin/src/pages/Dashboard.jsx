import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { useState } from "react"

export default function DashboardLayout({ title, children }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#f4f4f4]"> {/* fundo neutro */}

      {/* Sidebar */}
      <Sidebar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Área principal */}
      <div className="flex-1 flex flex-col">

        {/* Header fixo */}
        <Header title={title} onMenuClick={() => setMenuOpen(true)} />

        {/* Conteúdo */}
        <main
          className="flex-1 p-6 pt-[88px] relative overflow-y-auto" // padding-top = altura do header
          style={{
            backgroundImage: "none", // removi imagem pra não conflitar com os cards
          }}
        >
          {/* Conteúdo real */}
          <div className="relative z-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
