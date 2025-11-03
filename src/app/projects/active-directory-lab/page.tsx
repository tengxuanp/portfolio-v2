'use client';
import {NextUIProvider} from "@nextui-org/react";
import Navbar from "../../components/Navbar"
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import Link from 'next/link';

export default function ActiveDirectoryLab() {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
    <main className="text-foreground bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="light" className="mb-6">
            ← Back to Home
          </Button>
        </Link>
        
        <Card>
          <CardHeader>
            <h1 className="text-3xl font-bold">🏢 Active Directory Attack Lab</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <p className="text-lg">
                A comprehensive Active Directory environment for practicing penetration testing techniques and attack simulations.
              </p>
              
              <div className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-lg">
                <p className="text-warning-800 dark:text-warning-200">
                  🚧 <strong>Coming Soon:</strong> This project page is under construction. 
                  The full lab documentation and setup guides will be available soon.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">What's Included:</h3>
                <ul className="space-y-2 text-default-600">
                  <li>• Complete domain controller setup (Windows Server 2019)</li>
                  <li>• Multiple client workstations with various vulnerabilities</li>
                  <li>• Pre-configured attack scenarios (Kerberoasting, AS-REP Roasting)</li>
                  <li>• Detailed documentation and attack guides</li>
                  <li>• VMware templates for easy deployment</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">VMware</span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">PowerShell</span>
                  <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm">Bloodhound</span>
                  <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm">Impacket</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
    </NextThemesProvider>
    </NextUIProvider>
  );
}
