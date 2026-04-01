export function createJobNumber() {
  return `CV${Date.now().toString().slice(-6)}`;
}