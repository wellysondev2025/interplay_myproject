export default function Header({ title, onMenuClick }) {
  return (
    <header
      className="
        sticky top-0 z-50
        h-[88px]
        flex items-center
        px-6
        text-white
        shadow-md
      "
      style={{
        background: `
          linear-gradient(
            to right,
            #3B0A45,
            #5A1661,
            #7D3C98
          )
        `,
      }}
    >
      {/* Botão menu mobile */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-2xl mr-4"
      >
        ☰
      </button>

      <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
    </header>
  );
}
