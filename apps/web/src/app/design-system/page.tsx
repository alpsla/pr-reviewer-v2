"use client";

import React from "react";
import { LayoutExample } from "./layout-example";
import { AvatarExamples } from "./avatar-examples";
import {
  Container,
  Stack,
  Grid,
  Divider,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Heading,
  Text,
  Link,
  Code,
  CodeBlock,
  DiffViewer,
  Logo,
  LogoIcon,
  VideoPlayer,
  Slideshow,
  Avatar,
} from "@/components/ui";

export default function DesignSystemPage() {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl">
      <Stack spacing={8} className="py-12">
        {/* Brand Section */}
        <section>
          <Heading as="h2" size="h2" className="mb-4">
            Brand Components
          </Heading>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Logo</CardTitle>
              <CardDescription>
                The CodeQual.dev logo used for brand identity across the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-md flex flex-col items-center justify-center mb-6">
                <Logo size="3xl" withText={false} greenCheckmark />
              </div>
              
              <Heading as="h4" size="h4" className="mb-4">Logo Sizes</Heading>
              <Stack direction="row" spacing={4} align="center" className="mb-6">
                <div className="flex flex-col items-center">
                  <LogoIcon size="xs" greenCheckmark />
                  <Text size="sm" className="mt-2">XS</Text>
                </div>
                <div className="flex flex-col items-center">
                  <LogoIcon size="sm" greenCheckmark />
                  <Text size="sm" className="mt-2">SM</Text>
                </div>
                <div className="flex flex-col items-center">
                  <LogoIcon size="md" greenCheckmark />
                  <Text size="sm" className="mt-2">MD</Text>
                </div>
                <div className="flex flex-col items-center">
                  <LogoIcon size="lg" greenCheckmark />
                  <Text size="sm" className="mt-2">LG</Text>
                </div>
                <div className="flex flex-col items-center">
                  <LogoIcon size="xl" greenCheckmark />
                  <Text size="sm" className="mt-2">XL</Text>
                </div>
                <div className="flex flex-col items-center">
                  <LogoIcon size="2xl" greenCheckmark />
                  <Text size="sm" className="mt-2">2XL</Text>
                </div>
              </Stack>
              
              <Heading as="h4" size="h4" className="mb-4">Logo with Text</Heading>
              <Stack direction="row" spacing={6} wrap className="mb-6">
                <Logo size="md" withText textPosition="right" greenCheckmark />
                <Logo size="md" withText textPosition="bottom" greenCheckmark />
              </Stack>
              
              <Heading as="h4" size="h4" className="mb-4">Logo Color Variants</Heading>
              <Stack direction="row" spacing={6} wrap className="mb-6">
                <div className="flex flex-col items-center">
                  <LogoIcon size="lg" greenCheckmark />
                  <Text size="sm" className="mt-2">Green Checkmark</Text>
                </div>
                <div className="flex flex-col items-center">
                  <LogoIcon size="lg" greenCheckmark={false} />
                  <Text size="sm" className="mt-2">Default Checkmark</Text>
                </div>
              </Stack>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>
                User avatars with support for images, initials, and logo fallback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarExamples />
            </CardContent>
          </Card>
        </section>
        
        <Divider className="my-8" />

        {/* Typography Section */}
        <section>
          <Heading as="h1" size="h1">
            CodeQual.dev Design System
          </Heading>
          <Text size="lg" className="mt-2">
            This page demonstrates the base components for the PR Reviewer application.
          </Text>
          
          <Divider className="my-8" />
          
          <Heading as="h2" size="h2" className="mb-4">
            Typography
          </Heading>
          
          <Stack spacing={4}>
            <Heading as="h1" size="h1">Heading 1</Heading>
            <Heading as="h2" size="h2">Heading 2</Heading>
            <Heading as="h3" size="h3">Heading 3</Heading>
            <Heading as="h4" size="h4">Heading 4</Heading>
            <Heading as="h5" size="h5">Heading 5</Heading>
            <Heading as="h6" size="h6">Heading 6</Heading>
            
            <Divider />
            
            <Text size="xl">Extra Large Text</Text>
            <Text size="lg">Large Text</Text>
            <Text size="base">Base Text</Text>
            <Text size="sm">Small Text</Text>
            <Text size="xs">Extra Small Text</Text>
            
            <Divider />
            
            <Text variant="default">Default Text</Text>
            <Text variant="muted">Muted Text</Text>
            <Text variant="accent">Accent Text</Text>
            <Text variant="success">Success Text</Text>
            <Text variant="warning">Warning Text</Text>
            <Text variant="error">Error Text</Text>
          </Stack>
        </section>

        {/* Input Section */}
        <section>
          <Heading as="h2" size="h2" className="mb-4">
            Input Components
          </Heading>
          
          <Stack spacing={4}>
            <Input placeholder="Default input" />
            <Input placeholder="Filled input" variant="filled" />
            <Input placeholder="Flushed input" variant="flushed" />
            <Input placeholder="Outlined input" variant="outlined" />
            
            <Divider />
            
            <Input placeholder="Default size" />
            <Input placeholder="Small size" inputSize="sm" />
            <Input placeholder="Large size" inputSize="lg" />
            
            <Divider />
            
            <Input placeholder="With left element" leftElement={
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor"></path>
              </svg>
            } />
            
            <Input placeholder="With right element" rightElement={
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor"></path>
              </svg>
            } />
            
            <Divider />
            
            <Input placeholder="Default status" />
            <Input placeholder="Error status" status="error" />
            <Input placeholder="Success status" status="success" />
          </Stack>
        </section>
        
        {/* Media Components Section */}
        <section>
          <Heading as="h2" size="h2" className="mb-4">
            Media Components
          </Heading>
          
          <Stack spacing={8}>
            <Card>
              <CardHeader>
                <CardTitle>Video Player</CardTitle>
                <CardDescription>Embed YouTube, Vimeo or local videos with customizable controls.</CardDescription>
              </CardHeader>
              <CardContent>
                <Heading as="h4" size="h4" className="mb-4">YouTube Embed</Heading>
                <VideoPlayer 
                  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                  type="youtube"
                  title="YouTube Example"
                  controls={true}
                  size="md"
                  ratio="16:9"
                  className="mb-6"
                />

                <Heading as="h4" size="h4" className="mb-4">Slideshow/Carousel</Heading>
                <Slideshow
                  slides={[
                    {
                      title: "Step 1: Connect Your Repository",
                      description: "Integrate with GitHub or GitLab to analyze your code.",
                      imageSrc: "/api/placeholder/800/450"
                    },
                    {
                      title: "Step 2: Select a Pull Request",
                      description: "Choose which PR you want to analyze for code quality.",
                      imageSrc: "/api/placeholder/800/450"
                    },
                    {
                      title: "Step 3: Review AI Analysis",
                      description: "Get detailed feedback on code quality, performance, and security.",
                      imageSrc: "/api/placeholder/800/450"
                    },
                    {
                      title: "Step 4: Apply Suggestions",
                      description: "Implement AI recommendations to improve your code.",
                      imageSrc: "/api/placeholder/800/450"
                    },
                  ]}
                  showDots={true}
                  showArrows={true}
                  showProgress={true}
                  loop={true}
                  size="md"
                  ratio="16:9"
                />
              </CardContent>
            </Card>
          </Stack>
        </section>
        
        {/* Layout Example Section */}
        <section>
          <Heading as="h2" size="h2" className="mb-4">
            Layout Example
          </Heading>
          
          <Text className="mb-6">
            Below is an example of how to use the design system components to create a complete layout,
            incorporating the CodeQual.dev logo and branding.
          </Text>
          
          <div className="border rounded-lg overflow-hidden">
            <LayoutExample />
          </div>
        </section>
      </Stack>
    </div>
  );
}
