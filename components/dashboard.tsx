"use client"

import { useState, useEffect } from 'react'
import { RiderList } from '@/components/RiderList'
import { OrderManagement } from '@/components/OrderManagement'
import { NotificationSystem } from '@/components/NotificationSystem'
import { MapComponent } from '@/components/MapComponent'

// Mock data and types
interface Rider {
  id: string
  name: string
  location: { lat: number; lng: number }
  capacity: number
  currentOrders: number
  performance: number
}

interface Order {
  id: string
  type: 'direct' | 'shop-and-deliver'
  status: 'pending' | 'assigned' | 'in-progress' | 'delivered'
  location: { lat: number; lng: number }
  assignedRider?: string
}

const mockRiders: Rider[] = [
  { id: '1', name: 'Kwame Adu', location: { lat: 5.6037, lng: -0.1870 }, capacity: 5, currentOrders: 2, performance: 4.5 },
  { id: '2', name: 'Ama Serwaa', location: { lat: 5.6142, lng: -0.2073 }, capacity: 3, currentOrders: 1, performance: 4.8 },
]

const mockOrders: Order[] = [
  { id: '1', type: 'direct', status: 'pending', location: { lat: 5.6219, lng: -0.1733 } },
  { id: '2', type: 'shop-and-deliver', status: 'assigned', location: { lat: 5.5913, lng: -0.2087 }, assignedRider: '1' },
]

export function Dashboard() {
  const [riders, setRiders] = useState<Rider[]>(mockRiders)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [error, setError] = useState<string | null>(null)

  const assignRider = (orderId: string, riderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'assigned', assignedRider: riderId } : order
      )
    )
    setRiders(prevRiders =>
      prevRiders.map(rider =>
        rider.id === riderId ? { ...rider, currentOrders: rider.currentOrders + 1 } : rider
      )
    )
  }

  const reassignRider = (orderId: string, newRiderId: string) => {
    const order = orders.find(o => o.id === orderId)
    if (order && order.assignedRider) {
      setRiders(prevRiders =>
        prevRiders.map(rider =>
          rider.id === order.assignedRider ? { ...rider, currentOrders: rider.currentOrders - 1 } :
          rider.id === newRiderId ? { ...rider, currentOrders: rider.currentOrders + 1 } : rider
        )
      )
    }
    assignRider(orderId, newRiderId)
  }

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    )
  }

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRiders(prevRiders =>
        prevRiders.map(rider => ({
          ...rider,
          location: {
            lat: rider.location.lat + (Math.random() - 0.5) * 0.001,
            lng: rider.location.lng + (Math.random() - 0.5) * 0.001,
          },
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-orange-600 text-white p-4">
        <h1 className="text-2xl font-bold">Mealex & Mailex Admin Delivery Management Dashboard</h1>
      </header>
      <main className="flex-grow flex">
        <div className="w-2/3 p-4">
          <MapComponent riders={riders} orders={orders} />
        </div>
        <div className="w-1/3 p-4 space-y-4">
          <RiderList riders={riders} onReassign={reassignRider} />
          <OrderManagement
            orders={orders}
            riders={riders}
            onAssign={assignRider}
            onReassign={reassignRider}
            onUpdateStatus={updateOrderStatus}
          />
        </div>
      </main>
      <NotificationSystem riders={riders} orders={orders} />
    </div>
  )
}