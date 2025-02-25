# Supported Languages

This document lists all programming languages supported by the PR Reviewer, along with their associated file extensions, frameworks, and build tools.

## Language Categories

### Web Development
- **TypeScript** (`.ts`, `.tsx`)
  - Frameworks: React, Next.js, Angular, NestJS, Vue.js, Deno, Remix, Gatsby
  - Build Tools: tsc, webpack, vite, esbuild, swc
- **JavaScript** (`.js`, `.jsx`, `.mjs`)
  - Frameworks: React, Vue.js, Express, Node.js, Svelte, Electron, Preact, Gatsby
  - Build Tools: webpack, babel, vite, rollup, parcel
- **PHP** (`.php`)
  - Frameworks: Laravel, Symfony, CodeIgniter, WordPress, Drupal, Yii
  - Build Tools: composer, phpunit, phing, deployer

### Data Science and AI/ML
- **Python** (`.py`, `.pyw`)
  - Frameworks: Django, Flask, FastAPI, Pyramid, aiohttp, Tornado, PyQt, Tkinter
  - Build Tools: pip, poetry, setuptools, conda, virtualenv, pyenv
- **R** (`.r`, `.R`, `.Rmd`)
  - Frameworks: Shiny, tidyverse, ggplot2, caret, mlr3
  - Build Tools: devtools, renv, packrat, rmarkdown
- **Julia** (`.jl`)
  - Frameworks: Flux, JuMP, DifferentialEquations, Plots
  - Build Tools: Pkg, BinaryBuilder, PackageCompiler

### Systems and Embedded Programming
- **C** (`.c`, `.h`)
  - Frameworks: GTK, SDL, OpenGL, Qt
  - Build Tools: Make, CMake, Autotools, GCC, Clang
- **C++** (`.cpp`, `.cc`, `.hpp`)
  - Frameworks: Qt, Boost, POCO, OpenCV, SDL
  - Build Tools: CMake, Make, Ninja, Bazel, vcpkg
- **Rust** (`.rs`)
  - Frameworks: Actix, Rocket, Tokio
  - Build Tools: cargo, rustc

### Mobile Development
- **Swift** (`.swift`)
  - Frameworks: SwiftUI, UIKit, Vapor, Perfect, Kitura
  - Build Tools: swift, xcodebuild, SPM, CocoaPods, Carthage
- **Kotlin** (`.kt`, `.kts`)
  - Frameworks: Spring, Ktor, Android, Compose, KMM
  - Build Tools: Gradle, Maven, Bazel
- **Dart** (`.dart`)
  - Frameworks: Flutter, AngularDart, Aqueduct
  - Build Tools: pub, dart2js, dartanalyzer, dart2native

### Cloud and DevOps
- **Go** (`.go`)
  - Frameworks: Gin, Echo, Fiber, Buffalo, Beego, Revel
  - Build Tools: go build, go mod, goreleaser, air
- **Bash** (`.sh`, `.bash`)
  - Frameworks: GNU Core Utils, Shell Utils, AWK, sed
  - Build Tools: shellcheck, shfmt, bats
- **HCL/Terraform** (`.tf`, `.tfvars`)
  - Frameworks: Terraform providers, Terragrunt
  - Build Tools: terraform, terragrunt
- **YAML** (`.yaml`, `.yml`)
  - Frameworks: Kubernetes, Docker Compose, GitHub Actions, GitLab CI
  - Build Tools: yamllint, yq

### Enterprise and Backend
- **Java** (`.java`)
  - Frameworks: Spring, Jakarta EE, Micronaut, Quarkus, Android
  - Build Tools: Maven, Gradle, Ant, sbt
- **C#** (`.cs`)
  - Frameworks: .NET Core, ASP.NET, Unity, Xamarin, MAUI
  - Build Tools: dotnet, MSBuild, NuGet, Cake

### Functional Programming
- **Haskell** (`.hs`, `.lhs`)
  - Frameworks: Yesod, Servant, Snap, IHP
  - Build Tools: cabal, stack, ghc
- **Erlang** (`.erl`, `.hrl`)
  - Frameworks: OTP, Cowboy, Phoenix, ChicagoBoss
  - Build Tools: rebar3, erlang.mk, mix
- **Elixir** (`.ex`, `.exs`)
  - Frameworks: Phoenix, Nerves, Absinthe, Ecto
  - Build Tools: mix, hex, rebar3
- **Scala** (`.scala`, `.sc`)
  - Frameworks: Play, Akka, Apache Spark, Lagom, http4s
  - Build Tools: sbt, Maven, Gradle, Mill

### Domain-Specific
- **SQL** (`.sql`)
  - Dialects: PostgreSQL, MySQL, SQLite, MS SQL, Oracle
  - Tools: PL/pgSQL, T-SQL, PL/SQL
- **GraphQL** (`.graphql`, `.gql`)
  - Frameworks: Apollo, Relay, GraphQL-Java, Absinthe
  - Tools: GraphiQL, Playground, Prisma
- **Protocol Buffers** (`.proto`)
  - Tools: protoc, buf
  - Related: gRPC, Thrift

## Language Analysis Features

### Static Analysis
- Type system validation
- Memory management patterns
- Compilation optimization
- Security vulnerability detection
- Code quality metrics

### Dynamic Analysis
- Runtime behavior analysis
- Performance profiling
- Memory usage patterns
- Concurrency issues
- Resource leaks

### Cross-Language Analysis
- Interface consistency
- Data serialization patterns
- Error propagation
- Type compatibility
- Build system integration

### Framework-Specific Analysis
- Architecture patterns
- Component structure
- State management
- Performance optimization
- Security best practices

### Build Tool Integration
- Configuration validation
- Dependency management
- Build optimization
- Platform compatibility
- Deployment considerations

## Implementation Status

| Language Category | Basic Support | Advanced Analysis | Testing Generation |
|-------------------|---------------|-------------------|-------------------|
| Web Development   | ✅            | 🚧                | 🚧                |
| Data Science      | ✅            | 🚧                | 🚧                |
| Systems           | 🚧            | 🚧                | ❌                |
| Mobile            | 🚧            | ❌                | ❌                |
| Cloud and DevOps  | ✅            | 🚧                | 🚧                |
| Enterprise        | ✅            | 🚧                | 🚧                |
| Functional        | 🚧            | ❌                | ❌                |
| Domain-Specific   | ✅            | 🚧                | ❌                |

## Roadmap for Language Support

Our language support implementation follows this priority order:

1. **Core Web Languages**: TypeScript, JavaScript, Python
2. **Backend/Enterprise**: Java, C#, Go
3. **DevOps/Infrastructure**: YAML, HCL, Bash
4. **Mobile**: Swift, Kotlin, Dart
5. **Systems**: C, C++, Rust
6. **Functional**: Scala, Haskell, Elixir
7. **Domain-Specific**: SQL, GraphQL, Protocol Buffers

## Handling Unsupported Languages

When encountering files with unsupported extensions, the system will:
1. Log a warning with the unsupported file extensions
2. Provide a list of supported alternatives
3. Continue analysis with supported files
4. Include unsupported files in the report for visibility
