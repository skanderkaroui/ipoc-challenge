import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
  id: string
  type: 'direct' | 'shop-and-deliver'
  status: 'pending' | 'assigned' | 'in-progress' | 'delivered'
  assignedRider?: string
}

interface Rider {
  id: string
  name: string
}

interface OrderManagementProps {
  orders: Order[]
  riders: Rider[]
  onAssign: (orderId: string, riderId: string) => void
  onReassign: (orderId: string, newRiderId: string) => void
  onUpdateStatus: (orderId: string, status: Order['status']) => void
}

export function OrderManagement({ orders, riders, onAssign, onReassign, onUpdateStatus }: OrderManagementProps) {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [selectedRider, setSelectedRider] = useState<string | null>(null)

  const handleAssign = () => {
    if (selectedOrder && selectedRider) {
      const order = orders.find(o => o.id === selectedOrder)
      if (order?.assignedRider) {
        onReassign(selectedOrder, selectedRider)
      } else {
        onAssign(selectedOrder, selectedRider)
      }
      setSelectedOrder(null)
      setSelectedRider(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border-b pb-2">
              <h3 className="font-medium">Order {order.id}</h3>
              <p className="text-sm text-muted-foreground">Type: {order.type}</p>
              <p className="text-sm text-muted-foreground">Status: {order.status}</p>
              {order.assignedRider && (
                <p className="text-sm text-muted-foreground">
                  Assigned to: {riders.find(r => r.id === order.assignedRider)?.name}
                </p>
              )}
              <div className="mt-2 space-x-2">
                <Button
                  onClick={() => setSelectedOrder(order.id)}
                  variant="outline"
                  size="sm"
                >
                  {order.assignedRider ? 'Reassign' : 'Assign'}
                </Button>
                <Select
                  onValueChange={(value) => onUpdateStatus(order.id, value as Order['status'])}
                  defaultValue={order.status}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </li>
          ))}
        </ul>
        {selectedOrder && (
          <div className="mt-4 space-y-2">
            <Select onValueChange={setSelectedRider}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a rider" />
              </SelectTrigger>
              <SelectContent>
                {riders.map((rider) => (
                  <SelectItem key={rider.id} value={rider.id}>
                    {rider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAssign} className="w-full">
              {orders.find(o => o.id === selectedOrder)?.assignedRider ? 'Reassign' : 'Assign'} Order
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}