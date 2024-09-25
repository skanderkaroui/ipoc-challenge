import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Rider {
  id: string
  name: string
}

interface Order {
  id: string
  status: string
  assignedRider?: string
}

interface NotificationSystemProps {
  riders: Rider[]
  orders: Order[]
}

export function NotificationSystem({ riders, orders }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<string[]>([])

  useEffect(() => {
    // Check for new assignments or status changes
    orders.forEach(order => {
      if (order.assignedRider) {
        const rider = riders.find(r => r.id === order.assignedRider)
        if (rider) {
          setNotifications(prev => [
            `Rider ${rider.name} assigned to Order ${order.id}`,
            ...prev.slice(0, 4) // Keep only the last 5 notifications
          ])
        }
      }
      setNotifications(prev => [
        `Order ${order.id} status updated to ${order.status}`,
        ...prev.slice(0, 4)
      ])
    })
  }, [orders, riders])

  return (
    <Card className="fixed bottom-4 right-4 w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {notifications.map((notification, index) => (
            <li key={index} className="text-sm py-1 border-b">
              {notification}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}