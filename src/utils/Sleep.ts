export default async function Sleep(milliseconds: number = 1000) {
  return new Promise((resovle) => setTimeout(() => resovle({}), milliseconds));
}
