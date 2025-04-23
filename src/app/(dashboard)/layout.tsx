

import SimpleNavbar from "@/components/navbar/simple-navbar";
import "../globals.css";
import {tempUser} from "@/components/navbar/simple-navbar";



export async function DashboardLayout({ children,}: Readonly<{ children: React.ReactNode; }>) {
  const tempUser: tempUser = {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "temp@gmail.com",
    phone: "1234567890",
    role: "admin",
    team_id: "1",
  };


  return (
    <>
      <SimpleNavbar user={tempUser} />

      <div className="max-w-screen h-full w-full overflow-hidden flex flex-col px-0 pt-4 lg:pt-16 bg-background2 min-h-screen">
        
        {children}

      </div>
    </>
  )
}

export default DashboardLayout;