import * as React from "react";
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
} from "./index";

export function DemoPage() {
  return (
    <Container>
      <Stack spacing={8} className="py-12">
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
            
            <Divider />
            
            <Link href="#">Default Link</Link>
            <Link href="#" variant="underlined">Underlined Link</Link>
            <Link href="#" variant="subtle">Subtle Link</Link>
            <Link href="#" variant="nav">Navigation Link</Link>
            
            <Divider />
            
            <Text>
              This is a paragraph with an <Code>inline code</Code> snippet.
            </Text>
            
            <Code variant="block">
              // This is a block of code
              function example() {
                return 'Hello World';
              }
            </Code>
          </Stack>
        </section>
        
        {/* Layout Section */}
        <section>
          <Heading as="h2" size="h2" className="mb-4">
            Layout Components
          </Heading>
          
          <Text className="mb-4">
            Stack Component (vertical):
          </Text>
          <Stack spacing={2} className="bg-primary-50 dark:bg-primary-900 p-4 rounded-md">
            <div className="bg-card p-4 rounded-md">Item 1</div>
            <div className="bg-card p-4 rounded-md">Item 2</div>
            <div className="bg-card p-4 rounded-md">Item 3</div>
          </Stack>
          
          <Text className="mt-6 mb-4">
            Stack Component (horizontal):
          </Text>
          <Stack direction="row" spacing={2} className="bg-primary-50 dark:bg-primary-900 p-4 rounded-md">
            <div className="bg-card p-4 rounded-md">Item 1</div>
            <div className="bg-card p-4 rounded-md">Item 2</div>
            <div className="bg-card p-4 rounded-md">Item 3</div>
          </Stack>
          
          <Text className="mt-6 mb-4">
            Grid Component:
          </Text>
          <Grid columns={3} gap={4} className="bg-primary-50 dark:bg-primary-900 p-4 rounded-md">
            <div className="bg-card p-4 rounded-md">Grid Item 1</div>
            <div className="bg-card p-4 rounded-md">Grid Item 2</div>
            <div className="bg-card p-4 rounded-md">Grid Item 3</div>
            <div className="bg-card p-4 rounded-md">Grid Item 4</div>
            <div className="bg-card p-4 rounded-md">Grid Item 5</div>
            <div className="bg-card p-4 rounded-md">Grid Item 6</div>
          </Grid>
        </section>
        
        {/* Card Section */}
        <section>
          <Heading as="h2" size="h2" className="mb-4">
            Card Components
          </Heading>
          
          <Grid columns={2} gap={6}>
            <Card>
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>This is a default card with standard styling.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Cards are used to group related content and actions. They can contain various components and content types.
                </Text>
              </CardContent>
              <CardFooter align="end">
                <Button variant="secondary">Cancel</Button>
                <Button className="ml-2">Submit</Button>
              </CardFooter>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>This card has elevated styling with more shadow.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Elevated cards stand out more from the page, drawing more attention to their content.
                </Text>
              </CardContent>
              <CardFooter align="end">
                <Button variant="secondary">Cancel</Button>
                <Button className="ml-2">Submit</Button>
              </CardFooter>
            </Card>
            
            <Card variant="outlined">
              <CardHeader>
                <CardTitle>Outlined Card</CardTitle>
                <CardDescription>This card has an outline but no shadow.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Outlined cards are less visually prominent, good for secondary information.
                </Text>
              </CardContent>
              <CardFooter align="end">
                <Button variant="secondary">Cancel</Button>
                <Button className="ml-2">Submit</Button>
              </CardFooter>
            </Card>
            
            <Card variant="filled">
              <CardHeader>
                <CardTitle>Filled Card</CardTitle>
                <CardDescription>This card has a background fill color.</CardDescription>
              </CardHeader>
              <CardContent>
                <Text>
                  Filled cards use a subtle background color to stand out from the page.
                </Text>
              </CardContent>
              <CardFooter align="end">
                <Button variant="secondary">Cancel</Button>
                <Button className="ml-2">Submit</Button>
              </CardFooter>
            </Card>
          </Grid>
        </section>
        
        {/* Button Section */}
        <section>
          <Heading as="h2" size="h2" className="mb-4">
            Button Components
          </Heading>
          
          <Text className="mb-4">Button Variants:</Text>
          <Stack direction="row" spacing={4} className="flex-wrap">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
          </Stack>
          
          <Text className="mt-6 mb-4">Button Sizes:</Text>
          <Stack direction="row" spacing={4} align="center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
            </Button>
          </Stack>
          
          <Text className="mt-6 mb-4">Button States:</Text>
          <Stack direction="row" spacing={4}>
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
            <Button fullWidth className="max-w-xs">Full Width</Button>
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
            <Input placeholder="Small size" size="sm" />
            <Input placeholder="Large size" size="lg" />
            
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
        
        {/* Code Section */}
        <section>
          <Heading as="h2" size="h2" className="mb-4">
            Code Components
          </Heading>
          
          <Stack spacing={8}>
            <CodeBlock
              code={`function welcome(name: string) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to CodeQual.dev, \${name}!\`;
}

// Call the function
const message = welcome('Developer');
console.log(message);`}
              language="typescript"
              title="example.ts"
              highlightLines={[2, 7]}
            />
            
            <DiffViewer
              oldCode={`function calculateTotal(items) {
  let total = 0;
  
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  
  return total;
}`}
              newCode={`function calculateTotal(items) {
  if (!items || !items.length) {
    return 0;
  }
  
  // Use reduce for cleaner code
  return items.reduce((total, item) => {
    return total + (item.price || 0);
  }, 0);
}`}
              filename="calculate.js"
              language="javascript"
            />
          </Stack>
        </section>
      </Stack>
    </Container>
  );
}
