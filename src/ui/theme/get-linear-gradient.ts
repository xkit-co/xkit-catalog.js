export default function getLinearGradient(top: string, bottom: string): string {
  return `linear-gradient(to bottom, ${top}, ${bottom})`
}
