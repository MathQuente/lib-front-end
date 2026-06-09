export function UserInfo({
  userName,
  gamesAmount
}: {
  userName: string
  gamesAmount: number
}) {
  return (
    <div>
      <p className="text-white font-semibold">{userName}</p>
      <p className="text-gray-500 text-sm">
        {gamesAmount.toLocaleString()} {gamesAmount === 1 ? 'jogo' : 'jogos'}
      </p>
    </div>
  )
}
