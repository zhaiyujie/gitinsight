export interface DependencyAnalysis {
  hasPackageJson: boolean;
  dependencyCount: number;
  devDependencyCount: number;
  dependencies: string[];
  devDependencies: string[];
  scripts: { name: string; command: string }[];
}

export function analyzeDependencies(packageJson: any | null): DependencyAnalysis {
  if (!packageJson) {
    return {
      hasPackageJson: false,
      dependencyCount: 0,
      devDependencyCount: 0,
      dependencies: [],
      devDependencies: [],
      scripts: [],
    };
  }

  const deps = Object.keys(packageJson.dependencies || {});
  const devDeps = Object.keys(packageJson.devDependencies || {});
  const scripts = Object.entries(packageJson.scripts || {}).map(([name, command]) => ({
    name,
    command: command as string,
  }));

  return {
    hasPackageJson: true,
    dependencyCount: deps.length,
    devDependencyCount: devDeps.length,
    dependencies: deps,
    devDependencies: devDeps,
    scripts,
  };
}
