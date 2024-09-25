// OrderManagement.tsx

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Order {
  id: string
  type: 'direct' | 'shop-and-deliver'
  source: 'Website' | 'Phone' | 'Call'
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Delivered'
  assignedRider?: string
}

interface Rider {
  id: string
  name: string
  currentOrder?: string
}

export function OrderManagement() {
  const [activeTab, setActiveTab] = useState<'Website' | 'Phone' | 'Call'>('Website')
  const [orders, setOrders] = useState<Order[]>([
    // Sample orders
    { id: '1', type: 'direct', source: 'Website', status: 'Pending' },
    { id: '2', type: 'shop-and-deliver', source: 'Phone', status: 'Assigned', assignedRider: 'r1' },
    { id: '3', type: 'direct', source: 'Call', status: 'Delivered' },
    // Add more orders as needed
  ])
  const [riders, setRiders] = useState<Rider[]>([
    // Sample riders
    { id: 'r1', name: 'Alice', currentOrder: '2' },
    { id: 'r2', name: 'Bob' },
    { id: 'r3', name: 'Charlie' },
    // Add more riders as needed
  ])

  const assignOrder = (orderId: string, riderId: string) => {
    // Update the order's status and assigned rider
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'Assigned', assignedRider: riderId } : order
      )
    )
    // Update the rider's current order
    setRiders(prevRiders =>
      prevRiders.map(rider =>
        rider.id === riderId ? { ...rider, currentOrder: orderId } : rider
      )
    )
  }

  const onUpdateStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    )
  }

  return (
    <>
      {/* Order Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="Website">Website</TabsTrigger>
              <TabsTrigger value="Phone">Phone</TabsTrigger>
              <TabsTrigger value="Call">Call</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab}>
              <ul className="space-y-4">
                {orders.filter(order => order.source === activeTab).map(order => (
                  <li key={order.id} className="border-b pb-2">
                    <h3 className="font-medium">Order {order.id}</h3>
                    <p className="text-sm text-muted-foreground">Type: {order.type}</p>
                    <p className="text-sm text-muted-foreground">Status: {order.status}</p>
                    {order.assignedRider && (
                      <p className="text-sm text-muted-foreground">
                        Assigned to: {riders.find(r => r.id === order.assignedRider)?.name}
                      </p>
                    )}
                    <div className="mt-2">
                      <Select
                        onValueChange={(value) => onUpdateStatus(order.id, value as Order['status'])}
                        defaultValue={order.status}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Assigned">Assigned</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Assignment Card */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Order Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {orders.filter(order => order.status === 'Pending').map(order => (
              <li key={order.id} className="border-b pb-2">
                <h3 className="font-medium">Order {order.id}</h3>
                <p className="text-sm text-muted-foreground">Type: {order.type}</p>
                <div className="mt-2 space-y-2">
                  <Select onValueChange={(riderId) => assignOrder(order.id, riderId)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a rider" />
                    </SelectTrigger>
                    <SelectContent>
                      {riders.filter(rider => !rider.currentOrder).map(rider => (
                        <SelectItem key={rider.id} value={rider.id}>
                          {rider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </>
  )
}
