import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Divider, Link as NextUILink, Image, Button} from "@nextui-org/react";
import Link from 'next/link';
import Bio from '../Bio';
import ProfilePic from '../../assets/profile_pic.jpg';

const CardProfile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Brief Intro Section */}
      <Card className="w-full">
        <CardBody className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome to RafaelRoot's
          </h1>
          <p className="text-lg text-default-600 max-w-2xl mx-auto">
            Cybersecurity Professional | Penetration Tester | CTF Enthusiast
          </p>
          <p className="text-md text-default-500 mt-2">
            Sharing knowledge through writeups, projects, and security research
          </p>
        </CardBody>
      </Card>

      {/* Posts Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Check out my posts</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/posts?category=ctf" className="w-full">
              <Button 
                size="lg" 
                className="w-full h-20 bg-gradient-to-r from-success-500 to-success-600 text-white"
                startContent={<span className="text-2xl">🏴‍☠️</span>}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">CTF Writeups</span>
                  <span className="text-sm opacity-90">HackTheBox, OSCP, AD Attacks</span>
                </div>
              </Button>
            </Link>
            
            <Link href="/posts?category=flipper" className="w-full">
              <Button 
                size="lg" 
                className="w-full h-20 bg-gradient-to-r from-warning-500 to-warning-600 text-white"
                startContent={<span className="text-2xl">🐬</span>}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">Flipper Zero</span>
                  <span className="text-sm opacity-90">Hardware Hacking, RF, NFC</span>
                </div>
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>

      {/* Latest Project Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold">Check out my latest project</h2>
        </CardHeader>
        <CardBody>
          <Link href="/projects/active-directory-lab" className="w-full">
            <Button 
              size="lg" 
              className="w-full h-24 bg-gradient-to-r from-primary-500 to-primary-600 text-white"
              startContent={<span className="text-3xl">🏢</span>}
            >
              <div className="flex flex-col">
                <span className="font-bold text-xl">Active Directory Lab</span>
                <span className="text-sm opacity-90">Complete AD attack simulation environment</span>
                <span className="text-xs opacity-80">VMware • PowerShell • Bloodhound</span>
              </div>
            </Button>
          </Link>
        </CardBody>
      </Card>

      {/* Certificates Section */}
      <Card className="w-full">
        <CardHeader>
          <h2 className="text-2xl font-semibold">My collection of certificates</h2>
        </CardHeader>
        <CardBody>
          <Link href="/certifications/3d-room" className="w-full">
            <Button 
              size="lg" 
              className="w-full h-24 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white"
              startContent={<span className="text-3xl">🎓</span>}
            >
              <div className="flex flex-col">
                <span className="font-bold text-xl">Enter 3D Room</span>
                <span className="text-sm opacity-90">Interactive certificate showcase</span>
                <span className="text-xs opacity-80">CDSA • ISO 27001 • ISC2 CC • OSCP (In Progress)</span>
              </div>
            </Button>
          </Link>
        </CardBody>
      </Card>

      {/* Footer */}
      <div className="text-center py-4">
        <NextUILink
          isExternal
          showAnchorIcon
          href="https://github.com/raphaelpang/portfolio-v2"
          className="text-default-500 hover:text-primary"
        >
          View source code on GitHub
        </NextUILink>
      </div>
    </div>
  )
}

export default CardProfile