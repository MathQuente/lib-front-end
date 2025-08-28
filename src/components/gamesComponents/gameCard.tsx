import { useState } from "react";
import { GameModal } from "./gameModal";
import { GameInfo } from "./gameInfo";
import { twMerge } from "tailwind-merge";
import type { GameBase } from "../../types/games";

interface GameCardProps {
  game: GameBase;
  className?: string;
  size?: "small" | "medium" | "larger";
  enableModal?: boolean;
}

export function GameCard({
  game,
  className,
  size = "medium",
  enableModal,
}: GameCardProps) {
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    if (enableModal) {
      setOpen(true);
    }
  };

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const sizes = {
    small: "w-12 h-16 rounded-lg",
    medium:
      "rounded-lg w-44 h-32 sm:w-36 md:w-44 md:h-56 sm:h-40 lg:min-w-28 lg:h-44 xl:w-48 xl:h-52 2xl:w-48 2xl:min-h-64 transition-opacity duration-200 ease-in-out",
    larger:
      "w-40 h-48 lg:w-44 lg:h-52 rounded-lg transition-opacity duration-200 ease-in-out",
  };

  if (size === "small") {
    return (
      <>
        <div className={className}>
          <button
            type="button"
            onClick={handleClick}
            className={`relative transition-all duration-200 ease-in-out rounded-lg transform ${"hover:scale-105 hover:ring-2 hover:ring-purple-500"}`}
          >
            <img
              className={twMerge(sizes[size])}
              src={game?.gameBanner}
              alt={`${game?.gameName} banner`}
            />
          </button>
        </div>
        {enableModal && (
          <GameModal open={open} onOpenChange={setOpen}>
            <GameInfo game={game} onClose={() => setOpen(false)} />
          </GameModal>
        )}
      </>
    );
  }

  return (
    <>
      <div className={className}>
        <button
          type="button"
          onClick={handleClick}
          className={`relative transition-all duration-200 ease-in-out rounded-lg transform ${
            showTooltip
              ? "scale-105 ring-2 ring-purple-500"
              : "scale-100 ring-0"
          }`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {game?.isDlc && (
            <span className="absolute left-2 bg-[#272932] mt-2 px-1.5 py-0.5 rounded-md z-10">
              <p className="text-white text-xs">DLC</p>
            </span>
          )}
          <img
            className={twMerge(
              sizes[size],
              showTooltip ? "opacity-25" : "opacity-100",
            )}
            src={game?.gameBanner}
            alt={`${game?.gameName} banner`}
          />

          {/* Tooltip apenas para tamanho medium */}
          {
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black rounded-lg transition-all duration-200 ease-in-out ${
                showTooltip
                  ? "bg-opacity-60 opacity-100"
                  : "bg-opacity-0 opacity-0 pointer-events-none"
              }`}
            >
              <span
                className={`text-white font-semibold text-center px-2 text-sm md:text-base lg:text-lg drop-shadow-lg transition-all duration-300 ease-in-out transform ${
                  showTooltip
                    ? "translate-y-0 scale-100"
                    : "translate-y-2 scale-95"
                }`}
              >
                {game?.gameName}
              </span>
            </div>
          }
        </button>
      </div>
      {enableModal && (
        <GameModal open={open} onOpenChange={setOpen}>
          <GameInfo game={game} onClose={() => setOpen(false)} />
        </GameModal>
      )}
    </>
  );
}
