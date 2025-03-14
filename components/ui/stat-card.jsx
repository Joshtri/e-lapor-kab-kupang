"use client";

import React from "react";
import { Card } from "flowbite-react";

const StatCard = ({ icon, color, title, value }) => (
  <Card className="flex items-center gap-4 p-6 shadow-md">
    <div className={`text-4xl ${color}`}>{icon}</div>
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </Card>
);

export default StatCard;
