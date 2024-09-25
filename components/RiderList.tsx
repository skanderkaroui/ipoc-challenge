import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Rider {
  id: string
  name: string
  capacity: number
  currentOrders: number
  performance: number
}

interface RiderListProps {
  riders: Rider[]
  onReassign: (orderId: string, riderId: string) => void
}

export function RiderList({ riders, onReassign }: RiderListProps) {
  const [selectedRider, setSelectedRider] = useState<string | null>(null)
  const [reassignOrderId, setReassignOrderId] = useState<string>('')

  const handleReassign = () => {
    if (selectedRider && reassignOrderId) {
      onReassign(reassignOrderId, selectedRider)
      setSelectedRider(null)
      setReassignOrderId('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Riders</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {riders.map((rider) => (
            <li key={rider.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{rider.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Capacity: {rider.currentOrders}/{rider.capacity}
                </p>
                <p className="text-sm text-muted-foreground">
                  Performance: {rider.performance.toFixed(1)}
                </p>
              </div>
              <Button
                onClick={() => setSelectedRider(rider.id)}
                variant="outline"
              >
                Select
              </Button>
            </li>
          ))}
        </ul>
        {selectedRider && (
          <div className="mt-4 space-y-2">
            <Input
              type="text"
              placeholder="Enter order ID to reassign"
              value={reassignOrderId}
              onChange={(e) => setReassignOrderId(e.target.value)}
            />
            <Button onClick={handleReassign} className="w-full">
              Reassign Order
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}