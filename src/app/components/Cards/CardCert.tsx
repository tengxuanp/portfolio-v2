import React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import cdsa from '../../assets/cdsa.jpg'
import ImageModal from '../ImageModal';

const CardProfile = () => {
  return (
    <Card className="max-w-[800px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">Certifications</p>
          <p className="text-small text-default-500">These are the certifications I acquired.</p>
        </div>
      </CardHeader>
      <Divider/>
      <CardBody>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Hack The Box CDSA (Certified Defensive Security Analyst)</h3>
            <ImageModal 
              src={cdsa.src} 
              alt="CDSA" 
              action="Check credibility on Credly" 
              link="https://www.credly.com/earner/earned/badge/bf0e2272-6829-42c8-90fd-70dec5857aec" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">ISO 27001:2013</h3>
            <p className="text-sm text-default-500">Information Security Management Systems</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">ISC2 CC (Certified in Cybersecurity)</h3>
            <p className="text-sm text-default-500">Entry-level cybersecurity certification</p>
          </div>
        </div>
      </CardBody>
      <Divider/>
      <CardBody>
        <div>
          <h3 className="text-lg font-semibold mb-2">Currently Preparing For:</h3>
          <div className="bg-default-100 p-3 rounded-lg">
            <h4 className="font-semibold">Offsec OSCP</h4>
            <p className="text-sm text-default-500">Offensive Security Certified Professional</p>
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
          View my GitHub profile.
        </Link>
      </CardFooter>
    </Card>
  )
}

export default CardProfile