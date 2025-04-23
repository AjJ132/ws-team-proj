

import SimpleNavbar from "@/components/navbar/simple-navbar";
import "../globals.css";



export async function DashboardLayout({ children,}: Readonly<{ children: React.ReactNode; }>) {


  return (
    <>
      <SimpleNavbar />

      <div className="max-w-screen h-full w-full overflow-hidden flex flex-col px-0 pt-4 lg:pt-16 bg-background2 min-h-screen">
        
        {children}

      </div>
    </>
  )
}

export default DashboardLayout;