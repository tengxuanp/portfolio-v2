'use client';
import {NextUIProvider} from "@nextui-org/react";
import Navbar from "../../components/Navbar"
import {ThemeProvider as NextThemesProvider} from "next-themes";
import { Card, CardHeader, CardBody, Button } from "@nextui-org/react";
import Link from 'next/link';

export default function CertificatesRoom() {
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
            <div className="text-center w-full">
              <h1 className="text-4xl font-bold mb-2">🎓 3D Certificates Room</h1>
              <p className="text-lg text-default-600">Interactive Certificate Showcase</p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-6">
              <div className="text-center">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-8 rounded-2xl mb-6">
                  <div className="text-6xl mb-4">🏛️</div>
                  <h2 className="text-2xl font-bold text-white">Virtual Certificate Gallery</h2>
                </div>
              </div>
              
              <div className="bg-info-50 dark:bg-info-900/20 p-4 rounded-lg">
                <p className="text-info-800 dark:text-info-200">
                  🚧 <strong>Under Development:</strong> The 3D certificate room is currently being built using Three.js and WebGL. 
                  This will provide an immersive way to explore my certifications in a virtual environment.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Planned Features:</h3>
                <ul className="space-y-2 text-default-600">
                  <li>• Interactive 3D gallery with certificate displays</li>
                  <li>• Detailed certificate information on hover/click</li>
                  <li>• Credential verification links</li>
                  <li>• Virtual tour with guided navigation</li>
                  <li>• Mobile-responsive 3D rendering</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Current Certifications:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-success-50 dark:bg-success-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-success-800 dark:text-success-200">✅ Completed</h4>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• Hack The Box CDSA</li>
                      <li>• ISO 27001:2013</li>
                      <li>• ISC2 CC (Certified in Cybersecurity)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-warning-50 dark:bg-warning-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-warning-800 dark:text-warning-200">⏳ In Progress</h4>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• Offsec OSCP (Preparing)</li>
                      <li>• Advanced certifications planned</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Technologies:</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Three.js</span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">WebGL</span>
                  <span className="bg-success/10 text-success px-3 py-1 rounded-full text-sm">React Three Fiber</span>
                  <span className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm">Blender</span>
                </div>
              </div>
              
              <div className="text-center">
                <Link href="/certifications">
                  <Button color="primary" size="lg">
                    View Traditional Certificate Gallery →
                  </Button>
                </Link>
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
