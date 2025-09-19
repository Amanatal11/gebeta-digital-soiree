import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="ethiopian-pattern min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col justify-between group/design-root overflow-x-hidden text-[var(--text-color)]">
        <main className="flex flex-col items-center justify-center flex-grow px-6 pt-8 text-center">
          <div className="mb-6">
            <img
              alt="Gebeta App Logo"
              className="h-40 w-40 object-contain rounded-full shadow-lg border-4 border-white"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeLcFuWTsM-9SqqRH5KJeUCDZZnSMKcfH1m8-74_jjO8ozGpKWIdFANgyZBYsgeomM5ddSPttqw3gkKOsIPOfbUiEHOj7R6sdv7b_XOYk9-4ZFHF5t3J_39zt13aiyodjHwVklwk9EtW8gt5M-NN4GW7MkvQoufF2cnd1TCEcSvdgE0has0vCXxRi87kwEfGPOb8uViTYvqG2_Ajxj7hsSpD9LbrkiTsaBbFFcq1ot_q554HbiBKjWd4HLfQsbLCdOYWOjDVPeyFI4"
            />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-color)]">Gebeta</h1>
          <p className="mt-3 text-lg text-[var(--subtle-text)] max-w-xs mx-auto">The ancient game of strategy and skill, reimagined.</p>
          <div className="w-full max-w-sm mt-12 space-y-4">
            <Button
              onClick={() => navigate("/game")}
              className="w-full h-14 text-lg font-bold"
              size="lg"
            >
              Start New Game
            </Button>
            <Button
              onClick={() => navigate("/game?continue=1")}
              className="w-full h-14 text-lg font-bold"
              size="lg"
              variant="outline"
            >
              Continue Game
            </Button>
          </div>
          <div className="flex-grow"></div>
        </main>
        <footer className="sticky bottom-0 bg-[var(--card-bg)]/80 backdrop-blur-lg border-t border-gray-200/50 shadow-t-sm">
          <nav className="flex justify-around items-center px-4 py-2">
            <Link className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-[var(--primary-color)]" to="/">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
              <span className="text-xs font-semibold">Home</span>
            </Link>
            <Link className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-[var(--subtle-text)] hover:text-[var(--primary-color)] transition-colors" to="/game">
              <span className="material-symbols-outlined">add_box</span>
              <span className="text-xs font-medium">New Game</span>
            </Link>
            <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-[var(--subtle-text)] hover:text-[var(--primary-color)] transition-colors" href="#">
              <span className="material-symbols-outlined">leaderboard</span>
              <span className="text-xs font-medium">Leaderboard</span>
            </a>
            <a className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg text-[var(--subtle-text)] hover:text-[var(--primary-color)] transition-colors" href="#">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-xs font-medium">Settings</span>
            </a>
          </nav>
          <div className="h-safe-area-bottom bg-[var(--card-bg)]/80"></div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
