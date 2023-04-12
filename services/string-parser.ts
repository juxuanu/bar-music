export default function parseString(str: string): string | null {
  return new DOMParser().parseFromString(str, "text/html").documentElement
    .textContent;
}
