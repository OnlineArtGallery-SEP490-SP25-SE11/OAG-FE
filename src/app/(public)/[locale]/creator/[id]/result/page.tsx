"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users,
  Heart,
  Clock,
  Share2,
  Crown,
} from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,

//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar
// } from 'recharts';

export default function ResultPage() {
  const [timeRange, setTimeRange] = useState("7days");
  const isPremium = false; // Replace with actual premium status check

  // Mock data - replace with real data
  const analyticsData = {
    totalVisits: 1234,
    totalLikes: 567,
    totalClicks: 890,
    averageTime: "2:45",
    totalShares: 123,
  };

  // Mock chart data
  // const visitData = [
  //   { date: "Mon", visits: 150 },
  //   { date: "Tue", visits: 230 },
  //   { date: "Wed", visits: 180 },
  //   { date: "Thu", visits: 290 },
  //   { date: "Fri", visits: 200 },
  //   { date: "Sat", visits: 340 },
  //   { date: "Sun", visits: 280 },
  // ];

  // const engagementData = [
  //   { name: "Gallery 1", visits: 400, likes: 240 },
  //   { name: "Gallery 2", visits: 300, likes: 139 },
  //   { name: "Gallery 3", visits: 200, likes: 980 },
  // ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-2">Track your exhibition performance and visitor engagement</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Users className="w-4 h-4" />
            <span>Total Visits</span>
          </div>
          <span className="text-2xl font-bold">{analyticsData.totalVisits}</span>
          <span className="text-green-500 text-sm mt-2">↑ 12% vs last period</span>
        </Card>
        <Card className="p-4 flex flex-col">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Heart className="w-4 h-4" />
            <span>Total Likes</span>
          </div>
          <span className="text-2xl font-bold">{analyticsData.totalLikes}</span>
          <span className="text-green-500 text-sm mt-2">↑ 8% vs last period</span>
        </Card>
        <Card className="p-4 flex flex-col">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Clock className="w-4 h-4" />
            <span>Avg. Time</span>
          </div>
          <span className="text-2xl font-bold">{analyticsData.averageTime}</span>
          <span className="text-green-500 text-sm mt-2">↑ 15% vs last period</span>
        </Card>
        <Card className="p-4 flex flex-col">
          <div className="flex items-center gap-2 text-gray-500 mb-2">
            <Share2 className="w-4 h-4" />
            <span>Shares</span>
          </div>
          <span className="text-2xl font-bold">{analyticsData.totalShares}</span>
          <span className="text-green-500 text-sm mt-2">↑ 5% vs last period</span>
        </Card>
      </div>

      {/* Charts Section */}
      {/* <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Visitor Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={visitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Engagement by Gallery</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8884d8" />
                  <Bar dataKey="likes" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="demographics">
          <Card className="p-6 text-center">
            <Crown className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Premium Feature</h3>
            <p className="text-gray-500 mb-4">
              Unlock detailed visitor demographics, including age groups, locations, and interests.
            </p>
            <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600">
              Upgrade to Premium
            </Button>
          </Card>
        </TabsContent>
      </Tabs> */}

      {/* Exhibition-specific Analytics */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Exhibition Analytics</h2>
        {isPremium ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Add exhibition-specific analytics here */}
          </div>
        ) : (
          <Card className="p-6 text-center bg-gradient-to-r from-purple-50 to-blue-50">
            <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Unlock Exhibition-specific Analytics
            </h3>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Get detailed insights for each exhibition, including visitor flow, artwork engagement,
              and conversion metrics. Upgrade to our premium plan to access these powerful analytics tools.
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Upgrade Now
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}