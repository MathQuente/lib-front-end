import { Star } from 'lucide-react'
import { useState } from 'react'
import { Bar, Cell, ResponsiveContainer, Tooltip, BarChart } from 'recharts'
import type { GameResponse } from '../types/games'
import { useRating } from '../hooks/useRating'

interface RatingChartProps {
  GameResponse: GameResponse
}

export function RatingChart({ GameResponse }: RatingChartProps) {
  const { allRatingsResponse } = useRating(GameResponse.game.id)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!allRatingsResponse) {
    return null
  }

  const allRatings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  const totalRating = allRatingsResponse?.reduce(
    (sum, rating) => sum + rating._count.value,
    0
  )
  const ratings = Object.fromEntries(
    allRatingsResponse?.map(rating => [rating.value, rating._count.value])
  )

  const chartData = allRatings.map(ratingValue => {
    const count = ratings[ratingValue] || 0.0

    return {
      stars: ratingValue,
      count,
      label: `${ratingValue}`,
      percentage:
        totalRating > 0 ? ((count / totalRating) * 100).toFixed(0) : '0.0'
    }
  })

  return (
    <div className="h-24">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <Tooltip
            cursor={false}
            content={({ active, payload }) => {
              if (!active || !payload || !payload[0]) return null

              const data = payload[0].payload
              return (
                <div className="bg-[#272932] flex items-center gap-1 p-2 rounded ">
                  <p className="text-gray-300">
                    {data.count === 0.01 ? '0' : data.count}
                  </p>
                  <hr className="w-0.5 h-4 bg-white" />
                  <span className="flex items-center">
                    <p className="text-gray-300">{data.stars}</p>
                    <Star className="w-4 h-4 text-gray-300" />
                  </span>
                  <p className="text-gray-300">
                    Ratings ({`${data.percentage}%`})
                  </p>
                </div>
              )
            }}
          />
          <Bar dataKey="count" barSize={23} radius={4} minPointSize={1}>
            {chartData.map(entry => (
              <Cell
                key={`cell-${entry.stars}`}
                fill={hoveredIndex === entry.stars ? '#5D2A8A' : '#7A38CA'}
                onMouseEnter={() => setHoveredIndex(entry.stars)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
