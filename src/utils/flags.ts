const flagModules = import.meta.glob("../assets/images/flags/*.webp", {
  eager: true,
  import: "default",
});

export const flags: Record<string, string> = {};

Object.entries(flagModules).forEach(([path, image]) => {
  const filename = path.split("/").pop()!.replace(".webp", "");

  flags[filename.toLowerCase()] = image as string;
});
