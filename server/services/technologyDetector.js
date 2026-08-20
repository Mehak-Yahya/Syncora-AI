const normalizePath = (filePath = "") =>
  filePath.replace(/\\/g, "/").toLowerCase();

const detectLanguages = (files = []) => {
  const languages = new Set();

  files.forEach((file) => {
    const path = normalizePath(file.path || file);

    if (path.endsWith(".js") || path.endsWith(".jsx")) {
      languages.add("JavaScript");
    }

    if (path.endsWith(".ts") || path.endsWith(".tsx")) {
      languages.add("TypeScript");
    }

    if (
      path.endsWith(".py") ||
      path.endsWith("requirements.txt") ||
      path.endsWith("pyproject.toml") ||
      path.endsWith("setup.py") ||
      path.endsWith("pipfile")
    ) {
      languages.add("Python");
    }

    if (path.endsWith(".java")) {
      languages.add("Java");
    }

    if (path.endsWith(".cpp") || path.endsWith(".cc")) {
      languages.add("C++");
    }

    if (path.endsWith(".c")) {
      languages.add("C");
    }

    if (path.endsWith(".go")) {
      languages.add("Go");
    }

    if (path.endsWith(".rs")) {
      languages.add("Rust");
    }

    if (path.endsWith(".php")) {
      languages.add("PHP");
    }

    if (path.endsWith(".rb")) {
      languages.add("Ruby");
    }

    if (path.endsWith(".dart")) {
      languages.add("Dart");
    }

    if (path.endsWith(".swift")) {
      languages.add("Swift");
    }

    if (path.endsWith(".kt")) {
      languages.add("Kotlin");
    }

    if (path.endsWith(".cs")) languages.add("C#");
    if (path.endsWith(".m") || path.endsWith(".mm")) {
      languages.add("Objective-C");
    }
    if (path.endsWith(".sql")) languages.add("SQL");
    if ([".sh", ".bash", ".zsh"].some((extension) => path.endsWith(extension))) {
      languages.add("Shell");
    }
    if (path.endsWith(".r")) languages.add("R");
    if (path.endsWith(".lua")) languages.add("Lua");
    if (path.endsWith(".ex") || path.endsWith(".exs")) {
      languages.add("Elixir");
    }
    if (path.endsWith(".scala")) languages.add("Scala");
    if (path.endsWith(".clj") || path.endsWith(".cljs")) {
      languages.add("Clojure");
    }
    if (path.endsWith(".sol")) languages.add("Solidity");

    if (path.endsWith(".html") || path.endsWith(".htm")) {
      languages.add("HTML");
    }

    if (path.endsWith(".css")) {
      languages.add("CSS");
    }
  });

  return [...languages];
};

const detectFromPackageJson = (packageJson) => {
  const result = {
    frontend: [],
    backend: [],
    frameworks: [],
    database: [],
    styling: [],
    authentication: [],
    testing: [],
    buildTools: [],
  };

  if (!packageJson) {
    return result;
  }

  const dependencies = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.devDependencies || {}),
  };

  const has = (name) => Boolean(dependencies[name]);

  // Frontend
  if (has("react")) result.frontend.push("React");
  if (has("next")) result.frontend.push("Next.js");
  if (has("vue")) result.frontend.push("Vue");
  if (has("@angular/core")) result.frontend.push("Angular");
  if (has("svelte")) result.frontend.push("Svelte");

  // Backend
  if (has("express")) result.backend.push("Express");
  if (has("fastify")) result.backend.push("Fastify");
  if (has("@nestjs/core")) result.backend.push("NestJS");

  // Database
  if (has("mongoose")) result.database.push("MongoDB");
  if (has("mongodb")) result.database.push("MongoDB");
  if (has("pg")) result.database.push("PostgreSQL");
  if (has("mysql2")) result.database.push("MySQL");
  if (has("prisma") || has("@prisma/client")) {
    result.database.push("Prisma");
  }

  // Styling
  if (has("tailwindcss")) result.styling.push("Tailwind CSS");
  if (has("styled-components")) {
    result.styling.push("Styled Components");
  }

  // Authentication
  if (has("jsonwebtoken")) result.authentication.push("JWT");
  if (has("passport")) result.authentication.push("Passport.js");
  if (has("bcrypt") || has("bcryptjs")) {
    result.authentication.push("bcrypt");
  }

  // Testing
  if (has("jest")) result.testing.push("Jest");
  if (has("vitest")) result.testing.push("Vitest");
  if (has("mocha")) result.testing.push("Mocha");
  if (has("@playwright/test")) result.testing.push("Playwright");

  // Build tools
  if (has("vite")) result.buildTools.push("Vite");
  if (has("webpack")) result.buildTools.push("Webpack");
  if (has("esbuild")) result.buildTools.push("esbuild");

  return result;
};

const detectFromFiles = (files = []) => {
  const paths = files.map((file) =>
    normalizePath(file.path || file)
  );

  const result = {
    frontend: [],
    backend: [],
    frameworks: [],
    database: [],
    styling: [],
    authentication: [],
    testing: [],
    deployment: [],
  };

  const hasPath = (pattern) =>
    paths.some((path) => path.includes(pattern));

  // Frontend
  if (hasPath("src/components") || hasPath("src/pages")) {
    result.frontend.push("Frontend application");
  }

  if (paths.some((path) => /\.(html?|css)$/i.test(path))) {
    result.frontend.push("Static web");
  }

  if (paths.some((path) => /(^|\/)vite\.config\./i.test(path))) {
    result.frameworks.push("Vite");
  }

  if (paths.some((path) => /(^|\/)src\/.*\.(jsx|tsx)$/i.test(path))) {
    result.frameworks.push("React");
  }

  // Backend
  if (
    hasPath("server.js") ||
    hasPath("app.js") ||
    hasPath("controllers/") ||
    hasPath("routes/")
  ) {
    result.backend.push("Node.js backend");
    result.frameworks.push("Express");
  }

  // Database
  if (hasPath("models/")) {
    result.database.push("Database models detected");
  }

  // Styling
  if (
    hasPath("tailwind.config") ||
    hasPath("postcss.config")
  ) {
    result.styling.push("CSS/PostCSS configuration");
  }

  // Authentication
  if (
    hasPath("auth") ||
    hasPath("middleware/auth")
  ) {
    result.authentication.push("Authentication implementation detected");
  }

  // Testing
  if (
    hasPath("__tests__") ||
    hasPath("tests/") ||
    hasPath("test/")
  ) {
    result.testing.push("Tests detected");
  }

  // Deployment
  if (
    hasPath("dockerfile") ||
    hasPath("docker-compose") ||
    hasPath("render.yaml") ||
    hasPath("vercel.json") ||
    hasPath("railway.json")
  ) {
    result.deployment.push("Deployment configuration detected");
  }

  return result;
};

export const detectTechnologies = ({
  files = [],
  packageJson = null,
}) => {
  const languages = detectLanguages(files);

  const packageTechnologies =
    detectFromPackageJson(packageJson);

  const fileTechnologies =
    detectFromFiles(files);

  return {
    languages,

    frameworks: [
      ...new Set([
        ...packageTechnologies.frontend,
        ...packageTechnologies.backend,
        ...packageTechnologies.buildTools,
        ...fileTechnologies.frameworks,
      ]),
    ],

    frontend: [
      ...new Set([
        ...packageTechnologies.frontend,
        ...fileTechnologies.frontend,
      ]),
    ],

    backend: [
      ...new Set([
        ...packageTechnologies.backend,
        ...fileTechnologies.backend,
      ]),
    ],

    database: [
      ...new Set([
        ...packageTechnologies.database,
        ...fileTechnologies.database,
      ]),
    ],

    styling: [
      ...new Set([
        ...packageTechnologies.styling,
        ...fileTechnologies.styling,
      ]),
    ],

    authentication: [
      ...new Set([
        ...packageTechnologies.authentication,
        ...fileTechnologies.authentication,
      ]),
    ],

    testing: [
      ...new Set([
        ...packageTechnologies.testing,
        ...fileTechnologies.testing,
      ]),
    ],

    buildTools: [
      ...new Set(packageTechnologies.buildTools),
    ],

    deployment: [
      ...new Set(fileTechnologies.deployment),
    ],
  };
};