import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Chip} from "@nextui-org/react";

const CardProject = () => {
  return (
    <Card className="max-w-[800px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Projects</p>
          <p className="text-small text-default-500">Security projects, and technical implementations.</p>
        </div>
      </CardHeader>
      <Divider/>
      
      {/* Projects Section */}
      <CardBody>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Security Projects</h3>
          
          <div className="border-l-4 border-secondary pl-4">
            <h4 className="font-semibold">Active Directory VM Lab</h4>
            <p className="text-sm text-default-500 mb-2">
              Demonstrate various types of AD attacks including credential harvesting, 
              lateral movement, and privilege escalation techniques.
            </p>
            <div className="flex gap-2 mb-2">
              <Chip size="sm" variant="flat">Active Directory</Chip>
              <Chip size="sm" variant="flat">Penetration Testing</Chip>
              <Chip size="sm" variant="flat">VMware</Chip>
            </div>
            <Link 
              isExternal 
              showAnchorIcon 
              href="#" 
              className="text-sm"
            >
              View Repository
            </Link>
          </div>
          
          <div className="border-l-4 border-secondary pl-4">
            <h4 className="font-semibold">Portfolio Website</h4>
            <p className="text-sm text-default-500 mb-2">
              Modern portfolio website built with Next.js, NextUI, and TypeScript. 
              Features dark/light theme switching and responsive design.
            </p>
            <div className="flex gap-2 mb-2">
              <Chip size="sm" variant="flat">Next.js</Chip>
              <Chip size="sm" variant="flat">TypeScript</Chip>
              <Chip size="sm" variant="flat">NextUI</Chip>
            </div>
            <Link 
              isExternal 
              showAnchorIcon 
              href="https://github.com/raphaelpang/portfolio-v2" 
              className="text-sm"
            >
              View Repository
            </Link>
          </div>
        </div>
      </CardBody>
      
      <Divider/>
      <CardFooter>
        <Link
          isExternal
          showAnchorIcon
          href="https://github.com/raphaelpang"
        >
          View all projects on GitHub
        </Link>
      </CardFooter>
    </Card>
  )
}

export default CardProject
