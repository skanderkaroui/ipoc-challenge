"use client"

import { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapComponentProps {
  riders: Array<{
    id: string
    name: string
    location: { lat: number; lng: number }
  }>
  orders: Array<{
    id: string
    location: { lat: number; lng: number }
    status: string
  }>
}

export function MapComponent({ riders, orders }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const googleMapRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<{ [key: string]: google.maps.Marker }>({})

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      version: "weekly",
    })

    loader.load().then(() => {
      if (mapRef.current && !googleMapRef.current) {
        googleMapRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: 5.6037, lng: -0.1870 }, // Accra, Ghana
          zoom: 12,
        })
      }
    })
  }, [])

  useEffect(() => {
    if (googleMapRef.current) {
      // Update rider markers
      riders.forEach((rider) => {
        if (markersRef.current[`rider-${rider.id}`]) {
          markersRef.current[`rider-${rider.id}`].setPosition(rider.location)
        } else {
          markersRef.current[`rider-${rider.id}`] = new google.maps.Marker({
            position: rider.location,
            map: googleMapRef.current,
            title: rider.name,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            },
          })
        }
      })

      // Update order markers
      orders.forEach((order) => {
        if (markersRef.current[`order-${order.id}`]) {
          markersRef.current[`order-${order.id}`].setPosition(order.location)
        } else {
          markersRef.current[`order-${order.id}`] = new google.maps.Marker({
            position: order.location,
            map: googleMapRef.current,
            title: `Order ${order.id} (${order.status})`,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            },
          })
        }
      })
    }
  }, [riders, orders])

  return <div ref={mapRef} className="w-full h-full" />
}