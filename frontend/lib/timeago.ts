export default function timeago(dateString: string) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)}h ago`;

  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)}m ago`;

  return "just now";
}
