import React, { useEffect, useState } from 'react';
import { useProfileData } from '../hooks/useProfileData';
import GameRooms from "./GameRoomList";
import GameRoomTest from "./GameRoomTest";
import WebSocketTest from "./WebSocketTest";
import WSTest from "./WSTest";
import TestEndpoint from "./TestEndpoint";

export default function DashboardOverview() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const t = userStr ? JSON.parse(userStr) : null;
    setUser(t);
  }, []); // Added empty dependency array to run only once

  // Only call useProfileData if user exists
  const { profileData } = useProfileData(user?.id); // Using optional chaining

  const balance = profileData?.balance ?? 0; // Using nullish coalescing
  const rebateBalance = profileData?.rebateBalance ?? 0;;//JSON.stringify(profileData);//profileData?.rebateBalance ?? 0;

  return (
      <div className="p-4">
        {/*<GameRooms />*/}
        {/*<GameRoomTest />*/}
        {/*<WebSocketTest/>*/}
        {/*<TestEndpoint/>*/}
        <WSTest/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Changed to 2 columns */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">잔액</h3>
            <p className="text-3xl font-bold text-blue-600">
              {typeof balance === 'number' ? balance.toLocaleString() : '0'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">딜러비</h3>
            <p className="text-3xl font-bold text-green-600">
              {typeof rebateBalance === 'number' ? rebateBalance.toLocaleString() : '0'}
              {/*{rebateBalance}*/}
            </p>
          </div>
        </div>
      </div>
  );
}
