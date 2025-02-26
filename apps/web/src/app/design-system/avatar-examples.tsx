import React from "react";
import { Avatar } from "@/components/ui";
import { Heading } from "@/components/ui";

interface AvatarExamplesProps {
  className?: string;
}

export const AvatarExamples: React.FC<AvatarExamplesProps> = ({ className }) => {
  return (
    <div className={className}>
      <Heading as="h4" size="h4" className="mb-4">Avatar Variants</Heading>
      <div className="flex flex-row flex-wrap gap-8 mb-8 justify-around">
        <div className="flex flex-col items-center gap-3">
          <Avatar size="xl" useLogo />
          <span className="text-sm font-medium">Logo Avatar</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar size="xl" alt="John Doe" />
          <span className="text-sm font-medium">Initials</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar 
            size="xl" 
            src="/images/avatar-example.svg" 
            alt="John Doe" 
            fallback={<span>JD</span>}
          />
          <span className="text-sm font-medium">SVG Image</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar 
            size="xl" 
            alt="John Doe" 
            fallback={<span className="text-lg">JD</span>}
          />
          <span className="text-sm font-medium">Custom Fallback</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar size="xl" ring="md" ringColor="accent" useLogo />
          <span className="text-sm font-medium">With Ring</span>
        </div>
      </div>
      
      <Heading as="h4" size="h4" className="mb-4">Avatar Sizes</Heading>
      <div className="flex flex-row flex-wrap items-end gap-6 mb-4 justify-around">
        <div className="flex flex-col items-center gap-3">
          <Avatar size="xs" useLogo />
          <span className="text-sm font-medium">XS</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar size="sm" useLogo />
          <span className="text-sm font-medium">SM</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar size="md" useLogo />
          <span className="text-sm font-medium">MD</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar size="lg" useLogo />
          <span className="text-sm font-medium">LG</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar size="xl" useLogo />
          <span className="text-sm font-medium">XL</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Avatar size="2xl" useLogo />
          <span className="text-sm font-medium">2XL</span>
        </div>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-md mt-8">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          <strong>Developer Note:</strong> Click on any avatar to see debugging information in the browser console.
          This may help identify any memory or rendering issues that occur on first click.
        </p>
        <div className="flex gap-4">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              // Force a refresh of the component
              window.location.reload();
            }}
          >
            Refresh Page
          </button>
          <button 
            className="px-4 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
            Open Console (F12)
          </button>
        </div>
      </div>
    </div>
  );
};
