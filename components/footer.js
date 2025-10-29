import Container from "@/components/container";
import Image from "next/image";
import Link from "next/link";

export default function Footer(props) {
  return (
    <div className="bg-gray-900 text-white">
      <Container large={true}>
        <div className="py-12 flex flex-col items-start px-8 xl:px-5">
          <Link href="/">
            <Image
              src="/img/diabol-logo-white.png"
              width={150}
              height={30}
              alt="Diabol AI Logo"
              priority={true}
            />
          </Link>
          <div className="flex items-center space-x-4 mt-8">
            <a href="https://twitter.com/diabolai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.21 0-.42-.015-.63.961-.689 1.79-1.55 2.455-2.544z" />
              </svg>
            </a>
            <a href="https://linkedin.com/company/diabolai" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.783-1.75-1.75s.784-1.75 1.75-1.75 1.75.783 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
          <div className="text-sm text-left py-4 mt-8 text-gray-400">
            Copyright © {new Date().getFullYear()} {props?.copyright}. All
            rights reserved.
          </div>
        </div>
      </Container>
    </div>
  );
}
